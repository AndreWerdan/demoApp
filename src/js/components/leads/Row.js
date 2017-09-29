import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { find } from 'lodash';

import { LEADS_FIELDS_DIRECTION } from '../../constants/leads';

const RowComponent = ({ rowData, index, industries }) => {
  const row = [<td>{index}</td>];
  const checkBtn = (<img
    src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDQ5MC4wNSA0OTAuMDUiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ5MC4wNSA0OTAuMDU7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4Ij4KPGc+Cgk8Zz4KCQk8cGF0aCBkPSJNNDE4LjI3NSw0MTguMjc1Yzk1LjctOTUuNyw5NS43LTI1MC44LDAtMzQ2LjVzLTI1MC44LTk1LjctMzQ2LjUsMHMtOTUuNywyNTAuOCwwLDM0Ni41UzMyMi42NzUsNTEzLjk3NSw0MTguMjc1LDQxOC4yNzUgICAgeiBNMTU3LjE3NSwyMDcuNTc1bDU1LjEsNTUuMWwxMjAuNy0xMjAuNmw0Mi43LDQyLjdsLTEyMC42LDEyMC42bC00Mi44LDQyLjdsLTQyLjctNDIuN2wtNTUuMS01NS4xTDE1Ny4xNzUsMjA3LjU3NXoiIGZpbGw9IiM5MURDNUEiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K" />);

  for (let i = 0; i < LEADS_FIELDS_DIRECTION.length; i++) {
    if (Object.prototype.hasOwnProperty.call(rowData, LEADS_FIELDS_DIRECTION[i])) {
      let text = (rowData[LEADS_FIELDS_DIRECTION[i]]);

      if (LEADS_FIELDS_DIRECTION[i] === 'createdAt') {
        text = moment(rowData[LEADS_FIELDS_DIRECTION[i]].toString()).format('LLL');
      }

      const className = (rowData[LEADS_FIELDS_DIRECTION[i]].toString() === 'true') ? 'hasCheck' : '';
      row.push(
        <td
        >
          {text}
        </td>);
    }
  }

  for (let i = 0; i < industries.length; i++) {
    const currentIndustry = find(rowData.reports, { industryId: industries[i].id });

    if (currentIndustry) {
      row.push(<td className={(currentIndustry.downloadReport) ? 'hasCheck' : ''}>
        {(currentIndustry.downloadReport) ? (checkBtn) : (<div></div>)}
      </td>);
      row.push(<td className={(currentIndustry.industryReport) ? 'hasCheck' : ''}>
        {(currentIndustry.industryReport) ? (checkBtn) : (<div></div>)}
      </td>);
      row.push(<td className={(currentIndustry.companyReport) ? 'hasCheck' : ''}>
        {(currentIndustry.companyReport) ? (checkBtn) : (<div></div>)}
      </td>);
    } else {
      row.push(<td></td>, <td></td>, <td></td>);
    }
  }

  return (<tr>
    {row}
  </tr>);
};

RowComponent.propTypes = {
  rowData: PropTypes.shape({}).isRequired,
  index: PropTypes.string.isRequired,
  industries: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  })).isRequired,
};

export default RowComponent;
