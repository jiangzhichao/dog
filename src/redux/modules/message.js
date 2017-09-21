/**
 * Created by jiang on 2017/9/16.
 */
const CHANGE = 'message/CHANGE';

const initialState = {
  previewVisible: false,
  previewImageUrl: '',
  writeMsg: '',
  serverReceiveMsg: null,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CHANGE:
      return {
        ...state,
        ...action.arg
      };
    default:
      return state;
  }
}

export const change = arg => ({ type: CHANGE, arg });


