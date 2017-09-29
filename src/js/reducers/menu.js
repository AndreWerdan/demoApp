import { GET_MENU, UPDATE_MENU } from '../constants/actionTypes';
import initialState from '../constants/initialState';

const menu = (state = initialState.menu, action) => {
  switch (action.type) {
    case GET_MENU:
      return {
        ...state, ...action.payload,
      };
    case UPDATE_MENU:
      return {
        ...state, ...action.payload,
      };
    default:
      return state;
  }
};

export default menu;
