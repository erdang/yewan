import './index.scss';

import { connect } from 'react-redux';
import LoginPage from '@/component/Account/Login';

const mapStateTpProps = (state) => {
    return { ...state.user };
};

const mapDispatchToProps = {};

export default connect(mapStateTpProps, mapDispatchToProps)(LoginPage);
