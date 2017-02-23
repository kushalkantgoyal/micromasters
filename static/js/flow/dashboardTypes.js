// @flow
import Decimal from 'decimal.js-light';
import type { Program } from './programTypes';

// likely to change in very near future
export type Dashboard = Array<Program>;

export type DashboardState = {
  programs:     Dashboard,
  fetchStatus?: string,
};

export type DashboardsState = {
  [username: string]: DashboardState
};

export type CoursePrice = {
  program_id: number,
  price: Decimal,
  financial_aid_availability: boolean,
  has_financial_aid_request: boolean
};

export type CoursePrices = Array<CoursePrice>;

export type CoursePricesState = {
  coursePrices: CoursePrices,
  fetchStatus?: string,
}
