import * as types from '../constants/actionTypes';
import initialState from '../constants/initialState';

export default function (state = initialState.auth, action) {
  switch (action.type) {
    case types.AUTH_SUCCESS:
      return { ...state, authed: true, error: '' };
    case types.AUTH_ERROR:
      return { ...state, authed: false, error: action.payload || '' };
    default:
      return state;
  }
}
