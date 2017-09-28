/**
 * Created by jiang on 2017/9/17.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadMsg, change } from 'redux/modules/message';
import { Avatar } from 'antd';
import './FriendsList.scss';

@connect(state => ({
    user: state.auth.user,
    friends: state.message.friends,
    onlineUsers: state.message.onlineUsers,
    selectedFriend: state.message.selectedFriend,
}), { change, loadMsg })
export default class FriendsList extends Component {
    static propTypes = {
        user: PropTypes.object,
        friends: PropTypes.array,
        change: PropTypes.func,
        onlineUsers: PropTypes.object,
        selectedFriend: PropTypes.object,
        loadMsg: PropTypes.func,
    };

    render() {
        const { friends, selectedFriend, onlineUsers }  = this.props;
        return (
            <div className="friends-left">
                {
                    friends.map((item, i) => (
                        <div
                            key={i}
                            className={item._id === selectedFriend._id ? 'friends-line friends-checked' : 'friends-line'}
                            onClick={() => {
                                this.props.change({ selectedFriend: item });
                                this.props.loadMsg();
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
                                        backgroundColor: onlineUsers[item._id] ? '#108ee9' : '#ddd'
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
