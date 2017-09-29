import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import Pagination from 'react-js-pagination';
import { parse } from 'query-string';

import List from '../components/leads/List';
import SimpleInput from '../components/leads/SimpleInput';
import SideBar from '../components/leads/SideBar';
import { LEADS_PER_PAGE } from '../constants/leads';
import { getFilteredLeads } from '../actions/leads';
import queryStringBuilder from '../services/queryStringBuilder';

class Leads extends Component {
  constructor(props) {
    super(props);

    const { getFilteredLeadsDispatcher } = props;
    const { p: nextPage, c: nextCount, f: nextFilter, s: nextSort } = parse(props.queryString);
    const filter = JSON.parse(nextFilter || null);
    const sort = JSON.parse(nextSort || null);

    getFilteredLeadsDispatcher({
      p: +nextPage,
      c: +nextCount,
      f: filter,
      s: sort,
    });
    this.onChange = debounce(this.onChange.bind(this), 500, false);
    this.handlerPaginationClick = this.handlerPaginationClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { queryString: nextQuery } = nextProps;
    const { queryString } = this.props;

    if (nextQuery !== queryString) {
      const { p: nextPage, c: nextCount, f: nextFilter, s: nextSort } = parse(nextQuery);
      const { getFilteredLeadsDispatcher } = nextProps;

      getFilteredLeadsDispatcher({
        p: +nextPage,
        c: +nextCount,
        f: JSON.parse(nextFilter || null),
        s: JSON.parse(nextSort || null),
      });
    }
  }

  onChange(e) {
    const { name, value } = e.target;
    const { leads: { filter, sort, currentPage } } = this.props;
    const newFilter = {
      ...filter, [name]: value,
    };

    this.setState({
      quickSearch: value,
    });

    this.context.router.history.push(queryStringBuilder({
      page: currentPage,
      count: LEADS_PER_PAGE,
      sort,
      filter: newFilter,
    }));
  }

  handlerPaginationClick(currentPage) {
    const { getFilteredLeadsDispatcher, leads: { filter, sort } } = this.props;
    getFilteredLeadsDispatcher({ p: currentPage, c: LEADS_PER_PAGE, f: filter, s: sort });
  }

  render() {
    const { leads: { data, total, currentPage }, industries, queryString } = this.props;
    let { f: filter } = parse(this.props.queryString);
    filter = JSON.parse(filter || null);

    const quickSearch = filter.quickSearch;

    const pagination = (total / LEADS_PER_PAGE > 1) ?
      (<Pagination
        hideDisabled
        activePage={currentPage}
        itemsCountPerPage={LEADS_PER_PAGE}
        totalItemsCount={total}
        pageRangeDisplayed={5}
        onChange={(pageNum) => {
          this.handlerPaginationClick(pageNum);
        }}
      />) : (<div></div>);
    const container = (<div className="container-full">
      <div className="row">
        <SideBar />
        <div className="xs-10 leads-table">

          <div className="leads-title">Leads</div>

          <SimpleInput
            title="Quick Search"
            name="quickSearch"
            placeholder="Search"
            onChange={(e) => {
              e.persist();
              this.onChange(e, e.eventTarget);
            }}
          />
          <List
            industries={industries}
            list={data}
            total={total}
          />
          {pagination}
        </div>
      </div>
    </div>);
    return (
      <div className="leadsTable admin-panel">{ container }</div>
    );
  }
}

Leads.propTypes = {
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
  queryString: PropTypes.string.isRequired,
};

Leads.contextTypes = {
  router: React.PropTypes.shape({
    history: React.PropTypes.object.isRequired,
  }),
};

const mapStateToProps = (state) => ({
  leads: state.leads,
  industries: state.menu.industries,
});

const mapDispatchToProps = {
  getFilteredLeadsDispatcher: getFilteredLeads,
};

export default connect(mapStateToProps, mapDispatchToProps)(Leads);
