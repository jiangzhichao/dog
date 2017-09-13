import React, { Component } from 'react';
import Helmet from 'react-helmet';
import logo from './logo.png';

export default class Home extends Component {
  render() {
    const styles = require('./Home.scss');
    return (
      <div className={styles.home}>
        <Helmet title="Home" />
        fuck
        <img src={logo} />
      </div>
    );
  }
}
