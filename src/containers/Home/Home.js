import React, { Component } from 'react';
import Helmet from 'react-helmet';
import logo from './logo.png';
import img2g from './2G.png';

export default class Home extends Component {
  render() {
    const styles = require('./Home.scss');
    return (
      <div className={styles.home}>
        <Helmet title="Home" />
        fuck
        <img src={logo} />
        <img src={img2g} />
      </div>
    );
  }
}
