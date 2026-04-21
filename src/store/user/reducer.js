const defaultState = {
    ticket: localStorage.getItem('ticket') || 'null',
    userInfo: JSON.parse(localStorage.getItem('userInfo')) || 'null',
};
const fromReducer = function (state = defaultState, action) {
    switch (action.type) {
        case 'CHANGE_TICKET':
            return {
                ...state,
                ticket: action.ticket,
            };
        case 'CHANGE_USERINFO':
            return {
                ...state,
                userInfo: JSON.parse(action.userInfo),
            };

        default:
            return state;
    }
};

export default fromReducer;
