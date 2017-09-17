/**
 * Created by jiang on 2017/9/16.
 */
const CHANGE = 'message/CHANGE';
const LOAD_FRIENDS = 'message/LOAD_FRIENDS';
const CURRENT_MSG = 'message/CURRENT_MSG';

const initialState = {
  loadFriends: false,
  loadAllAdmins: false,
  friends: [],
  onlineObj: {},
  selectedFriend: {},
  allMsg: {}
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
        selectedFriend: state.selectedFriend._id ? state.selectedFriend : action.result.friends[0]
      };
    case CURRENT_MSG:
      state.allMsg[state.selectedFriend._id] = action.result.messageList;

      return {
        ...state
      };
    default:
      return state;
  }
}

export const change = arg => ({ type: CHANGE, arg });

export const loadFriends = () => ({
  types: [LOAD_FRIENDS],
  promise: (client) => client.get('/admin/list')
});

export const loadMsg = (to) => ({
  types: [CURRENT_MSG],
  promise: (client) => client.get('/message/all', { params: { to } })
});
