import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-async-connect';
import { logout } from 'redux/modules/auth';
import { change } from 'redux/modules/home';
import { loadFriends, loadMsg } from 'redux/modules/message';
import Helmet from 'react-helmet';
import { Menu, Icon, Avatar, Button, Spin } from 'antd';
import io from 'socket.io-client';
import { Chat } from 'containers';
// import { AddAdmin, ChatAdmin, AddGroup, JoinGroup } from 'containers';
const SubMenu = Menu.SubMenu;
import './Home.scss';

@asyncConnect([{
  promise: ({ store: { dispatch, getState } }) => {
    if (!getState().message.loadFriends) {
      return new Promise((resolve) => {
        dispatch(loadFriends()).then((s) => {
          if (s.friends.length > 0) {
            dispatch(loadMsg(s.friends[0]._id)).then(resolve);
          } else {
            resolve();
          }
        });
      });
    }
  }
}])
@connect(state => ({ user: state.auth.user, home: state.home }), { logout, change })
export default class Home extends Component {
  static propTypes = {
    user: PropTypes.object,
    home: PropTypes.object,
    logout: PropTypes.func,
    change: PropTypes.func
  };

  componentDidMount() {
    const socket = window.socket = this.socket = io('', { path: '/ws' });
    socket.on('connect', () => {
      this.props.change({ socketInit: true });
      socket.emit('login', this.props.user);
    });
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
          onClick={this.props.logout}
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
      // 2: <AddAdmin />,
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
      this.props.home.socketInit ?
        <div className="j-home">
          <Helmet title="Home" />
          { this.renderTop() }
          { this.renderLeft() }
          { this.renderRight() }
        </div> :
        <Spin
          spinning
          tip="连接socket。。。">
          <div style={{ marginTop: '50%' }} />
        </Spin>
    );
  }
}


