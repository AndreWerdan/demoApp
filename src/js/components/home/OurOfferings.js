import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getIndustriesById } from '../../actions/industries';
import Button from './Button';
import Image from './Image';
import companyIntelligence from '../../../images/company_intelligence.png';
import excerptReport from '../../../images/excerpt_report.png';
import industryIntelligence from '../../../images/industry_intelligence.png';

class OurOfferings extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.onGetReports = this.onGetReports.bind(this);
  }

  onGetReports() {
    const { id, getIndustriesByIdDispatcher } = this.props;
    getIndustriesByIdDispatcher(id);
  }

  render() {
    const industries = this.props.industries;

    const button = industries.map((item) => {
      return (
        <Button url={`/client/industries/${item.id}`} type="LINK_BTN" name={item.name} />
      );
    });

    return (
      <div className="ourOfferings">
        <div className="container">
          <h2>
            Our Offerings
          </h2>
          <p>
            But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I
            will give you a complete account of the system, and expound the actual teachings of the great explorer of
            the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself,
            because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter
            consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain
            pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can
            procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical
            exercise, except to obtain some advantage from it? But who has any right to find fault with a man who
            chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no
            resultant pleasure?
          </p>

          <div className="offeringImgs row">

            <Image
              className="xs-10 xs-offset-1 s-5 m-offset-2 m-2"
              text="Excerpt Report"
              image={excerptReport}
              classForImage="offering"
            />

            <Image
              className="xs-10 xs-offset-1 s-5 m-2"
              text="Industry Intelligence"
              image={industryIntelligence}
              classForImage="offering"
            />

            <Image
              className="xs-10 xs-offset-1 s-5 m-2"
              text="Company Intelligence"
              image={companyIntelligence}
              classForImage="offering"
            />

          </div>

          <div className="offeringBtns row">
            { button }
          </div>
        </div>
      </div>
    );
  }
}

OurOfferings.propTypes = {
  id: PropTypes.string.isRequired,
  getIndustriesByIdDispatcher: PropTypes.func.isRequired,
  industries: PropTypes.arrayOf().isRequired,
};

export default connect(null, { getIndustriesByIdDispatcher: getIndustriesById })(OurOfferings);
