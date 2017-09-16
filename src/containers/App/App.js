import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-async-connect';
import Helmet from 'react-helmet';
import { push } from 'react-router-redux';
import './App.scss';
import { isLoaded as isAuthLoaded, load as loadAuth } from 'redux/modules/auth';

@asyncConnect([{
  promise: ({ store: { dispatch, getState } }) => {
    const promises = [];

    if (!isAuthLoaded(getState())) {
      promises.push(dispatch(loadAuth()));
    }

    return Promise.all(promises);
  }
}])
@connect(state => ({ user: state.auth.user }), { pushState: push })
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
        <Helmet title="dog" />
        {this.props.children}
      </div>
    );
  }
}
