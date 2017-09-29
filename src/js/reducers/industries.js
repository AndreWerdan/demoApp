import { SET_INDUSTRIES, GET_INDUSTRIES_BY_ID, SAVE_FEATURED_COMPANIES, UPDATE_FEATURED_COMPANIES, DELETE_FEATURED_COMPANIES } from '../constants/actionTypes';
import initialState from '../constants/initialState';

const industries = (state = initialState.industries, action) => {
  switch (action.type) {
    case SET_INDUSTRIES:
      return {
        ...state,
        industriesAll: [...action.payload],
      };
    case SAVE_FEATURED_COMPANIES:
      return {
        ...state,
        industryInfo: { ...state.industryInfo.featuredCompanies.data, featuredCompanies: { data: [action.payload.save, ...state.industryInfo.featuredCompanies.data] } },
      };
    case UPDATE_FEATURED_COMPANIES: {
      const changeFeaturedCompanies = state.industryInfo.featuredCompanies.data.map((item) => {
        if (item.title === action.payload.previousTitle) {
          return {
            id: item.id,
            url: action.payload.save.url,
            title: action.payload.save.title,
          };
        }

        return item;
      });

      return {
        ...state,
        industryInfo: { ...state.industryInfo.featuredCompanies.data, featuredCompanies: { data: changeFeaturedCompanies } },
      };
    }
    case DELETE_FEATURED_COMPANIES: {
      const _changeFeaturedCompanies = state.industryInfo.featuredCompanies.data.filter(item => item.title !== action.payload);

      return {
        ...state,
        industryInfo: { ...state.industryInfo.featuredCompanies.data, featuredCompanies: { data: _changeFeaturedCompanies } },
      };
    }
    case GET_INDUSTRIES_BY_ID:
      return {
        ...state,
        industryInfo: { ...state.industryInfo, ...action.payload },
      };
    default:
      return state;
  }
};

export default industries;
