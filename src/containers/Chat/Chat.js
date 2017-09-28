/**
 * Created by jiang on 2017/9/17.
 */
import React from 'react';
import FriendsList from './FriendsList/FriendsList';
import MsgList from './MsgList/MsgList';
import './Chat.scss';

export default () => (
    <div className="friends">
        <FriendsList />
        <MsgList />
    </div>
);
