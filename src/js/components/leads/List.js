import React from 'react';
import PropTypes from 'prop-types';
import Header from './HeaderRow';
import Row from './Row';

const ListComponent = ({ list, total, industries }) => {
  const leadsList = list.map((listItem, index) => (
    <Row industries={industries} rowData={listItem} index={index + 1} />));
  let container = (<div>
    <table>
      <Header />
      <tbody>
      {leadsList}
      </tbody>
    </table>
  </div>);

  if (!total) {
    container = (<div className="nothing-to-show">The is no match for this filter criteria!</div>);
  }

  return (
    <div className="list">
      {container}
    </div>);
};

ListComponent.propTypes = {
  list: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  total: PropTypes.number.isRequired,
  industries: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  })).isRequired,
};

export default ListComponent;
