import * as ACTION_TYPES from '../constants/actionTypes';
import initialState from '../constants/initialState';

export default function (state = initialState.companyInfo, action) {
  switch (action.type) {
    case ACTION_TYPES.GET_COMPANY_INFO_SUCCESS:
      return { ...state, ...action.payload };
    case ACTION_TYPES.EDIT_COMPANY_INFO_SUCCESS:
      return { ...state, ...action.payload };
    default: {
      return state;
    }
  }
}
