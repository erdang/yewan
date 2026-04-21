import './index.scss';
import React, { useEffect, useState, useCallback } from 'react';
import { Result, Button } from 'antd-mobile';

import instance from '@/request/index';

import browser from 'ox-util/src/browser';

const Success = () => {
    useEffect(() => {}, []);
    const [infoOrder, setInfoOrder] = useState('');
    const getOrder = useCallback(() => {
        instance
            .get('/api/pay/getOrderResult', {
                params: {
                    orderid: localStorage.getItem('orderId'),
                },
            })
            .then((d) => {
                setInfoOrder(d.content);
            });
    }, []);

    let sContent = null;
    if (infoOrder.result === '1') {
        sContent = <Result status="success" title="支付成功" />;
    } else if (infoOrder.result === '0') {
        sContent = <Result status="error" title="支付失败" />;
    } else {
        sContent = <Result status="success" title="查询中" />;
    }

    useEffect(() => {
        setTimeout(() => {
            getOrder();
        }, 1500);
    }, [getOrder]);
    return (
        <div>
            {sContent}
            {browser.iswechat() ? null : (
                <Button
                    block
                    type="button"
                    color="primary"
                    onClick={() => {
                        window.location.origin + '/h5Pay';
                    }}
                >
                    返回充值页面
                </Button>
            )}
        </div>
    );
};

export default Success;
