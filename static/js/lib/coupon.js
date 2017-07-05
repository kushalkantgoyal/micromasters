// @flow
import Decimal from 'decimal.js-light';
import {
  COUPON_CONTENT_TYPE_PROGRAM,
  COUPON_CONTENT_TYPE_COURSE,
  COUPON_AMOUNT_TYPE_PERCENT_DISCOUNT,
  COUPON_AMOUNT_TYPE_FIXED_DISCOUNT,
  COUPON_AMOUNT_TYPE_FIXED_PRICE,
  COUPON_TYPE_DISCOUNTED_PREVIOUS_COURSE,
} from '../constants';
import type {
  Coupons,
  Coupon,
  CalculatedPrices,
} from '../flow/couponTypes';
import type {
  CoursePrice,
  CoursePrices,
} from '../flow/dashboardTypes';
import type {
  Program
} from '../flow/programTypes';

// For objects that have a program id, make a lookup for it
type HasProgramId = {
  program_id: number
};
function makeProgramIdLookup<T: HasProgramId>(arr: Array<T>): Map<number, T> {
  return new Map(arr.map((value: T) => [value.program_id, value]));
}

function* genPrices(programs: Array<Program>, prices: CoursePrices, coupons: Coupons) {
  const couponLookup: Map<number, Coupon> = makeProgramIdLookup(coupons);
  const priceLookup: Map<number, CoursePrice> = makeProgramIdLookup(prices);

  for (const program of programs) {
    for (const course of program.courses) {
      for (const run of course.runs) {
        let price = calculateRunPrice(
          run.id, course.id, program.id, priceLookup.get(program.id), couponLookup.get(program.id)
        );
        if (price !== null && price !== undefined) {
          yield [run.id, price];
        }
      }
    }
  }
}

export const calculatePrice = (
  runId: number, courseId: number, price: CoursePrice, coupons: Coupons
): [?Coupon, ?Decimal] => {
  const couponLookup: Map<number, Coupon> = makeProgramIdLookup(coupons);
  let coupon = couponLookup.get(price.program_id);
  return [coupon, calculateRunPrice(runId, courseId, price.program_id, price, coupon)];
};

export const calculatePrices = (programs: Array<Program>, prices: CoursePrices, coupons: Coupons): CalculatedPrices => {
  return new Map(genPrices(programs, prices, coupons));
};

export const _calculateDiscount = (price: Decimal, amountType: string, amount: Decimal): Decimal => {
  let newPrice = price;
  switch (amountType) {
  case COUPON_AMOUNT_TYPE_PERCENT_DISCOUNT:
    newPrice = price.times(Decimal('1').minus(amount));
    break;
  case COUPON_AMOUNT_TYPE_FIXED_DISCOUNT:
    newPrice = price.minus(amount);
    break;
  case COUPON_AMOUNT_TYPE_FIXED_PRICE:
    newPrice = amount;
    break;
  }
  if (newPrice.lessThan(0)) {
    newPrice = Decimal('0');
  }
  if (newPrice.greaterThan(price)) {
    newPrice = price;
  }
  return newPrice;
};
// allow mocking of function
export { _calculateDiscount as calculateDiscount };
import { calculateDiscount } from './coupon';

export const _calculateRunPrice = (
  runId: number, courseId: number, programId: number, programPrice: ?CoursePrice, coupon: ?Coupon
): ?Decimal => {
  if (!programPrice) {
    // don't have any price to calculate
    return null;
  }

  const startingPrice = programPrice.price;
  if (!coupon) {
    // don't have any discount to figure out
    return startingPrice;
  }

  if (
    (coupon.content_type === COUPON_CONTENT_TYPE_PROGRAM && coupon.object_id === programId) ||
    (coupon.content_type === COUPON_CONTENT_TYPE_COURSE && coupon.object_id === courseId)
  ) {
    return calculateDiscount(startingPrice, coupon.amount_type, coupon.amount);
  } else {
    // coupon doesn't match
    return startingPrice;
  }
};
// allow mocking of function
export { _calculateRunPrice as calculateRunPrice };
import { calculateRunPrice } from './coupon';

export function _makeAmountMessage(coupon: Coupon): string {
  switch (coupon.amount_type) {
  case COUPON_AMOUNT_TYPE_FIXED_DISCOUNT:
  case COUPON_AMOUNT_TYPE_FIXED_PRICE:
    return `$${coupon.amount}`;
  case COUPON_AMOUNT_TYPE_PERCENT_DISCOUNT:
    return `${coupon.amount.times(100).toDecimalPlaces(0).toString()}%`;
  default:
    return '';
  }
}
// allow mocking of function
export { _makeAmountMessage as makeAmountMessage };
import { makeAmountMessage } from './coupon';

export function _makeCouponReason(coupon: Coupon): string {
  if (coupon.coupon_type === COUPON_TYPE_DISCOUNTED_PREVIOUS_COURSE) {
    return ', because you have taken it before';
  } else {
    return '';
  }
}
// allow mocking of function
export { _makeCouponReason as makeCouponReason };
import { makeCouponReason } from './coupon';

export const _couponMessageText = (coupon: Coupon) => {
  let isDiscount = (
    coupon.amount_type === COUPON_AMOUNT_TYPE_PERCENT_DISCOUNT ||
    coupon.amount_type === COUPON_AMOUNT_TYPE_FIXED_DISCOUNT
  );

  if (isDiscount) {
    if (coupon.content_type === COUPON_CONTENT_TYPE_PROGRAM) {
      return `You will get ${makeAmountMessage(coupon)} off the cost for each course in this program`;
    } else if (coupon.content_type === COUPON_CONTENT_TYPE_COURSE) {
      return `You will get ${makeAmountMessage(coupon)} off the cost for this course`;
    }
  } else {
    if (coupon.content_type === COUPON_CONTENT_TYPE_PROGRAM) {
      return `All courses are set to the discounted price of ${makeAmountMessage(coupon)}`;
    } else if (coupon.content_type === COUPON_CONTENT_TYPE_COURSE) {
      return `This course is set to the discounted price of ${makeAmountMessage(coupon)}`;
    }
  }
  return '';
};

// allow mocking of function
export { _couponMessageText as couponMessageText };
import { couponMessageText } from './coupon';

export function makeCouponMessage(coupon: Coupon): string {
  const message = `${couponMessageText(coupon)}${makeCouponReason(coupon)}`;
  if (message) {
    return `${message}.`;
  } else {
    return '';
  }
}

export function isFreeCoupon(coupon: Coupon): boolean {
  return !!(
    coupon &&
    coupon.amount_type === COUPON_AMOUNT_TYPE_PERCENT_DISCOUNT &&
    coupon.amount.equals(1)
  );
}
