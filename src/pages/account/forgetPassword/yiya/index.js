import './index.scss';

import { connect } from 'react-redux';
import React from 'react';
import SetPassword from '@/component/Account/SetPassword';

const ForgetPasswordMain = ({ ticket }) => {
    return (
        <SetPassword
            type="2"
            api_url="/api/v1/user/checkSmsCode"
            api_url2="/api/v1/user/resetPwd"
            ticket={ticket}
        ></SetPassword>
    );
};

const mapStateTpProps = (state) => {
    return { ...state.user };
};

const mapDispatchToProps = {
    ChangeFromStatePhoneFn: (phone) => {
        return { type: 'CHANGE_PHONE', phone };
    },
};

export default connect(mapStateTpProps, mapDispatchToProps)(ForgetPasswordMain);
