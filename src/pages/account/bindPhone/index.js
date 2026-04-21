import './index.scss';

import { connect } from 'react-redux';

import BindPhone from '@/component/Account/BindPhone';

const mapStateTpProps = (state) => {
    return { ...state.user };
};

const mapDispatchToProps = {
    ChangeFromStatePhoneFn: (phone) => {
        return { type: 'CHANGE_PHONE', phone };
    },
};

export default connect(mapStateTpProps, mapDispatchToProps)(BindPhone);
