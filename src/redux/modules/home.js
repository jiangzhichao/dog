/**
 * Created by jiang on 2017/9/16.
 */
const CHANGE = 'home/CHANGE';

const initialState = {
    currentKey: '1',
    openKeys: ['sub1'],
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
