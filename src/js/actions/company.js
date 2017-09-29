import { NotificationManager } from 'react-notifications';
import requester from '../services/requester';
import { GET_COMPANY_INFO_SUCCESS, EDIT_COMPANY_INFO_SUCCESS, UPDATE_MENU } from '../constants/actionTypes';

const uri = '/home';

export function getCompanyInfo() {
  return (dispatch) => {
    requester.get(uri)
      .then(res => dispatch({
        type: GET_COMPANY_INFO_SUCCESS,
        payload: res.data,
      }))
      .catch(error => NotificationManager.error(error));
  };
}
export function editCompanyInfo(options) {
  return (dispatch) => {
    requester({ url: uri, method: 'PUT', data: options })
      .then(({ data = {} }) => {
        dispatch({
          type: EDIT_COMPANY_INFO_SUCCESS,
          payload: data,
        });

        dispatch({
          type: UPDATE_MENU,
          payload: { logo: data.logo },
        });

        NotificationManager.success('Successfully edited');
      })
      .catch(error => NotificationManager.error(error));
  };
}
