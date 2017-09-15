import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './App.scss';

export default class App extends Component {
  static propTypes = {
    children: PropTypes.object,
    user: PropTypes.object,
    pushState: PropTypes.func
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  componentWillReceiveProps(nextProps) {
    if (!this.props.user && nextProps.user) {
      this.props.pushState('/loginSuccess');
    } else if (this.props.user && !nextProps.user) {
      this.props.pushState('/');
    }
  }

  render() {
    return (
      <div className="app">
        {this.props.children}
      </div>
    );
  }
}
