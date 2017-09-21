/**
 * Created by jiang on 2017/9/16.
 */
import { message } from 'antd';
import { change as changeMsg } from './message';

const CHANGE = 'home/CHANGE';
const LOAD_FRIENDS = 'home/LOAD_FRIENDS';
const CURRENT_MSG = 'home/CURRENT_MSG';
const CURRENT_MSG_LOADING = 'home/CURRENT_MSG_LOADING';

const initialState = {
  socketInit: false,
  currentKey: '1',
  openKeys: ['sub1'],
  allMsg: {},
  loadFriends: false,
  loadAllAdmins: false,
  friends: [],

  // 获取选中好友消息
  loadCurrentMsg: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CHANGE:
      return {
        ...state,
        ...action.arg
      };
    case LOAD_FRIENDS:
      return {
        ...state,
        loadFriends: true,
        friends: action.result.friends,
      };
    case CURRENT_MSG:
      state.allMsg[action.to] = action.result.messageList;

      return {
        ...state,
        allMsg: { ...state.allMsg },
        loadCurrentMsg: false
      };
    case CURRENT_MSG_LOADING:
      return {
        ...state,
        loadCurrentMsg: true
      };
    default:
      return state;
  }
}

export const change = arg => ({ type: CHANGE, arg });

export const loadFriends = () => ({
  types: ['', LOAD_FRIENDS, ''],
  promise: (client) => client.get('/admin/list')
});

export const loadMsg = (to) => ({
  types: [CURRENT_MSG_LOADING, CURRENT_MSG, ''],
  promise: (client) => client.get('/message/all', { params: { to } }),
  to
});

export const sendMsg = () => (dispatch, getState) => {
  const {
    message: { writeMsg },
    auth: { user },
    friendsList: { selectedFriend, onlineUsers },
    home: { allMsg }
  } = getState();
  if (!window.socket.id) {
    message.warning('与服务器断开连接');
    return;
  }

  const msgObj = {
    come: user._id,
    to: selectedFriend._id,
    content: writeMsg
  };
  window.socket.emit('message', {
    id: onlineUsers[selectedFriend._id].socketId,
    message: msgObj
  });

  allMsg[selectedFriend._id].push(msgObj);
  dispatch(change({ allMsg: { ...allMsg } }));

  dispatch(changeMsg({ writeMsg: '' }));
};

export const receiveMsg = (msg) => (dispatch, getState) => {
  const { allMsg } = getState().home;
  allMsg[msg.come].push(msg);
  dispatch(change({ allMsg: { ...allMsg } }));
};
