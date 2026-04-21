import './index.scss';

import { connect } from 'react-redux';

import ResetPhone from '@/component/Account/ResetPhone';

const mapStateTpProps = (state) => {
    return { ...state.user };
};

const mapDispatchToProps = {
    ChangeFromStatePhoneFn: (phone) => {
        return { type: 'CHANGE_PHONE', phone };
    },
};

export default connect(mapStateTpProps, mapDispatchToProps)(ResetPhone);
