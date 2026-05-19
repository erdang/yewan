import './index.scss';
import React, { useEffect, useState, useCallback } from 'react';
import { Result, Button } from 'antd-mobile';

import instance from '@/request/index';
import urltool from 'ox-util/src/url';
import browser from 'ox-util/src/browser';
const searchParam = urltool.param(window.location.search);

const Success = () => {
    useEffect(() => {}, []);
    const [infoOrder, setInfoOrder] = useState('');
    const getOrder = useCallback(() => {
        instance
            .get('/api/v1/pay/getOrderResult', {
                params: {
                    orderid: searchParam.orderid,
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
                    type="default"
                    className="m-button"
                    color="primary"
                    onClick={() => {
                        window.location.href =
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
