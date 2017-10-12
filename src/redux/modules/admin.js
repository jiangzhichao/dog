/**
 * Created by jiang on 2017/9/27.
 */
const CHANGE = 'admin/CHANGE';
const ADMINLIST = 'admin/ADMINLIST';
const ADMINLIST_SUCCESS = 'admin/ADMINLIST_SUCCESS';

const initialState = {
    adminList: [],
    selectedAdmin: '',
    loadingAdminList: false
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case CHANGE:
            return {
                ...state,
                ...action.arg
            };
        case ADMINLIST:
            return {
                ...state,
                loadingAdminList: true
            };
        case ADMINLIST_SUCCESS:
            return {
                ...state,
                adminList: action.result.allAdmin,
                selectedAdmin: state.selectedAdmin ? state.selectedAdmin : (action.result.allAdmin[0] ? action.result.allAdmin[0]._id : '')
            };
        default:
            return state;
    }
}

export const change = arg => ({ type: CHANGE, arg });

export const getAdminList = () => (dispatch, getState) => dispatch({
    types: [ADMINLIST, ADMINLIST_SUCCESS, ''],
    promise: (client) => client.get('/admin/all', { params: { _id: getState().auth.user._id } })
});

export const addAdmin = () => (dispatch, getState) => dispatch({
    types: ['', '', ''],
    promise: (client) => client.post('/admin/add', {
        data: {
            _id: getState().admin.selectedAdmin,
            selfId: getState().auth.user._id
        }
    })
});
