import './index.scss';

import { connect } from 'react-redux';
import React from 'react';

import SetPassword from '@/component/Account/SetPassword';

const SetPasswordMain = ({ ticket }) => {
    return <SetPassword type="3" api_url="" ticket={ticket}></SetPassword>;
};

const mapStateTpProps = (state) => {
    return { ...state.user };
};

const mapDispatchToProps = {
    ChangeFromStatePhoneFn: (phone) => {
        return { type: 'CHANGE_PHONE', phone };
    },
};

export default connect(mapStateTpProps, mapDispatchToProps)(SetPasswordMain);
