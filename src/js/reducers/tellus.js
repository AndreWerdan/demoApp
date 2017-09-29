import { GO_TO_FORM, SEND_FORM, RESET_TELLUS } from '../constants/actionTypes';
import initialState from '../constants/initialState';

const industries = (state = initialState.tellus, action) => {
  switch (action.type) {
    case GO_TO_FORM:
      return {
        ...state,
        ...action.payload,
      };

    case RESET_TELLUS:
      return {
        ...state,
        ...action.payload,
      };

    case SEND_FORM:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default industries;
