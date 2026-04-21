import React, { Fragment, useEffect, useCallback, useState } from 'react';
import { PageLoading } from '@/component/PageLoading';

import setTitle from '@/utility/settitle';
import user from '@/utility/user';
import { TE_ARR } from '../contant';

const MyLevel = ({ ticket, userInfo }) => {
    const [info, setInfo] = useState('');
    const getInfo = useCallback(() => {
        user.getUser(ticket).then((d) => {
            setInfo(d);
        });
    }, [ticket]);

    useEffect(() => {
        setTitle('我的等级');
        getInfo();
    }, [getInfo]);
    let mainContent = null;
    // let liContent = TE_ARR.map((item, index) => {
    //     return (
    //         <li key={index}>
    //             <div className="info-icon-1">
    //                 <img src={item.icon} alt="" />
    //             </div>
    //             <div className="info-text">{item.title}</div>
    //             <div className="li-text">{item.info}</div>
    //             <div className="li__mask"></div>
    //         </li>
    //     );
    // });
    let liContent = TE_ARR.map((item, index) => {
        return <li key={index}>敬请期待</li>;
    });

    if (!info) {
        mainContent = <PageLoading />;
    } else {
        let sWidth = (info.this_level_num / info.next_level_num) * 100 + '%';

        mainContent = (
            <div className="myLevel">
                <div className="myLevel-top">
                    <div className="level-info">
                        <div className="spic">
                            <img src={info.head_img} alt="" />
                        </div>
                        <div className="user-div">
                            <div className="level-num">
                                我的财富等级LV.{info.coinrank}
                            </div>
                            <div className="level-process">
                                <div className="bar">
                                    <div className="level-bar">
                                        <div
                                            className="active"
                                            style={{
                                                width: sWidth,
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                            <div className="bar-text">
                                还需{info.next_level_num}经验值至LV.
                                {Number(info.coinrank) + 1}
                            </div>
                        </div>
                        <div className="user__icon"></div>
                    </div>

                    <div className="myLevel-content">
                        <div className="title">财富特权</div>
                        <div className="level-ul">
                            <ul>{liContent}</ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return <Fragment>{mainContent}</Fragment>;
};

export default MyLevel;
