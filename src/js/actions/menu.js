import requester from '../services/requester';
import { GET_MENU } from '../constants/actionTypes';

const uri = '/menu';

export const getMenuInfo = () => {
  return (dispatch) => {
    requester.get(uri)
      .then((res) => {
        dispatch({
          type: GET_MENU,
          payload: res.data,
        });
      })
      .catch(error => console.log(error));
  };
};

