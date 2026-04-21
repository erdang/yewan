import './index.scss';

import { connect } from 'react-redux';
import React, { useCallback } from 'react';
import { Button } from 'antd-mobile';

const KeFu = (props) => {
    const kefuFn = useCallback(() => {
        window.location.assign(
            'https://work.weixin.qq.com/kfid/kfc63c4d8e73bf907e0',
        );
    }, []);
    return (
        <div className="kefu">
            <div className="kefu__logo"></div>
            <div className="kefu__text">有问题联系客服</div>
            <Button onClick={kefuFn} className="kefu__btn">
                联系客服
            </Button>
        </div>
    );
};

const mapStateTpProps = (state) => {
    return { ...state.apply, ...state.user };
};

const mapDispatchToProps = {};

export default connect(mapStateTpProps, mapDispatchToProps)(KeFu);
