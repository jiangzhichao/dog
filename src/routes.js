import React from 'react';
import { IndexRoute, Route } from 'react-router';
import { isLoaded as isAuthLoaded, load as loadAuth } from 'redux/modules/auth';
import {
  App,
  Chat,
  Home,
  Widgets,
  About,
  Login,
  LoginSuccess,
  Survey,
  NotFound,
  Pagination,
} from 'containers';

export default (store) => {
  const requireLogin = (nextState, replace, cb) => {
    function checkAuth() {
      const { auth: { user } } = store.getState();
      if (!user) replace('/');
      cb();
    }

    if (!isAuthLoaded(store.getState())) {
      store.dispatch(loadAuth()).then(checkAuth);
    } else {
      checkAuth();
    }
  };

  /**
   * Please keep routes in alphabetical order
   */
  return (
    <Route path="/" component={App}>
      <IndexRoute component={Home} />

      <Route onEnter={requireLogin}>
        <Route path="chat" component={Chat} />
        <Route path="loginSuccess" component={LoginSuccess} />
      </Route>

      <Route path="about" component={About} />
      <Route path="login" component={Login} />
      <Route path="pagination" component={Pagination} />
      <Route path="survey" component={Survey} />
      <Route path="widgets" component={Widgets} />

      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
