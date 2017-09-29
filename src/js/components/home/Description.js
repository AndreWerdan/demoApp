import React, { Component } from 'react';

export default (props) => (
  <div className="description">
    <div className="container">
      <h2>
        Introduction
      </h2>
      <p>
        {props.text}
      </p>
    </div>
  </div>
);
