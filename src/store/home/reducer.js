const defaultState = {
    title: 'Hello Redux',
};

const counterReducer = function (state = defaultState, action) {
    switch (action.type) {
        default:
            return state;
    }
};

export default counterReducer;
