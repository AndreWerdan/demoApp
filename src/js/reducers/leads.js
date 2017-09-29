import { GET_FILTERED_LEADS, SET_LEADS_FILTER_DATA } from '../constants/actionTypes';
import initialState from '../constants/initialState';

const industries = (state = initialState.leads, action) => {
  switch (action.type) {
    case GET_FILTERED_LEADS:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default industries;
