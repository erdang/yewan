import './index.scss';
import React, { useEffect } from 'react';

import MyLevel from './componet/Mylevel';
import { connect } from 'react-redux';

import urlTool from 'ox-util/src/url';
import setTitle from '@/utility/settitle';

const searchParam = urlTool.param(window.location.search);

const HelpRule = () => {
    return (
        <div className="help-rule">
            <div className="rule-content">
                <div className="r-title">一、了解贵族 </div>
                <p>
                    贵族是椰壳平台的特殊身份，共有五个等级，从高到低分别为骑士&lt;领主&lt;公爵&lt;君王&lt;国王，开通后可以享受专属特权。
                </p>
                <div className="r-title"> 二、开通贵族</div>
                <p>
                    1、进入贵族后，选择对应身份后即可直接开通，开通后即触发房间公屏通知、世界墙；高等级还会额外有全站广播的播报哦！
                </p>
                <p>2、 开通贵族身份后，可获得一定数量的金币返赠。</p>
                <div className="r-title"> 三、续费时间</div>
                <p>1、每次开通有效时间为30天。</p>
                <p>
                    2、在身份未过期前，随时可以对当前身份续费，且享受超值折扣，并获得金币返赠；当贵族身份过期后有30天的保护期，保护期内仍享受续费优惠价；保护期过后需以原价重新开通。
                </p>
                <div className="r-title"> 四、更换身份</div>
                <p>
                    1、当您已是贵族用户，您依然能够开通更高等级的贵族。例如:您已是[公爵]，您可继续开通[君王]，但不能开通[领主]。
                </p>
                <p>
                    2、同一账号拥有多个等级贵族时，优先展示和使用高级贵族的功能，如果高级贵族失效后，再展示尚未过期的低级贵族。同一账号拥有多个等级贵族时，优先扣除当前最高贵族的可用时间。
                </p>

                <div className="r-title"> 五、开通价格</div>
                <div className="table">
                    <table>
                        <thead>
                            <tr>
                                <th>身份</th>
                                <th>开通价格</th>
                                <th>返赠金币</th>
                                <th>续费价格</th>
                                <th>返赠金币</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>骑士</td>
                                <td>50元/30天</td>
                                <td>400金币</td>
                                <td>15元/30天</td>
                                <td>142金币</td>
                            </tr>
                            <tr>
                                <td>领主</td>
                                <td>500元/30天</td>
                                <td>4000金币</td>
                                <td>150元/30天</td>
                                <td>1425金币</td>
                            </tr>
                            <tr>
                                <td>公爵</td>
                                <td>3000元/30天</td>
                                <td>24000金币</td>
                                <td>900元/30天</td>
                                <td>8550金币</td>
                            </tr>
                            <tr>
                                <td>君王</td>
                                <td>10000元/30天</td>
                                <td>80000金币</td>
                                <td>3000元/30天</td>
                                <td>28500金币</td>
                            </tr>
                            <tr>
                                <td>国王</td>
                                <td>30000元/30天</td>
                                <td>240000金币</td>
                                <td>9000元/30天</td>
                                <td>85500金币</td>
                            </tr>
                            <tr>
                                <td>帝皇</td>
                                <td colSpan={4}>
                                    国王30天内充值100,000元立即自动生效
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="r-title">六、帝皇身份</div>
                <p>
                    1、帝皇不属于贵族体系，是凌驾于普通贵族之上的荣耀身份，不支持开通，无金币返还。
                </p>
                <p>
                    2、当拥有国王身份后，30天内充值达标即可自动升级为帝皇，并尊享帝皇专属特权。
                </p>
            </div>
        </div>
    );
};
const MoneyRule = () => {
    return (
        <div className="help-rule">
            <div className="rule-content">
                <div className="r-title">1. 如何增长财富等级？ </div>
                <p>
                    通过在平台内消耗金币可提升财富等级，通过财富值的累加即可解锁对应的等级权益。
                </p>
                <div className="r-title"> 2. 财富等级提升规则</div>
                <p>消耗1金币=1财富值</p>

                <div className="table">
                    <table>
                        <thead>
                            <tr>
                                <th>标识</th>
                                <th>等级</th>
                                <th>累计财富值</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div className="td_img">
                                        <img
                                            src={
                                                'https://s3.njxianyuwl.cn/static/h5_static/mylevel/10.png'
                                            }
                                            alt=""
                                        />
                                    </div>
                                </td>
                                <td>Lv.1-Lv.10</td>
                                <td>100-5500</td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="td_img">
                                        <img
                                            src={
                                                'https://s3.njxianyuwl.cn/static/h5_static/mylevel/11.png'
                                            }
                                            alt=""
                                        />
                                    </div>
                                </td>
                                <td>Lv.11-Lv.20</td>
                                <td>6700-26500</td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="td_img">
                                        <img
                                            src={
                                                'https://s3.njxianyuwl.cn/static/h5_static/mylevel/21.png'
                                            }
                                            alt=""
                                        />
                                    </div>
                                </td>
                                <td>Lv.21-Lv.30</td>
                                <td>30500-133000</td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="td_img">
                                        <img
                                            src={
                                                'https://s3.njxianyuwl.cn/static/h5_static/mylevel/31.png'
                                            }
                                            alt=""
                                        />
                                    </div>
                                </td>
                                <td>Lv.31-Lv.40</td>
                                <td>156000-656000</td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="td_img">
                                        <img
                                            src={
                                                'https://s3.njxianyuwl.cn/static/h5_static/mylevel/41.png'
                                            }
                                            alt=""
                                        />
                                    </div>
                                </td>
                                <td>Lv.41-Lv.50</td>
                                <td>776000-3206000</td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="td_img">
                                        <img
                                            src={
                                                'https://s3.njxianyuwl.cn/static/h5_static/mylevel/52.png'
                                            }
                                            alt=""
                                        />
                                    </div>
                                </td>
                                <td>Lv.51-Lv.60</td>
                                <td>3756000-14956000</td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="td_img">
                                        <img
                                            src={
                                                'https://s3.njxianyuwl.cn/static/h5_static/mylevel/61.png'
                                            }
                                            alt=""
                                        />
                                    </div>
                                </td>
                                <td>Lv.61-Lv.70</td>
                                <td>17256000-529560000</td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="td_img">
                                        <img
                                            src={
                                                'https://s3.njxianyuwl.cn/static/h5_static/mylevel/71.png'
                                            }
                                            alt=""
                                        />
                                    </div>
                                </td>
                                <td>Lv.71-Lv.74</td>
                                <td>58956000-80956000</td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="td_img">
                                        <img
                                            src={
                                                'https://s3.njxianyuwl.cn/static/h5_static/mylevel/75.png'
                                            }
                                            alt=""
                                        />
                                    </div>
                                </td>
                                <td>Lv.75</td>
                                <td>100000000</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const R_TITLE = {
    help: {
        title: '贵族等级',
    },
    money: {
        title: '财富等级',
    },
};
var Level = function ({ ticket }) {
    useEffect(() => {
        setTitle(
            searchParam.rule ? R_TITLE[searchParam.rule].title : '我的等级',
        );
    }, []);

    if (searchParam.rule === 'help') {
        return <HelpRule></HelpRule>;
    }
    if (searchParam.rule === 'money') {
        return <MoneyRule></MoneyRule>;
    }
    return <MyLevel ticket={ticket}></MyLevel>;
};

const mapStateTpProps = (state) => {
    return { ...state.user };
};

const mapDispatchToProps = {};

export default connect(mapStateTpProps, mapDispatchToProps)(Level);
