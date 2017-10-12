import { message } from 'antd';
import Cookies from 'js-cookie';

const LOAD = 'auth/LOAD';
const LOAD_SUCCESS = 'auth/LOAD_SUCCESS';
const LOAD_FAIL = 'auth/LOAD_FAIL';
const LOGIN = 'auth/LOGIN';
const LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS';
const LOGIN_FAIL = 'auth/LOGIN_FAIL';
const LOGOUT = 'auth/LOGOUT';
const LOGOUT_SUCCESS = 'auth/LOGOUT_SUCCESS';
const LOGOUT_FAIL = 'auth/LOGOUT_FAIL';
const CHANGE = 'auth/CHANGE';
const REGISTER = 'auth/REGISTER';
const REGISTER_SUCCESS = 'auth/REGISTER_SUCCESS';

const initialState = {
    loaded: false,
    current: 'login'
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case LOAD:
            return {
                ...state,
                loading: true
            };
        case LOAD_SUCCESS:
            return {
                ...state,
                loading: false,
                loaded: true,
                user: action.result.user
            };
        case LOAD_FAIL:
            return {
                ...state,
                loading: false,
                loaded: false,
                error: action.error
            };
        case LOGIN:
            return {
                ...state,
                loggingIn: true,
                user: null
            };
        case LOGIN_SUCCESS:
            Cookies.set('token', action.result.token, { expires: 7 });

            return {
                ...state,
                loggingIn: false,
                user: action.result.user
            };
        case LOGIN_FAIL:
            return {
                ...state,
                loggingIn: false,
                user: null,
                loginError: action.error
            };
        case LOGOUT:
            return {
                ...state,
                loggingOut: true
            };
        case LOGOUT_SUCCESS:
            Cookies.remove('token');

            return {
                ...state,
                loggingOut: false,
                user: null
            };
        case LOGOUT_FAIL:
            return {
                ...state,
                loggingOut: false,
                logoutError: action.error
            };
        case CHANGE:
            return {
                ...state,
                ...action.arg
            };
        case REGISTER: {
            return {
                ...state,
                user: null
            };
        }
        case REGISTER_SUCCESS:
            return {
                ...state,
                user: action.result.user
            };
        default:
            return state;
    }
}

export const change = arg => ({ type: CHANGE, arg });

export const isLoaded = globalState => globalState.auth && globalState.auth.loaded;

export const load = () => ({
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('admin/loadAuth')
});

export const login = () => (dispatch, getState) => {
    const { auth: { name, password } } = getState();

    if (!name || !password) {
        message.destroy();
        message.warning('请输入用户名，密码');
        return;
    }

    return dispatch({
        types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
        promise: (client) => client.post('admin/login', { data: { name, password } })
    });
};

export const register = () => (dispatch, getState) => {
    const { auth: { name, password, againPassword } } = getState();

    if (!name || !password || !againPassword) {
        message.destroy();
        message.warning('请输入用户名，密码');
        return;
    }

    if (password !== againPassword) {
        message.destroy();
        message.warning('两次输入密码不一致');
        return;
    }

    return dispatch({
        types: [REGISTER, REGISTER_SUCCESS, ''],
        promise: (client) => client.post('admin/register', { data: { name, password } })
    });
};

export const logout = () => ({
    types: [LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAIL],
    promise: (client) => client.get('admin/logout')
});
