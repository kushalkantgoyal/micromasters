"""
Factories for ecommerce models
"""
from factory import (
    LazyAttribute,
    post_generation,
    SelfAttribute,
    SubFactory,
    Trait,
)
from factory.django import DjangoModelFactory
from factory.fuzzy import (
    FuzzyAttribute,
    FuzzyChoice,
    FuzzyDecimal,
    FuzzyInteger,
    FuzzyText,
)
import faker

from courses.factories import (
    CourseRunFactory,
    CourseFactory,
    ProgramFactory,
)
from ecommerce.api import (
    make_reference_id,
    generate_cybersource_sa_signature,
)
from ecommerce.models import (
    Coupon,
    CoursePrice,
    Line,
    Order,
    Receipt,
)
from micromasters.factories import UserFactory


FAKE = faker.Factory.create()


class OrderFactory(DjangoModelFactory):
    """Factory for Order"""
    user = SubFactory(UserFactory)
    status = FuzzyChoice(
        Order.STATUSES
    )
    total_price_paid = FuzzyDecimal(low=0, high=12345)

    class Meta:  # pylint: disable=missing-docstring,no-init,too-few-public-methods,old-style-class
        model = Order


class LineFactory(DjangoModelFactory):
    """Factory for Line"""
    order = SubFactory(OrderFactory)
    price = SelfAttribute('order.total_price_paid')
    description = FuzzyText(prefix="Line ")
    course_key = FuzzyText()

    class Meta:  # pylint: disable=missing-docstring,no-init,too-few-public-methods,old-style-class
        model = Line


def gen_fake_receipt_data(order=None):
    """
    Helper function to generate a fake signed piece of data
    """
    data = {}
    for _ in range(10):
        data[FAKE.text()] = FAKE.text()
    keys = sorted(data.keys())
    data['signed_field_names'] = ",".join(keys)
    data['unsigned_field_names'] = ''
    data['req_reference_number'] = make_reference_id(order) if order else ''
    data['signature'] = generate_cybersource_sa_signature(data)
    return data


class ReceiptFactory(DjangoModelFactory):
    """Factory for Receipt"""
    order = SubFactory(OrderFactory)
    data = LazyAttribute(lambda receipt: gen_fake_receipt_data(receipt.order))

    class Meta:  # pylint: disable=missing-docstring
        model = Receipt


class CoursePriceFactory(DjangoModelFactory):
    """Factory for CoursePrice"""
    course_run = SubFactory(CourseRunFactory)
    is_valid = FuzzyAttribute(FAKE.boolean)
    price = FuzzyDecimal(low=0, high=12345)

    class Meta:  # pylint: disable=missing-docstring,no-init,too-few-public-methods,old-style-class
        model = CoursePrice


class CouponFactory(DjangoModelFactory):
    """Factory for Coupon"""
    coupon_code = FuzzyText()
    amount_type = 'percent-discount'
    amount = 0.5
    num_coupons_available = 15
    num_redemptions_per_user = 2

    class Meta:
        model = Coupon

    content_object = SubFactory(ProgramFactory)

    @post_generation
    def content_type(self, create, extracted, **kwargs):
        return self.content_object.__class__

    @post_generation
    def object_id(self, create, extracted, **kwargs):
        return self.content_object.id

    class Params:
        percent = Trait(
            amount_type='percent-discount',
            amount=0.5, # 50% off
        )
        fixed = Trait(
            amount_type='fixed-discount',
            amount=100, # $100 off
        )
        program = Trait(
            content_object=SubFactory(ProgramFactory)
        )
        course = Trait(
            content_object=SubFactory(CourseFactory)
        )
        course_run = Trait(
            content_object=SubFactory(CourseRunFactory)
        )
