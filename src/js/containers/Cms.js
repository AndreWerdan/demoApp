import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { NotificationContainer } from 'react-notifications';

import Menu from '../components/CmsMenu';
import Leads from './Leads';
import CompanyInfo from '../containers/CompanyInfo';
import IndustryEdit from './IndustryEdit';

class Cms extends Component {
  render() {
    return (
      <div>
        <Menu />
        <section className="pages-container main-section">
          <Switch>
            <Route exact path="/cms" component={CompanyInfo} />
            <Route path="/cms/leads" render={(props) => {
              const { location: { search } } = props;

              return (<Leads queryString={search} />);
            }} />
            <Route path="/cms/industries/:id" render={(props) => {
              const { match: { params: { id } } } = props;

              return (<IndustryEdit id={id} />);
            }} />
            <Redirect to="/cms" />
          </Switch>
        </section>
      </div>
    );
  }
}
export default Cms;
