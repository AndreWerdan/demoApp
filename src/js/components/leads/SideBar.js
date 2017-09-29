import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { debounce, find } from 'lodash';

import SimpleInput from './SimpleInput';
import BooleanDropdown from './BooleanDropdown';

import { LEADS_PER_PAGE } from '../../constants/leads';
import { getFilteredLeads } from '../../actions/leads';
import queryStringBuilder from '../../services/queryStringBuilder';

class SideBar extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = { filter: {} };

    this.onChangePersist = debounce(this.onChange.bind(this), 500, false);
    this.onChange = this.onChange.bind(this);
  }

  onDebounceChange = (e) => {
    e.persist();
    this.onChangePersist(e, e.eventTarget)
  };

  componentWillReceiveProps(nextProps) {
    const { leads: { filter } } = nextProps;

    this.setState({ filter });
  }

  onChange(e) {
    const { name, value } = e.target;
    const { getFilteredLeadsDispatcher, leads: { sort, currentPage } } = this.props;
    const { filter } = this.state;
    const industryId = e.target.attributes['data-id'] && e.target.attributes['data-id'].value;
    const newValue = {
      value,
      id: industryId,
    };

    let newFilter = { ...filter, [name]: value };

    /*if (value === '') {
     return;
     }*/

    if (industryId) {
      const fData = { ...filter };
      const rep = fData[name] || [];
      let index = -1;

      for (let i = 0; i < rep.length; i++) {
        if (rep[i].id === industryId) {
          index = i;
          break;
        }
      }

      if (index >= 0) {
        rep[index] = newValue;
      } else {
        rep.push(newValue);
      }

      fData[name] = rep;
      newFilter = fData;
    }

    this.setState({ filter: newFilter });

    if ((name === 'dateFrom' && !this.state.filter.dateTo) || (name === 'dateTo' && !this.state.filter.dateFrom)) {
      return;
    }

    this.context.router.history.push(queryStringBuilder({
      page: currentPage,
      count: LEADS_PER_PAGE,
      sort,
      filter: newFilter,
    }));
  }

  render() {
    const { industries } = this.props;

    if(!industries.length){
      return(<div>loading</div>);
    }

    return (
      <div className="xs-2 sidebar">
        <div className="leads-title">Filters</div>
        <div>
          <div className="sidebar-item">
            <label htmlFor="from">Date from: </label>
            <input id="from" name="dateFrom" className="date-from" type="date" onChange={this.onChange} />
            <label htmlFor="to">to: </label>
            <input id="to" name="dateTo" type="date" onChange={this.onChange} />
          </div>

          <SimpleInput
            title="Name"
            name="name"
            placeholder="Name"
            onChange={this.onDebounceChange}
          />

          <SimpleInput
            title="Title"
            name="jobPosition"
            placeholder="Title"
            onChange={this.onDebounceChange}
          />

          <SimpleInput
            title="Company"
            name="company"
            placeholder="Company"
            onChange={this.onDebounceChange}
          />

          <SimpleInput
            title="Email"
            name="email"
            placeholder="Email"
            onChange={this.onDebounceChange}
          />

          <BooleanDropdown
            title="Download E-Commerce Report"
            id={industries[0].id}
            name="downloadReport"
            onChange={this.onChange}
          />

          <BooleanDropdown
            title="E-Commerce Intelligence Report"
            id={industries[0].id}
            name="industryReport"
            onChange={this.onChange}
          />

          <BooleanDropdown
            title="E-Commerce Company Report"
            id={industries[0].id}
            name="companyReport"
            onChange={this.onChange}
          />

          <BooleanDropdown
            title="Download Banks Report"
            id={industries[1].id}
            name="downloadReport"
            onChange={this.onChange}
          />

          <BooleanDropdown
            title="Banks Intelligence Report"
            id={industries[1].id}
            name="industryReport"
            onChange={this.onChange}
          />

          <BooleanDropdown
            title="Banks Company Report"
            id={industries[1].id}
            name="companyReport"
            onChange={this.onChange}
          />

        </div>
      </div>
    );
  }
}

SideBar.propTypes = {
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
  })),
};

SideBar.contextTypes = {
  router: React.PropTypes.shape({
    history: React.PropTypes.object.isRequired,
  }),
};


const mapStateToProps = state => ({
  leads: state.leads,
  industries: state.menu.industries,
});

const mapDispatchToProps = {
  getFilteredLeadsDispatcher: getFilteredLeads,
};

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
