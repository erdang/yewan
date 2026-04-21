import './index.scss';

import { connect } from 'react-redux';
import ApplyPage from '@/component/Apply';

const mapStateTpProps = (state) => {
    return { ...state.apply, ...state.user };
};

const mapDispatchToProps = {
    ChangeFromStatePhoneFn: (phone) => {
        return { type: 'CHANGE_PHONE', phone };
    },
    ChangeFromStateNameFn: (realname) => {
        return { type: 'CHANGE_NAME', realname };
    },
    ChangeFromStateGradeFn: (gradeID) => {
        return { type: 'CHANGE_GRADE', gradeID };
    },
    ChangeFromStateIdCardFn: (idCard) => {
        return { type: 'CHANGE_IDCARD', idCard };
    },
};

export default connect(mapStateTpProps, mapDispatchToProps)(ApplyPage);
