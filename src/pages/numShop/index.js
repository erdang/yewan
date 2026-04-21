import './index.scss';

import MyLevel from './component/Viplevel';
import { connect } from 'react-redux';

const mapStateTpProps = (state) => {
    return { ...state.user };
};

const mapDispatchToProps = {};

export default connect(mapStateTpProps, mapDispatchToProps)(MyLevel);
