/**
 * Created by jiang on 2017/9/17.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { change, loadMsg } from 'redux/modules/message';
import { Avatar } from 'antd';
import './FriendsList.scss';

@connect(state => ({
  user: state.auth.user,
  friends: state.message.friends,
  onlineObj: state.message.onlineObj,
  selectedFriend: state.message.selectedFriend,
  allMsg: state.message.allMsg
}), { change, loadMsg })
export default class Home extends Component {
  static propTypes = {
    user: PropTypes.object,
    friends: PropTypes.array,
    change: PropTypes.func,
    onlineObj: PropTypes.object,
    selectedFriend: PropTypes.object,
    loadMsg: PropTypes.func,
    allMsg: PropTypes.object
  };

  render() {
    const { friends, selectedFriend, onlineObj, allMsg }  = this.props;
    return (
      <div className="friends-left">
        {
          friends.map((item, i) => (
            <div
              key={i}
              className={item._id === selectedFriend._id ? 'friends-line friends-checked' : 'friends-line'}
              onClick={() => {
                this.props.change({ selectedFriend: item });
                if (!allMsg[item._id]) this.props.loadMsg(item._id);
              }}
            >
              {
                item.avatar &&
                <Avatar src={item.avatar.path} />
              }
              {
                !item.avatar &&
                <Avatar
                  style={{
                    backgroundColor: onlineObj[item._id] ? '#108ee9' : '#ddd'
                  }}
                >{item.name}
                </Avatar>
              }
              {'   ' + item.name}
            </div>
          ))
        }
      </div>
    );
  }
}
