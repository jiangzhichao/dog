/**
 * Created by jiang on 2017/9/16.
 */
import { message } from 'antd';

const CHANGE = 'message/CHANGE';
const LOAD_FRIENDS = 'message/LOAD_FRIENDS';
const CURRENT_MSG = 'message/CURRENT_MSG';
const CURRENT_MSG_LOADING = 'message/CURRENT_MSG_LOADING';

const initialState = {
    previewVisible: false,
    previewImageUrl: '',
    writeMsg: '',
    serverReceiveMsg: null,
    socketInit: false,
    socket: null,
    allMsg: {},
    loadFriends: false,
    friends: [],
    loadCurrentMsg: false,
    selectedFriend: {},
    onlineUsers: {},
    uploadQueue: {}
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
                selectedFriend: state.selectedFriend._id ? state.selectedFriend : (action.result.friends[0] || {})
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

export const loadFriends = () => (dispatch, getState) => {
    const isLoadFriends = getState().message.loadFriends;

    if (!isLoadFriends) {
        return dispatch({
            types: ['', LOAD_FRIENDS, ''],
            promise: (client) => client.get('/admin/list', { params: { _id: getState().auth.user._id } })
        });
    }

    return Promise.resolve();
};

export const loadMsg = () => (dispatch, getState) => {
    const {
        message: { selectedFriend, allMsg },
        auth: { user }
    } = getState();

    if (!allMsg[selectedFriend._id]) {
        return dispatch({
            types: [CURRENT_MSG_LOADING, CURRENT_MSG, ''],
            promise: (client) => client.get('/message/all', { params: { to: selectedFriend._id, come: user._id } }),
            to: selectedFriend._id
        });
    }

    return Promise.resolve();
};

export const sendMsg = () => (dispatch, getState) => {
    const {
        message: { writeMsg, allMsg, selectedFriend, onlineUsers, socket },
        auth: { user }
    } = getState();
    if (!socket) {
        message.warning('与服务器断开连接');
        return;
    }

    const msgObj = {
        come: user._id,
        to: selectedFriend._id,
        content: writeMsg
    };

    socket.emit('message', {
        id: onlineUsers[selectedFriend._id] ? onlineUsers[selectedFriend._id].socketId : '',
        message: msgObj
    });

    allMsg[selectedFriend._id].push(msgObj);
    dispatch(change({ allMsg: { ...allMsg }, writeMsg: '' }));
};

export const receiveMsg = (msg) => (dispatch, getState) => {
    const { allMsg } = getState().message;
    allMsg[msg.come].push(msg);
    dispatch(change({ allMsg: { ...allMsg } }));
};

export const socketReady = () => (dispatch, getState) => {
    const {
        message: { socket },
        auth: { user }
    } = getState();

    socket.emit('login', user);

    socket.on('onlineUsers', (onlineUsers) => {
        dispatch(change({ onlineUsers, socketInit: true }));
    });

    socket.on('message', (msg) => {
        dispatch(receiveMsg(msg));
    });
};

export const sendFileMsg = (fileInfo) => (dispatch, getState) => {
    const {
        message: { selectedFriend, onlineUsers, socket },
        auth: { user }
    } = getState();
    if (!socket) {
        message.warning('与服务器断开连接');
        return;
    }

    const msgObj = {
        come: user._id,
        to: selectedFriend._id,
        file: {
            name: fileInfo.file.name,
            path: user._id + '/' + fileInfo.file.name,
            size: fileInfo.file.size,
            type: fileInfo.file.type,
            creator: user._id
        },
        content: fileInfo.file.name
    };

    socket.emit('message', {
        id: onlineUsers[selectedFriend._id] ? onlineUsers[selectedFriend._id].socketId : '',
        message: msgObj
    });
};

export const changeFileMsg = (fileInfo) => (dispatch, getState) => {
    const {
        message: { selectedFriend, uploadQueue, allMsg },
        auth: { user }
    } = getState();

    if (uploadQueue[fileInfo.file.uid]) {
        allMsg[selectedFriend._id][uploadQueue[fileInfo.file.uid]] = {
            come: user._id,
            to: selectedFriend._id,
            fileInfo,
            path: user._id + '/' + fileInfo.file.name
        };
        dispatch(change({ allMsg: { ...allMsg } }));
    } else {
        uploadQueue[fileInfo.file.uid] = allMsg[selectedFriend._id].length;
        allMsg[selectedFriend._id].push({
            come: user._id,
            to: selectedFriend._id,
            fileInfo,
            path: user._id + '/' + fileInfo.file.name
        });
        dispatch(change({ allMsg: { ...allMsg }, uploadQueue: { ...uploadQueue } }));
    }
};

export const clearFileQueue = (fileInfo) => (dispatch, getState) => {
    const {
        message: { uploadQueue }
    } = getState();

    delete uploadQueue[fileInfo.file.uid];
    dispatch(change({ uploadQueue: { ...uploadQueue } }));
};
