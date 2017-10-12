import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Menu, Icon, Avatar, Button } from 'antd';
import io from 'socket.io-client';
import { Chat, AddAdmin } from 'containers';
import Cookies from 'js-cookie';
// import { , ChatAdmin, AddGroup, JoinGroup } from 'containers';
const SubMenu = Menu.SubMenu;
import './Home.scss';

import { logout } from 'redux/modules/auth';
import { change } from 'redux/modules/home';
import { change as changeMsg, receiveMsg, loadFriends, loadMsg, socketReady } from 'redux/modules/message';

@connect(state => ({
    socket: state.message.socket,
    user: state.auth.user,
    home: state.home,
}), { logout, change, changeMsg, receiveMsg, loadFriends, loadMsg, socketReady })
export default class Home extends Component {
    static propTypes = {
        user: PropTypes.object,
        home: PropTypes.object,
        logout: PropTypes.func,
        change: PropTypes.func,
        changeMsg: PropTypes.func,
        receiveMsg: PropTypes.func,
        loadFriends: PropTypes.func,
        loadMsg: PropTypes.func,
        socketReady: PropTypes.func,
        socket: PropTypes.any
    };

    componentDidMount() {
        this.props.loadFriends().then(this.props.loadMsg);

        const socket = io('', { path: '/ws' });

        socket.on('connect', () => {
            socket
                .emit('authenticate', { token: Cookies.get('token') })
                .on('authenticated', () => {
                    this.props.changeMsg({ socketInit: true, socket });
                    this.props.socketReady();
                })
                .on('unauthorized', (msg) => {
                    console.log(msg);
                    this.props.changeMsg({ socketInit: false, socket: null });
                });
        });
    }

    componentWillUnmount() {
        if (this.props.socket && this.props.socket.destroy) this.props.socket.destroy();
        this.props.changeMsg({ socketInit: false, socket: null });
    }

    renderTop = () => {
        const { user } = this.props;
        const { avatar, name } = user || {};
        return (
            <div className="home-top">
                {avatar &&
                <Avatar
                    src={avatar.path}
                    style={{ marginLeft: '18px', marginTop: '4px' }}
                />}
                {!avatar &&
                <Avatar
                    style={{
                        backgroundColor: '#108ee9',
                        marginLeft: '18px', marginTop: '4px'
                    }}
                >{name}</Avatar>}
                <Button
                    onClick={() => {
                        this.props.logout().then(() => {
                            window.location.reload();
                        });
                    }}
                    style={{ float: 'right', marginRight: '18px', marginTop: '8px' }} shape="circle" icon="logout"
                    size="small" />
            </div>
        );
    };

    renderLeft = () => {
        const { home } = this.props;
        return (
            <div className="home-left">
                <Menu
                    openKeys={home.openKeys}
                    selectedKeys={[home.currentKey]}
                    onClick={(e) => this.props.change({ currentKey: e.key })}
                    onOpenChange={(e) => this.props.change({ openKeys: e })}
                    mode="inline"
                >
                    <SubMenu key="sub1" title={<span><Icon type="user" /><span>朋友</span></span>}>
                        <Menu.Item key="1">朋友聊天</Menu.Item>
                        <Menu.Item key="2">添加朋友</Menu.Item>
                        <Menu.Item key="3">删除朋友</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub2" title={<span><Icon type="team" /><span>群组</span></span>}>
                        <Menu.Item key="4">群组聊天</Menu.Item>
                        <Menu.Item key="5">创建群组</Menu.Item>
                        <Menu.Item key="6">加入群组</Menu.Item>
                        <Menu.Item key="7">删除群组</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub4" title={<span><Icon type="setting" /><span>个人中心</span></span>}>
                        <Menu.Item key="8">修改个人信息</Menu.Item>
                    </SubMenu>
                </Menu>
            </div>
        );
    };

    renderRight = () => {
        const keys = {
            1: <Chat />,
            2: <AddAdmin />,
            // 5: <AddGroup />,
            // 6: <JoinGroup />
        };

        return (
            <div className="home-right">
                {keys[this.props.home.currentKey] || '组件暂无，敬请期待'}
            </div>
        );
    };

    render() {
        return (
            <div className="j-home">
                <Helmet title="Home" />
                { this.renderTop() }
                { this.renderLeft() }
                { this.renderRight() }
            </div>
        );
    }
}


