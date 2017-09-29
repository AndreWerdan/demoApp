import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import Button from '../home/Button';
import { goToForm } from '../../actions/tellus';

import BUTTON_TYPE from '../../constants/buttonType';
import { DOWNLOAD, COMPANY, INDUSTRY } from '../../constants/tellUs';

const Available = ({ goToFormDispatcher, tellus: { download, company, industry } }) => {

  const goToFormHndlr = (data) => {
    goToFormDispatcher(data);
  };

  let container = (
    <div className="container">
      {/*<table className="content-table">
       <thead>
       <tr>
       <th>Excerpt Report</th>
       <th>Industry Inteligence</th>
       <th>Company Inteligence</th>
       </tr>
       </thead>
       <tbody>
       <tr>
       <td>Feature</td>
       <td>Feature</td>
       <td>Feature</td>
       </tr>
       <tr>
       <td>Feature</td>
       <td>Feature</td>
       <td>Feature</td>
       </tr>
       <tr>
       <td>Feature</td>
       <td>Feature</td>
       <td>Feature</td>
       </tr>
       <tr>
       <td>Feature</td>
       <td>Feature</td>
       <td>Feature</td>
       </tr>
       <tr>
       <td>Feature</td>
       <td>Feature</td>
       <td>Feature</td>
       </tr>
       <tr>
       <td>Feature</td>
       <td>Feature</td>
       <td>Feature</td>
       </tr>
       <tr>
       <td>Feature</td>
       <td>Feature</td>
       <td>Feature</td>
       </tr>
       <tr>
       <td>Feature</td>
       <td>Feature</td>
       <td>Feature</td>
       </tr>
       <tr>
       <td>Feature</td>
       <td>Feature</td>
       <td>Feature</td>
       </tr>
       </tbody>
       <tfoot>
       <tr>
       <td>
       <Button
       type={BUTTON_TYPE.goToForm}
       name="Download Report"
       className="icon-download main-btn"
       onClick={() => {
       goToFormHndlr(DOWNLOAD);
       }}
       />
       </td>
       <td>
       <Button
       type={BUTTON_TYPE.goToForm}
       name="Tell Me More"
       className="icon-info main-btn"
       onClick={() => {
       goToFormHndlr(INDUSTRY);
       }}
       />
       </td>
       <td>
       <Button
       type={BUTTON_TYPE.goToForm}
       name="Tell Me More"
       className="icon-info main-btn"
       onClick={() => {
       goToFormHndlr(COMPANY);
       }}
       />
       </td>
       </tr>
       </tfoot>
       </table>*/}
      <div className="row">
        <table className="content-table xs-12 m-4">
          <thead>
          <tr>
            <th>Excerpt Report</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>Feature</td>
          </tr>
          <tr>
            <td>Feature</td>
          </tr>
          <tr>
            <td>Feature</td>
          </tr>
          <tr>
            <td>Feature</td>
          </tr>
          <tr>
            <td>Feature</td>
          </tr>
          <tr>
            <td>Feature</td>
          </tr>
          <tr>
            <td>Feature</td>
          </tr>
          <tr>
            <td>Feature</td>
          </tr>
          <tr>
            <td>Feature</td>
          </tr>
          </tbody>
          <tfoot>
          <tr>
            <td>
              <Button
                type={BUTTON_TYPE.goToForm}
                name="Download Report"
                className="icon-download main-btn"
                onClick={() => {
                  goToFormHndlr(DOWNLOAD);
                }}
              />
            </td>
          </tr>
          </tfoot>
        </table>
        <table className="content-table xs-12 m-4">
          <thead>
          <tr>
            <th>Industry Inteligence</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>Feature</td>
          </tr>
          <tr>
            <td>Feature</td>
          </tr>
          <tr>
            <td>Feature</td>
          </tr>
          <tr>
            <td>Feature</td>
          </tr>
          <tr>
            <td>Feature</td>
          </tr>
          <tr>
            <td>Feature</td>
          </tr>
          <tr>
            <td>Feature</td>
          </tr>
          <tr>
            <td>Feature</td>
          </tr>
          <tr>
            <td>Feature</td>
          </tr>
          </tbody>
          <tfoot>
          <tr>
            <td>
              <Button
                type={BUTTON_TYPE.goToForm}
                name="Tell Me More"
                className="icon-info main-btn"
                onClick={() => {
                  goToFormHndlr(INDUSTRY);
                }}
              />
            </td>
          </tr>
          </tfoot>
        </table>
        <table className="content-table xs-12 m-4">
          <thead>
          <tr>
            <th>Company Inteligence</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>Feature</td>
          </tr>
          <tr>
            <td>Feature</td>
          </tr>
          <tr>
            <td>Feature</td>
          </tr>
          <tr>
            <td>Feature</td>
          </tr>
          <tr>
            <td>Feature</td>
          </tr>
          <tr>
            <td>Feature</td>
          </tr>
          <tr>
            <td>Feature</td>
          </tr>
          <tr>
            <td>Feature</td>
          </tr>
          <tr>
            <td>Feature</td>
          </tr>
          </tbody>
          <tfoot>
          <tr>
            <td>
              <Button
                type={BUTTON_TYPE.goToForm}
                name="Tell Me More"
                className="icon-info main-btn"
                onClick={() => {
                  goToFormHndlr(COMPANY);
                }}
              />
            </td>
          </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );

  if (download + company + industry) {
    container = (<Redirect to="/client/tellus" />);
  }

  return (<div>{container}</div>);
};

Available.propTypes = {
  goToFormDispatcher: PropTypes.func.isRequired,
  tellus: PropTypes.shape({
    download: PropTypes.bool,
    company: PropTypes.bool,
    industry: PropTypes.bool,
  }).isRequired,
};

const mapStateToProps = (state) => {
  return {
    tellus: state.tellus,
  };
};

export default connect(mapStateToProps, {
  goToFormDispatcher: goToForm,
})(Available);
