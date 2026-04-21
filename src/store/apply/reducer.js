const defaultState = {
    phone: '',
    realname: '',
    gradeID: '',
    idCard: '',
    idcardBack: '',
    idcardFront: '',
};

const fromReducer = function (state = defaultState, action) {
    switch (action.type) {
        case 'CHANGE_PHONE':
            return {
                ...state,
                phone: action.phone,
            };
        case 'CHANGE_NAME':
            return {
                ...state,
                realname: action.realname,
            };
        case 'CHANGE_GRADE':
            return {
                ...state,
                gradeID: action.gradeID,
            };
        case 'CHANGE_IDCARD':
            return {
                ...state,
                idCard: action.idCard,
            };
        case 'CHANGE_PIC':
            return {
                ...state,
                idcardFront: action.idcardFront,
            };
        case 'CHANGE_BACK_PIC':
            return {
                ...state,
                idcardBack: action.idcardBack,
            };
        default:
            return state;
    }
};

export default fromReducer;
