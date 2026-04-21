import './index.scss';

import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';

import LayoutHead from '@/component/LayoutHead';
import GetCashRule from '@/component/Rule/GetCashRule';
import { appGate } from '@/utility/appGate';
import setTitle from '@/utility/settitle';
import instance from '@/request/index';

const UserRule = ({ ticket }) => {
    const [info, setInfo] = useState('');

    const getList = useCallback(
        (values) => {
            console.log(values);
            instance
                .post('/operation/setUserBankInfo', {
                    encpass: ticket,
                })
                .then((d) => {
                    if (d.code === '200') {
                        setInfo(d.content);
                    }
                });
        },
        [ticket],
    );
    useEffect(() => {
        setTitle('共享经济合作伙伴协议');
        getList();
    }, [getList]);

    return (
        <div className="user-rule">
            {!appGate.inApp() && <LayoutHead title="共享经济合作伙伴协议" />}
            <GetCashRule info={info}></GetCashRule>
        </div>
    );
};

const mapStateTpProps = (state) => {
    return { ...state.user };
};

const mapDispatchToProps = {};

export default connect(mapStateTpProps, mapDispatchToProps)(UserRule);
