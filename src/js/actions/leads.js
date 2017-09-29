import { NotificationManager } from 'react-notifications';
import requester from '../services/requester';
import { GET_FILTERED_LEADS, SET_LEADS_FILTER_DATA } from '../constants/actionTypes';

const uri = '/leads/?';

export const getFilteredLeads = (data) => {
  const query = encodeURIComponent(JSON.stringify(data));
  const leadsFilteredData = {
    filter: data.f,
    sort: data.s,
    currentPage: data.p,
  };

  return (dispatch, getState, history) => {
    requester.get(`${uri}${query}`)
      .then((res) => {
        dispatch({
          type: GET_FILTERED_LEADS,
          payload: { ...res.data, ...leadsFilteredData },
        });
      })
      .catch(error => NotificationManager.error(error.message));
  };
};

