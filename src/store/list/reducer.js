const defaultState = {
    list: ['react真好玩', 'koa有点意思', 'ssr更有意思'],
};

const listReducer = function (state = defaultState, action) {
    switch (action.type) {
        case 'CHANGE_LIST':
            return {
                ...state,
                list: action.list,
            };
        default:
            return state;
    }
};

export default listReducer;
