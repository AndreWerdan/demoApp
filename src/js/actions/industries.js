import { NotificationManager } from 'react-notifications';
import requester from '../services/requester';
import {
  GET_INDUSTRIES,
  SET_INDUSTRIES,
  GET_INDUSTRIES_BY_ID,
  SAVE_FEATURED_COMPANIES,
  UPDATE_FEATURED_COMPANIES,
  DELETE_FEATURED_COMPANIES,
} from '../constants/actionTypes';

const uri = '/industries';

export const getIndustriesById = (id) => {
  return (dispatch, getState) => {
    requester.get(`${uri}/${id}`)
      .then(res => dispatch({
        type: GET_INDUSTRIES_BY_ID,
        payload: res.data,
      }))
      .catch(/*error => NotificationManager.error(error)*/);
  };
};

export const setIndustries = industries => ({
  type: SET_INDUSTRIES,
  payload: industries,
});

export function getIndustries() {
  return (dispatch, getState) => {
    requester.get(uri)
      .then(res => dispatch({
        type: SET_INDUSTRIES,
        payload: res.data,
      }))
      .catch(/*error => NotificationManager.error(error)*/);
  };
}

export function saveIndustry(id, sendFormData) {
  return (dispatch, getState) => {
    requester({ url: `${uri}/${id}`, method: 'PUT', data: sendFormData })
      .then(res => {
        dispatch({
          type: GET_INDUSTRIES_BY_ID,
          payload: { pdfUrl: '', banner: '' },
        });
        NotificationManager.success('Saved successfully');
      })
      .catch(error => console.log(error));
  };
}

export function saveFeaturedCompanies(sendObject) {
  const title = sendObject.title;
  let url = `${uri}/${sendObject.id}/featuredCompanies`;
  let method = 'POST';
  let type = SAVE_FEATURED_COMPANIES;

  if (title) {
    url = `${url}/${sendObject.previousTitle}`;
    method = 'PUT';
    type = UPDATE_FEATURED_COMPANIES;
  }

  return (dispatch, getState) => {
    requester({ url, method, data: sendObject.sendFormData })
      .then(res => {
        dispatch({
          type,
          payload: { save: res.data, previousTitle: sendObject.previousTitle },
        });
        NotificationManager.success('Saved successfully');
      })
      .catch(error => console.log(error));
  };
}

export function deleteFeaturedCompany(id, title) {
  return (dispatch, getState) => {
    requester({ url: `${uri}/${id}/featuredCompanies/${title}`, method: 'DELETE' })
      .then(res => {
        dispatch({
          type: DELETE_FEATURED_COMPANIES,
          payload: title,
        });
        NotificationManager.success('Removed successfully');
      })
      .catch(error => console.log(error));
  };
}
