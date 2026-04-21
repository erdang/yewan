import './index.scss';

import React, { useEffect, useCallback } from 'react';
import { connect } from 'react-redux';

import DawerOverlay from '@/component/DawerOverlay';

import setTitle from '@/utility/settitle';
import { appGate } from '@/utility/appGate';

import urlTool from 'ox-util/src/url';
import instance from '@/request/index';

const searchParam = urlTool.param(window.location.search);
//583 水晶  584 你最白白 585 西瓜汁 586 天鹅湖 330 怦然心动  587 星光仙子
//  //  // 367 海豚之恋 454 紫藤花开 397 水晶钢琴  387 438演唱会

//空中温泉 662 小熊蛋糕 658 画大饼 660
//15237723
//15455859
//15481733
const BlindBox = ({ ticket }) => {
    let getLive = useCallback(() => {
        instance
            .get('https://pre-api.njxianyuwl.cn/tester/fix', {
                params: {
                    uid: 15481733,
                    id: 662,
                    test: 'debug',
                },
            })
            .then((d) => {
                console.log(d);
            });
    }, []);

    useEffect(() => {
        getLive();
        // var videoDom = document.getElementById('myVideo');
    }, [getLive]);
    return <div className="blind__bg"></div>;
};

var BlindBoxPage = function () {
    useEffect(() => {
        setTitle('陈老师的女仆店');
    }, []);

    if (searchParam.room === 'full') {
        return (
            <div className="blind-box full">
                <BlindBox />
            </div>
        );
    }
    return (
        <DawerOverlay onClose={appGate.closeWeb} className="blind-box">
            <div className="top"></div>

            <BlindBox />
        </DawerOverlay>
    );
};
function mapStateTpProps(state) {
    return { ...state.user };
}

const mapDispatchToProps = {};

export default connect(mapStateTpProps, mapDispatchToProps)(BlindBoxPage);
