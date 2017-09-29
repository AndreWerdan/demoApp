import requester from '../services/requester';
import * as types from '../constants/actionTypes';

const BASE_URL = '/auth/';

export function login({ email, password }) {

  return function (dispatch) {
    requester.post(`${BASE_URL}signIn`, { email, password })
      .then(() => {
        dispatch({ type: types.AUTH_SUCCESS });
      })
      .catch(() => {
        dispatch({ type: types.AUTH_ERROR, payload: 'Bad login' });
      });
  };
}

export function checkAuth() {
  return function (dispatch) {
    requester.get(`${BASE_URL}checkAuth`)
      .then(() => {
        dispatch({ type: types.AUTH_SUCCESS });
      })
      .catch(() => {
        dispatch({ type: types.AUTH_ERROR });
      });
  };
}

export function logout() {
  return function (dispatch) {
    requester.get(`${BASE_URL}signOut`)
      .then(() => {
        dispatch({ type: types.AUTH_ERROR });
      })
      .catch(() => {
        dispatch({ type: types.AUTH_SUCCESS });
      });
  };
}
