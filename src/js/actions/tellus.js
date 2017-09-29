import { NotificationManager } from 'react-notifications';

import requester from '../services/requester';
import { SEND_FORM, GO_TO_FORM, RESET_TELLUS } from '../constants/actionTypes';

const uri = '/leads';

export const sendForm = (data) => {
  return (dispatch, getState, history) => {
    const sendData = {
      email: data.email,
      name: data.name,
      company: data.companyName,
      jobPosition: data.job,
      downloadReport: data.download,
      industryReport: data.industry,
      companyReport: data.company,
    };
    requester({
      data: sendData,
      url: `${uri}/${data.industryId}`,
      method: 'POST',
    })
      .then((res) => {
        dispatch({
          type: SEND_FORM,
          payload: {
            downFile: true,
          },
        });
        NotificationManager.success('Leads created successfully');
      })
      .catch((error) => NotificationManager.error(error.message || 'Some error'));
  };
};

export const goToForm = (data) => {
  return (dispatch, getState, history) => {
    history.push('/client/tellus');
    dispatch({
      type: GO_TO_FORM,
      payload: data,
    });
  };
};

export const resetTellUsProps = (data) => {
  return (dispatch) => {
    dispatch({
      type: RESET_TELLUS,
      payload: data,
    });
  };
};
