import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as reduxAsyncConnect } from 'redux-async-connect';
import { loadingBarReducer } from 'react-redux-loading-bar';

import auth from './auth';
import home from './home';
import message from './message';

export default combineReducers({
  routing: routerReducer,
  loadingBar: loadingBarReducer,
  reduxAsyncConnect,
  auth,
  home,
  message
});
