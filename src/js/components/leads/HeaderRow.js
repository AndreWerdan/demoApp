import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { LEADS_PER_PAGE } from '../../constants/leads';
import queryStringBuilder from '../../services/queryStringBuilder';
import { getFilteredLeads } from '../../actions/leads';

class HeaderRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sort: props.leads.sort,
    };
  }

  onHeaderClick(e) {
    const field = e.target.attributes['data-sort'].value;
    const industryId = e.target.attributes['data-id'] && e.target.attributes['data-id'].value;
    const {
      leads: {
        filter,
        sort,
        currentPage,
      },
      getFilteredLeadsDispatcher,
    } = this.props;

    this.setState((prevState, props) => {
      const order = prevState.sort[field] ? -1 * prevState.sort[field] : 1;
      const sortObj = {
        [field]: order,
      };

      if (industryId) {
        sortObj.id = industryId;
      }

      this.context.router.history.push(queryStringBuilder({
        page: currentPage,
        count: LEADS_PER_PAGE,
        sort: sortObj,
        filter,
      }));

      return {
        sort: sortObj,
      };
    });
  }

  checkSort(field, industryId) {
    let sortOrder;
    const { sort } = this.state;

    if (Object.prototype.hasOwnProperty.call(sort, field) && industryId === sort.id) {
      sortOrder = +sort[field];
    }

    return (sortOrder === -1) ? 'down' : (sortOrder === 1) ? 'up' : '';
  }

  render() {
    const { industries } = this.props;
    return (
      <thead>
      <tr>
        <th
          data-sort="index"
        >
          Id
        </th>
        <th
          data-sort="createdAt"
          className={this.checkSort('createdAt')}
          onClick={(e) => this.onHeaderClick(e)}
        >
          Created Date
        </th>
        <th
          data-sort="name"
          className={this.checkSort('name')}
          onClick={(e) => this.onHeaderClick(e)}
        >
          Name
        </th>
        <th
          data-sort="email"
          className={this.checkSort('email')}
          onClick={(e) => this.onHeaderClick(e)}
        >
          Email
        </th>
        <th
          data-sort="company"
          className={this.checkSort('company')}
          onClick={(e) => this.onHeaderClick(e)}
        >
          Company
        </th>
        <th
          data-sort="jobPosition"
          className={this.checkSort('jobPosition')}
          onClick={(e) => this.onHeaderClick(e)}
        >
          Job title
        </th>
        <th
          data-sort="downloadReport"
          data-id={industries[0].id}
          className={this.checkSort('downloadReport', industries[0].id)}
          onClick={(e) => this.onHeaderClick(e)}
        >
          Download E-Commerce Report
        </th>
        <th
          data-id={industries[0].id}
          data-sort="industryReport"
          className={this.checkSort('industryReport', industries[0].id)}
          onClick={(e) => this.onHeaderClick(e)}
        >
          E-Commerce Intelligence Report
        </th>
        <th
          data-id={industries[0].id}
          data-sort="companyReport"
          className={this.checkSort('companyReport', industries[0].id)}
          onClick={(e) => this.onHeaderClick(e)}
        >
          E-Commerce Company Report
        </th>
        <th
          data-id={industries[1].id}
          data-sort="downloadReport"
          className={this.checkSort('downloadReport', industries[1].id)}
          onClick={(e) => this.onHeaderClick(e)}
        >
          Download Banks Report
        </th>
        <th
          data-id={industries[1].id}
          data-sort="industryReport"
          className={this.checkSort('industryReport', industries[1].id)}
          onClick={(e) => this.onHeaderClick(e)}
        >
          Banks Intelligence Report
        </th>
        <th
          data-id={industries[1].id}
          data-sort="companyReport"
          className={this.checkSort('companyReport', industries[1].id)}
          onClick={(e) => this.onHeaderClick(e)}
        >
          Banks Company Report
        </th>
      </tr>
      </thead>);
  }
}

HeaderRow.propTypes = {
  leads: PropTypes.shape({
    filter: PropTypes.shape({}),
    sort: PropTypes.shape({}),
    currentPage: PropTypes.number,
    data: PropTypes.arrayOf(PropTypes.shape({})),
    total: PropTypes.number,
  }).isRequired,
  getFilteredLeadsDispatcher: PropTypes.func.isRequired,
  industries: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  })).isRequired,
};

HeaderRow.contextTypes = {
  router: React.PropTypes.shape({
    history: React.PropTypes.object.isRequired,
  }),
};

const mapStateToProps = state => ({
  leads: state.leads,
  industries: state.menu.industries,
});

const mapDispatch = {
  getFilteredLeadsDispatcher: getFilteredLeads,
};

export default connect(mapStateToProps, mapDispatch)(HeaderRow);
