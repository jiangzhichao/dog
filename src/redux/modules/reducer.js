import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as reduxAsyncConnect } from 'redux-async-connect';
import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';

import auth from './auth';
import home from './home';
import message from './message';
import admin from './admin';

export default combineReducers({
    routing,
    loadingBar,
    reduxAsyncConnect,
    auth,
    home,
    message,
    admin
});
