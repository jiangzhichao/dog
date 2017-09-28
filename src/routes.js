import React from 'react';
import { IndexRoute, Route } from 'react-router';
import { isLoaded as isAuthLoaded, load as loadAuth } from 'redux/modules/auth';
import {
    NotFound,
    App,
    Login,
    Home
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

    return (
        <Route path="/" component={App}>
            <IndexRoute component={Login} />

            <Route onEnter={requireLogin}>
                <Route path="/home" component={Home} />
            </Route>

            <Route path="*" component={NotFound} status={404} />
        </Route>
    );
};
