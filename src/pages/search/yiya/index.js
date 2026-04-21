import './index.scss';

import { connect } from 'react-redux';
import ApplyPage from '@/component/Account/Login';

const mapStateTpProps = (state) => {
    return { ...state.user };
};

const mapDispatchToProps = {};

export default connect(mapStateTpProps, mapDispatchToProps)(ApplyPage);
