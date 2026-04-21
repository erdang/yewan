import './index.scss';

import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Button, Dialog, InfiniteScroll } from 'antd-mobile';

import { connect } from 'react-redux';

import instance from '@/request/index';
import setTitle from '@/utility/settitle';

const CashList = ({ ticket }) => {
    const [hasMore, setHasMore] = useState(false);
    const [data, setData] = useState([]);
    const [info, setInfo] = useState('');
    const todayPage = useRef(1);

    const getinfoFn = useCallback(() => {
        instance
            .get('/api/v1/pay/withdrawLogs', {
                params: {
                    token: ticket,
                    page: todayPage.current,
                },
            })
            .then((d) => {
                if (d.code === '200') {
                    setData(d.content.list);
                    setInfo(d.content);
                }
            });
        todayPage.current++;
    }, [ticket]);

    const loadMore = useCallback(() => {
        return instance
            .get('/api/v1/pay/withdrawLogs', {
                params: {
                    token: ticket,
                    page: todayPage.current,
                },
            })
            .then((d) => {
                if (d.code === '200') {
                    setData((val) => [...val, ...d.content.list]);

                    if (d.content.list.length > 0) {
                        setHasMore(true);
                    } else {
                        setHasMore(false);
                    }
                }
            });
    }, [ticket]);

    const delCashFn = useCallback(
        (event) => {
            let tid = event.currentTarget.dataset.tid;
            instance
                .post('/api/v1/pay/cancelWithdraw', {
                    token: ticket,
                    id: tid,
                })
                .then((d) => {
                    if (d.code === '200') {
                        Dialog.alert({
                            content: '撤销成功',
                            confirmText: '确定',
                            onConfirm: () => {
                                todayPage.current = 1;
                                getinfoFn();
                            },
                        });
                    }
                });
        },
        [getinfoFn, ticket],
    );

    useEffect(() => {
        setTitle('提现记录');
        getinfoFn();
    }, [getinfoFn]);

    const cashState = {
        0: '等待审核',
        1: '已同意',
        2: '已拒绝',
        3: '待打款',
        4: '打款完成',
        5: '打款完成',
        6: '用户撤销',
    };

    let resultRows = null;

    if (data && data.length === 0) {
        resultRows = (
            <tr>
                <td colSpan={4}>
                    <div className="no__data-td">暂无数据</div>
                </td>
            </tr>
        );
    } else if (data && data.length > 0) {
        resultRows =
            data &&
            data.map((item, index) => {
                return (
                    <tr key={index}>
                        <td>{item.daystr}</td>
                        <td>{item.money}</td>
                        <td>{cashState[item.status]}</td>
                        <td>
                            <Button
                                disabled={item.status !== '0'}
                                block
                                color="primary"
                                size="small"
                                className="t__btn"
                                data-tid={item.id}
                                onClick={delCashFn}
                            >
                                撤销
                            </Button>
                        </td>
                    </tr>
                );
            });
    }

    let mainContent = null;

    if (!info) {
        mainContent = null;
    } else {
        mainContent = (
            <div className="livetime">
                <div className="time-table">
                    <table className="small-font">
                        <thead>
                            <tr>
                                <td>提现时间</td>
                                <td>提现金额</td>
                                <td>状态</td>
                                <td>操作</td>
                            </tr>
                        </thead>
                        <tbody>{resultRows}</tbody>
                    </table>
                    {info.total_page > 1 && (
                        <InfiniteScroll
                            loadMore={loadMore}
                            hasMore={hasMore}
                            threshold={0}
                        />
                    )}
                </div>
            </div>
        );
    }

    return <div className="cashLog-content">{mainContent}</div>;
};

const mapStateTpProps = (state) => {
    return { ...state.user, ...state.apply };
};

const mapDispatchToProps = {
    ChangePic: (phone) => {
        return { type: 'CHANGE_PIC', idcardFront: phone };
    },
    ChangeBackPic: (phone) => {
        return { type: 'CHANGE_BACK_PIC', idcardBack: phone };
    },
};

export default connect(mapStateTpProps, mapDispatchToProps)(CashList);
