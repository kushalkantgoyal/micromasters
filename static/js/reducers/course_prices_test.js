import configureTestStore from 'redux-asserts';
import { assert } from 'chai';
import sinon from 'sinon';

import rootReducer from '../reducers';
import * as api from '../lib/api';
import {
  fetchCoursePrices,
  clearCoursePrices,
  REQUEST_COURSE_PRICES,
  RECEIVE_COURSE_PRICES_SUCCESS,
  RECEIVE_COURSE_PRICES_FAILURE,
  CLEAR_COURSE_PRICES,
} from '../actions/course_prices';
import { COURSE_PRICES_RESPONSE } from '../test_constants';
import {
  FETCH_FAILURE,
  FETCH_SUCCESS
} from '../actions';

describe('prices reducer', () => {
  let sandbox, store, dispatchThen, pricesStub;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    store = configureTestStore(rootReducer);
    dispatchThen = store.createDispatchThen(state => state.prices);
    pricesStub = sandbox.stub(api, 'getCoursePrices');
  });

  afterEach(() => {
    sandbox.restore();
    store = null;
    dispatchThen = null;
  });

  it('should have an empty default state', () => {
    return dispatchThen({type: 'unknown'}, ['unknown']).then(state => {
      assert.deepEqual(state, {});
    });
  });

  it('should fetch the prices successfully then clear it', () => {
    pricesStub.returns(Promise.resolve(COURSE_PRICES_RESPONSE));

    return dispatchThen(fetchCoursePrices('username'), [
      REQUEST_COURSE_PRICES,
      RECEIVE_COURSE_PRICES_SUCCESS,
    ]).then(({ username: pricesState }) => {
      assert.deepEqual(pricesState.coursePrices, COURSE_PRICES_RESPONSE);
      assert.equal(pricesState.fetchStatus, FETCH_SUCCESS);

      return dispatchThen(clearCoursePrices('username'), [CLEAR_COURSE_PRICES]).then(({ username: pricesState }) => {
        assert.deepEqual(pricesState, {
          coursePrices: []
        });
      });
    });
  });

  it('should fail to fetch the dashboard', () => {
    pricesStub.returns(Promise.reject());

    return dispatchThen(fetchCoursePrices('username'), [
      REQUEST_COURSE_PRICES,
      RECEIVE_COURSE_PRICES_FAILURE,
    ]).then(({ username: pricesState }) => {
      assert.equal(pricesState.fetchStatus, FETCH_FAILURE);
    });
  });
});