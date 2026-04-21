const defaultState = {
    gift: '',
};

const fromReducer = function (state = defaultState, action) {
    switch (action.type) {
        case 'CHANGE_GIFT':
            return {
                ...state,
                gift: action.gift,
            };

        default:
            return state;
    }
};

export default fromReducer;
