import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Helmet from 'react-helmet';
import './Login.scss';
import { ThreeBg } from 'components';
import { Button, Input } from 'antd';
import { connect } from 'react-redux';
import * as loginActions from 'redux/modules/auth';

@connect(state => ({ auth: state.auth }), loginActions)
export default class Login extends Component {
    static propTypes = {
        auth: PropTypes.object,
        login: PropTypes.func,
        change: PropTypes.func,
        register: PropTypes.func
    };

    constructor(...arg) {
        super(...arg);
    }

    componentDidMount() {
        document.addEventListener('keydown', this._keyDown);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this._keyDown);
    }

    _keyDown = (e) => {
        if (e.keyCode === 13) this.props.login();
    };

    render() {
        const { auth } = this.props;
        return (
            <div>
                <Helmet title="dog-login" />
                <ThreeBg
                    style={{ position: 'absolute' }}
                />
                <div
                    className="login-center-content"
                    style={{
                        opacity: auth.current === 'login' ? 0.6 : 0,
                        zIndex: auth.current === 'login' ? 101 : 99
                    }}
                >
                    <Input
                        value={auth.name}
                        onChange={(e) => {
                            this.props.change({ name: e.target.value });
                        }}
                        className="login-input"
                        placeholder="用户名"
                    />
                    <Input
                        value={auth.password}
                        onChange={(e) => {
                            this.props.change({ password: e.target.value });
                        }}
                        className="login-input"
                        placeholder="密码"
                        type="password"
                    />
                    <Button
                        style={{ width: '100%', marginBottom: '20px' }}
                        type={'primary'}
                        onClick={this.props.login}
                    >登录</Button>
                    <a
                        onClick={(e) => {
                            e.preventDefault();
                            this.props.change({ current: 'register' });
                        }}
                    >去注册</a>
                </div>
                <div
                    className="login-center-content"
                    style={{
                        opacity: auth.current === 'register' ? 0.6 : 0,
                        zIndex: auth.current === 'register' ? 101 : 99
                    }}
                >
                    <Input
                        value={auth.name}
                        onChange={(e) => {
                            this.props.change({ name: e.target.value });
                        }}
                        className="login-input"
                        placeholder="用户名"
                    />
                    <Input
                        value={auth.password}
                        onChange={(e) => {
                            this.props.change({ password: e.target.value });
                        }}
                        className="login-input"
                        placeholder="密码"
                        type="password"
                    />
                    <Input
                        value={auth.againPassword}
                        onChange={(e) => {
                            this.props.change({ againPassword: e.target.value });
                        }}
                        className="login-input"
                        placeholder="再次输入密码"
                        type="password"
                    />
                    <Button
                        style={{ width: '100%', marginBottom: '20px' }}
                        type={'primary'}
                        onClick={this.props.register}
                    >注册</Button>
                    <a
                        onClick={(e) => {
                            e.preventDefault();
                            this.props.change({ current: 'login' });
                        }}
                    >去登录</a>
                </div>
            </div>
        );
    }
}
