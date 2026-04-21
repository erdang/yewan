import './index.scss';

import React, { useCallback, useEffect, useState, createElement } from 'react';
import { Empty } from 'antd-mobile';
import { connect } from 'react-redux';

import { PageLoading } from '@/component/PageLoading';

import instance from '@/request/index';
import setTitle from '@/utility/settitle';

const CashList = ({ ticket }) => {
    const [data, setData] = useState([]);
    const [info, setInfo] = useState('');

    const getinfoFn = useCallback(() => {
        instance
            .post('/api/game/magicball/earnrank', {
                encpass: ticket,
            })
            .then((d) => {
                if (d.code === '200') {
                    setData(d.content.list);
                    setInfo(d.content);
                }
            });
    }, [ticket]);

    useEffect(() => {
        setTitle('输赢排行榜');
        getinfoFn();
    }, [getinfoFn]);

    let resultRows = null;

    if (data && data.length === 0) {
        resultRows = (
            <tr>
                <td colSpan={3}>
                    <Empty description="暂无数据" />
                </td>
            </tr>
        );
    } else if (data && data.length > 0) {
        resultRows =
            data &&
            data.map((item, index) => {
                return createElement(
                    'tr',
                    { key: index },
                    createElement('td', {}, item.ualias),
                    createElement('td', {}, item.send),
                    createElement('td', {}, item.get),
                    createElement(
                        'td',
                        { className: item.diff < 0 ? 'red' : '' },
                        item.diff,
                    ),
                );
            });
    }

    let mainContent = null;

    if (!info) {
        mainContent = <PageLoading />;
    } else {
        mainContent = (
            <div className="livetime">
                <div className="time-title">输赢排行榜</div>
                <div className="time-title">
                    <div className="time-title-li">
                        总差值：<span>{info.allDiffTotal}</span>
                    </div>
                    <div className="time-title-li">
                        记录：<span>{info.total}</span>
                    </div>
                    <div className="time-title-li">
                        日期：<span>{info.btm}</span>
                    </div>
                    <div className="time-title-li">
                        总投入：<span>{info.allSendTotal}</span>
                    </div>
                    <div className="time-title-li">
                        总获得：<span>{info.allGetTotal}</span>
                    </div>
                </div>

                <div className="time-table">
                    <table className="small-font">
                        <thead>
                            <tr>
                                <td>用户</td>
                                <td>投入</td>
                                <td>获得</td>
                                <td>投入-获得(负数为系统亏，用户赢)</td>
                            </tr>
                        </thead>
                        <tbody>{resultRows}</tbody>
                    </table>
                </div>
            </div>
        );
    }

    return <div className="cashLog-content">{mainContent}</div>;
};

const mapStateTpProps = (state) => {
    return { ...state.user };
};

const mapDispatchToProps = {};

export default connect(mapStateTpProps, mapDispatchToProps)(CashList);
