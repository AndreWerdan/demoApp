import React, { Component } from 'react';
import Image from './Image';
import ecommerce from '../../../images/Ecommerce.jpg';
import banks from '../../../images/Banks.jpg';

class ReportPreview extends Component {
  constructor() {
    super();

    this.state = {};
  }

  render() {
    return (
      <div className="reportPreview">
        <div className="container">
          <div className="m-8 m-offset-2">
            <h2>
              Report Preview
            </h2>
            <p>
              Report Preview Lorem ipsum dolor sit amet, consectetur adipiscing elit
            </p>
          </div>
          <div className="xs-10 xs-offset-1 s-8 s-offset-2">
            <div className="reportImgs row">
              <Image className="xs-10 xs-offset-1 s-5" image={ecommerce} />
              <Image className="xs-10 xs-offset-1 s-5" image={banks} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ReportPreview;
