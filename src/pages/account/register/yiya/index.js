import './index.scss';

import { connect } from 'react-redux';
import Register from '@/component/Account/Register';

const mapStateTpProps = (state) => {
    return { ...state.user };
};

const mapDispatchToProps = {};

export default connect(mapStateTpProps, mapDispatchToProps)(Register);
