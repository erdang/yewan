import './index.scss';
import React, {
    useEffect,
    useCallback,
    useState,
    Fragment,
    useRef,
} from 'react';
import { connect } from 'react-redux';
import {
    Stepper,
    InfiniteScroll,
    Dialog,
    Button,
    Checkbox,
    Input,
} from 'antd-mobile';

import urlTool from 'ox-util/src/url';
import setTitle from '@/utility/settitle';
import { format as formatTime } from 'ox-util/src/time';

import CenterOverlay from '@/component/CenterOverlay';
import { PageLoading } from '@/component/PageLoading';
import Portal from '@/component/Protal';
import ComTab from '@/component/comTab';
import instance from '@/request';
import { APPNAME } from '@/utility/appName';

let hosthome = window.location.hostname;
let imgUrl = APPNAME[hosthome].staticUrl;

const searchParam = urlTool.param(window.location.search);

const HelpRule = ({ setShowRule, ruledata }) => {
    const backFn = useCallback(() => {
        setShowRule(false);
    }, [setShowRule]);

    return (
        <Portal>
            <CenterOverlay className="help__warp" onClose={backFn}>
                <div className="help-rule">
                    <div className="nav-title">靓号规则</div>
                    <div className="rule-content">
                        <p>
                            1.您可以在靓号商城挑选对应的心仪靓号进行购买，靓号时长和价格以页面展示为准(靓号一个月为30天)；
                        </p>
                        <p>
                            2.靓号将在您的个人资料页、个人资料卡、语音房资料卡展示，购买靓号的同时将获赠相应等级的靓号勋章；
                        </p>
                        <p>
                            3.靓号到期前系统将提醒您续费购买，续费后可以保持对靓号的使用权，未续费的情况下该靓号在到期后重新开放购买，届时您将恢复使用原有账号；
                        </p>
                        <p>
                            4.靓号积分：用户在参加本平台组织的活动中产生靓号积分，积分可用于在积分页面进行靓号的购买或者赠送。靓号积分的具体使用规则请参照积分页面的说明。
                        </p>
                        <p> 5.最终解释权归属本平台</p>
                    </div>
                </div>
            </CenterOverlay>
        </Portal>
    );
};
const AlertRule = ({ setShowRule, ruledata }) => {
    const backFn = useCallback(() => {
        setShowRule(false);
    }, [setShowRule]);

    return (
        <Portal>
            <CenterOverlay className="help__user-warp" onClose={backFn}>
                <div className="help-rule">
                    <div className="nav-title">用户靓号规则</div>
                    <div className="rule-content">
                        <p>
                            欢迎您注册、使用本平台靓号服务！为有效利用靓号资源，维护用户合法权益，您应当阅读并遵守《本平台靓号规则》（以下简称“本规则”）。请您务必审慎阅读、充分理解各条款内容，特别是免除或者限制责任的条款，以及开通或使用某项服务的单独协议，并选择接受或不接受。限制、免责条款可能以加粗形式提示您注意。
                        </p>
                        <p>
                            除非您已阅读并接受本规则所有条款，否则您无权申请或使用本平台靓号。您申请或使用本平台靓号的行为即视为您已阅读并同意受本规则的约束。
                        </p>
                        <p>
                            如果您不具备完全民事行为能力，请在法定监护人的陪同下阅读本协议，并特别注意未成年人使用条款。
                        </p>
                        <div className="r-title"> 一、规则的范围</div>
                        <p>
                            1.1
                            本规则是本平台制定的关于获取和使用本平台靓号的相关规则。适用于需要注册或使用本平台靓号的全部软件和服务。
                        </p>
                        <p>
                            1.2
                            您通过靓号使用本平台的软件和服务时，须同时遵守各项服务的单独协议。
                        </p>
                        <p>
                            1.3
                            本规则内容包括本平台可能不断发布的关于本服务的相关协议、用户协议等内容。上述内容一经发布，即为本规则不可分割的组成部分。
                        </p>
                        <div className="r-title"> 二、靓号的性质</div>
                        <p>
                            2.1
                            靓号是本平台创设的用于识别用户身份的特殊数字组合标识。靓号的所有权属于本平台，仅授权用户使用。
                        </p>
                        <div className="r-title"> 三、靓号的获取</div>
                        <p>3.1 您可以通过支付相关费用后申请使用靓号。</p>
                        <p>3.2 靓号包括普通靓号、稀有靓号等类型。</p>
                        <p>3.3 您仅获得靓号的使用权，所有权仍属于本平台。</p>
                        <p>
                            3.4
                            靓号商城：用户可以在靓号商城进行靓号的自我购买以及赠送他人。赠送操作需遵循本平台的相关规定和流程，确保赠送行为的合法合规。
                        </p>
                        <p>
                            3.5
                            靓号积分：用户在参加本平台组织的活动中产生靓号积分，积分可用于在积分页面进行靓号的购买或者赠送。靓号积分的具体使用规则请参照积分页面的说明。
                        </p>
                        <div className="r-title"> 四、用户身份信息验证</div>
                        <p>
                            4.1
                            您需要填写一些必要的信息，请保持这些信息的及时更新。
                        </p>
                        <p>
                            4.2
                            本平台与用户致力于个人信息的保护，未经您的同意，本平台不会向第三方披露您的个人信息。
                        </p>
                        <div className="r-title"> 五、靓号的使用</div>
                        <p>
                            5.1 您可以用靓号登录和使用本平台的各种软件和服务。
                        </p>
                        <p>
                            5.2
                            您无权要求中止、终止相关服务，也无权要求退还任何已支付的费用。
                        </p>
                        <div className="r-title"> 六、靓号的安全</div>
                        <p>
                            6.1
                            您应妥善保管靓号与密码，并对以此靓号实施的所有活动及其后果承担责任。
                        </p>
                        <div className="r-title"> 七、用户行为规范</div>
                        <p>7.1 未经本平台许可，您不得转让靓号给第三人。</p>
                        <div className="r-title">八、责任承担</div>
                        <p> 8.1 您应承担靓号项下所有活动产生的全部责任。</p>
                        <p>8.2 本平台不承担因非本平台原因导致的任何责任。</p>
                        <div className="r-title">
                            九、靓号使用的限制、冻结或终止
                        </div>
                        <p>
                            9.1
                            如您违反规定，本平台有权限制、冻结或终止您对靓号的使用。
                        </p>
                        <div className="r-title"> 十、客户服务</div>
                        <p>
                            如您对本平台采取的措施有异议或在使用过程中有问题，可联系在在线客服。
                        </p>
                        <div className="r-title"> 十一、其他</div>
                        <p>
                            11.1
                            您申请或使用靓号即视为您已阅读并同意受本规则的约束。
                        </p>
                        <p>
                            11.2
                            本规则的成立、生效、履行、解释及纠纷解决，适用中华人民共和国大陆地区法律。
                        </p>
                    </div>
                </div>
            </CenterOverlay>
        </Portal>
    );
};

const MyNumList = ({ ticket }) => {
    const [info, setInfo] = useState('');
    let liContent = null;
    let numContent = null;
    const getMyNum = useCallback(() => {
        instance
            .get('/api/v1/myBeautyAccountLists', {
                params: {
                    token: ticket,
                },
            })
            .then((d) => {
                if (d.code === '200') {
                    setInfo(d.content);
                }
            });
    }, [ticket]);
    const addFn = useCallback(
        (event) => {
            let beautyUid = Number(event.currentTarget.dataset.beautyuid);
            console.log(beautyUid);
            instance
                .post('/api/v1/buyBeautyAccount', {
                    token: ticket,
                    beauty_uid: beautyUid,
                    num: 1,
                })
                .then((d) => {
                    if (d.code === '200') {
                        Dialog.alert({
                            content: '续费成功',
                            confirmText: '确定',
                            onConfirm: () => {
                                getMyNum();
                            },
                        });
                    }
                });
        },
        [getMyNum, ticket],
    );
    useEffect(() => {
        getMyNum();
    }, [getMyNum]);
    if (info && info.data.length > 0) {
        liContent = info.data.map((item, index) => {
            return (
                <li key={index}>
                    <div className="numlist__left">
                        <div className="numlist__num">{item.beauty_uid}</div>
                        <div className="numlist__time">
                            有效期至
                            {formatTime(
                                item.effective_time * 1000,
                                'y-m-d h:i:s',
                            )}
                        </div>
                    </div>
                    {item.status === '1' ? (
                        <Button
                            className="numlist__btn"
                            data-beautyuid={item.beauty_uid}
                            onClick={addFn}
                        >
                            续费
                        </Button>
                    ) : (
                        <Button className="numlist__btn" disabled>
                            续费
                        </Button>
                    )}
                </li>
            );
        });
        numContent = <ul>{liContent}</ul>;
    } else if (info && info.data.length === 0) {
        numContent = (
            <div className="nodata__div">
                <div className="nodata__div-icon"></div>
                <div className="nodata__div-text">暂无靓号</div>
            </div>
        );
    }
    return <div className="numlist__warp">{numContent}</div>;
};

const RusultAlert = ({
    beautyprice,
    beautyindex,
    setShow,
    ticket,
    timeCurrent,
    getScore,
}) => {
    let [numValue, setNumValue] = useState(1);
    let [sendId, setSendId] = useState('');
    let [showSule, setShowSule] = useState(false);
    let [showChecked, setShowChecked] = useState(false);

    const closeAlert = useCallback(() => {
        setShow(false);
    }, [setShow]);

    const buyFinalFn = useCallback(
        ({ ticket, beautyindex, numValue, to_uid }) => {
            return instance.post('/api/v1/buyBeautyAccount', {
                token: ticket,
                beauty_uid: beautyindex.current,
                num: numValue,
                to_uid: to_uid,
            });
        },
        [],
    );
    const buyFn = useCallback(
        (event) => {
            if (!showChecked) {
                Dialog.alert({
                    content: '请勾选靓号规则',
                    confirmText: '确定',
                    onConfirm: () => {},
                });
                return false;
            }
            if (sendId) {
                instance
                    .get('/api/v1/user/getUserSimpleInfo', {
                        params: {
                            room_id: sendId,
                        },
                    })
                    .then((d) => {
                        if (d.code === '200') {
                            Dialog.confirm({
                                content: `是否要赠送${d.content.nickname}(${sendId})靓号`,
                                confirmText: '确定',
                                onConfirm: () => {
                                    buyFinalFn({
                                        ticket,
                                        beautyindex,
                                        numValue,
                                        to_uid: sendId,
                                    }).then((d) => {
                                        if (d.code === '200') {
                                            Dialog.alert({
                                                content: '赠送成功',
                                                confirmText: '确定',
                                                onConfirm: () => {
                                                    setShow(false);
                                                },
                                            });
                                        }
                                    });
                                },
                                cancelText: '取消',
                                onCancel: () => {},
                            });
                        }
                    });
            } else {
                buyFinalFn({ ticket, beautyindex, numValue }).then((d) => {
                    if (d.code === '200') {
                        Dialog.alert({
                            content: '购买成功',
                            confirmText: '确定',
                            onConfirm: () => {
                                setShow(false);
                                getScore();
                            },
                        });
                    }
                });
            }
        },
        [
            ticket,
            beautyindex,
            setShow,
            numValue,
            showChecked,
            sendId,
            buyFinalFn,
            getScore,
        ],
    );

    const changeBox = useCallback((v) => {
        setShowChecked(v);
    }, []);
    const toRule = useCallback(() => {
        setShowSule(true);
    }, []);

    return (
        <Portal>
            <CenterOverlay className="btn__alert" onClose={closeAlert}>
                <div className="title">靓号支付</div>
                <div className="tips">请尽快支付以免被他人抢先一步</div>
                <div className="btn__alert-num">{beautyindex.current}</div>
                <div className="uids">
                    <div className="uids_tips">
                        如需赠送,请输入接收人ID,自己购买请忽略
                    </div>
                    <Input
                        placeholder="请输入接收人ID"
                        value={sendId}
                        onChange={setSendId}
                    />
                </div>
                <div className="tips2">购买时间/月</div>
                <div className="btn__alert-step">
                    <Stepper
                        style={{
                            '--border': '1px solid #f5f5f5',
                            '--border-inner': 'none',
                            '--height': '36px',
                            '--input-width': '70px',
                            '--input-background-color':
                                'var(--adm-color-background)',
                            '--active-border': '1px solid #1677ff',
                        }}
                        defaultValue={numValue}
                        step={1}
                        min={1}
                        onChange={(value) => {
                            setNumValue(value);
                        }}
                    />
                </div>

                <div className="btns">
                    <div className="btn__alert-btn2" onClick={buyFn}>
                        支付{beautyprice.current * numValue}
                        {timeCurrent === 4 ? '积分' : '金币'}
                    </div>
                </div>
                <div className="rule__btns">
                    <Checkbox
                        onChange={changeBox}
                        value={showChecked}
                        style={{
                            '--icon-size': '18px',
                            '--font-size': '14px',
                            '--gap': '6px',
                        }}
                        className="rule-text"
                    >
                        我已阅读并同意,
                        <span onClick={toRule}>{'《用户靓号规则》'}</span>
                    </Checkbox>
                </div>
                {showSule && <AlertRule setShowRule={setShowSule}></AlertRule>}
            </CenterOverlay>
        </Portal>
    );
};
const ShopList = ({
    ticket,
    level,
    subLevel,
    todayPage,
    hasMore,
    setHasMore,
    timeCurrent,
    getScore,
}) => {
    let [show, setShow] = useState(false);

    const [data, setData] = useState([]);
    const [info, setInfo] = useState('');

    const beautyIndex = useRef('');
    const beautyPrice = useRef('');

    const getShop = useCallback(() => {
        instance
            .get('/api/v1/getBeautyAccountLists', {
                params: {
                    token: ticket,
                    page: todayPage.current,
                    level: level,
                    sub_level: subLevel,
                },
            })
            .then((d) => {
                if (d.code === '200') {
                    setData(d.content.list.data);
                    setInfo(d.content);
                }
            });
        todayPage.current++;
    }, [ticket, level, subLevel, todayPage]);

    const loadMore = useCallback(() => {
        return instance
            .get('/api/v1/getBeautyAccountLists', {
                params: {
                    token: ticket,
                    page: todayPage.current,
                    level: level,
                    sub_level: subLevel,
                },
            })
            .then((d) => {
                if (d.code === '200') {
                    setData((val) => [...val, ...d.content.list.data]);
                    if (d.content.list.data.length > 0) {
                        setHasMore(true);
                    } else {
                        setHasMore(false);
                    }
                    todayPage.current++;
                }
            });
    }, [ticket, level, subLevel, todayPage, setHasMore]);

    const btnFn = useCallback((event) => {
        beautyIndex.current = Number(event.currentTarget.dataset.index);
        beautyPrice.current = Number(event.currentTarget.dataset.price);
        setShow(true);
    }, []);

    useEffect(() => {
        getShop();
    }, [getShop]);

    let liContent = null;
    let ulContent = null;
    if (data && data.length === 0) {
        ulContent = (
            <div className="nodata__li">
                <div className="nodata__div-icon"></div>
                <div className="nodata__div-text">暂无靓号</div>
            </div>
        );
    } else if (data && data.length > 0) {
        liContent = data.map((item, index) => {
            return (
                <li
                    key={index}
                    data-index={item.beauty_uid}
                    data-price={item.price}
                    onClick={btnFn}
                >
                    <div className="li__top-div">
                        <div className="li__top-num">{item.beauty_uid}</div>
                    </div>
                    <div className="li__bottom-div">
                        {timeCurrent === 4 ? (
                            <div className="li__bottom-score"></div>
                        ) : (
                            <div className="li__bottom-icon"></div>
                        )}

                        <div className="li__bottom-price">{item.price}</div>
                    </div>
                </li>
            );
        });
        ulContent = <ul>{liContent}</ul>;
    }

    let mainContent = null;

    if (!info) {
        mainContent = null;
    } else {
        mainContent = (
            <Fragment>
                {ulContent}
                {info.list.last_page > 1 && (
                    <InfiniteScroll
                        loadMore={loadMore}
                        hasMore={hasMore}
                        threshold={0}
                    />
                )}
            </Fragment>
        );
    }
    return (
        <div className="shop__warp-div">
            {mainContent}
            {show && (
                <RusultAlert
                    setShow={setShow}
                    beautyindex={beautyIndex}
                    beautyprice={beautyPrice}
                    ticket={ticket}
                    timeCurrent={timeCurrent}
                    getScore={getScore}
                ></RusultAlert>
            )}
        </div>
    );
};

const ListMain = ({
    ticket,
    userInfo,
    timeCurrent,
    tabNodeS,
    todayPage,
    numCurrent,
    setNumCurrent,
    getScore,
}) => {
    const [hasMore, setHasMore] = useState(true);

    const timeLineFn = useCallback(
        (event) => {
            let key = Number(event.currentTarget.dataset.key);
            setNumCurrent(key);
            todayPage.current = 1;
            setHasMore(true);
        },
        [setNumCurrent, todayPage],
    );

    return (
        <div className="numShop__content">
            {tabNodeS.length > 0 && (
                <div className="n_tab-wapr">
                    <div className="n_tab">
                        <ComTab
                            timeLineFn={timeLineFn}
                            tabNode={tabNodeS}
                            current={numCurrent}
                        />
                    </div>
                </div>
            )}

            <ShopList
                ticket={ticket}
                userInfo={userInfo}
                subLevel={numCurrent}
                todayPage={todayPage}
                level={timeCurrent}
                hasMore={hasMore}
                setHasMore={setHasMore}
                timeCurrent={timeCurrent}
                getScore={getScore}
            ></ShopList>
        </div>
    );
};

var Level = function ({ ticket, userInfo }) {
    let [showRule, setShowRule] = useState(false);
    let [timeCurrent, setTimeCurrent] = useState(1);
    let [numCurrent, setNumCurrent] = useState(1);
    const [info, setInfo] = useState('');
    const todayPage = useRef(1);
    const showRulFn = () => {
        setShowRule(true);
    };
    let tabNode = [
        {
            title: 'S级号',
            des: <img src={imgUrl + '/numShop/n1.png'} alt="" />,
            key: 1,
        },
        {
            title: 'A级号',
            des: <img src={imgUrl + '/numShop/n4.png'} alt="" />,
            key: 2,
        },
        {
            title: 'B级号',
            des: <img src={imgUrl + '/numShop/n2.png'} alt="" />,
            key: 3,
        },
        {
            title: '积分兑换',
            des: <img src={imgUrl + '/numShop/n3.png'} alt="" />,
            key: 4,
        },
    ];
    const timeLineFn = useCallback(
        (event) => {
            let key = Number(event.currentTarget.dataset.key);
            setTimeCurrent(key);
            setNumCurrent(1);
            todayPage.current = 1;
        },
        [setTimeCurrent],
    );

    let tabNodeS = [
        {
            title: '叠字号',
            des: '',
            key: 1,
        },
        {
            title: '顺子号',
            des: '',
            key: 2,
        },
        {
            title: '情侣号',
            des: '',
            key: 3,
        },
    ];
    let tabNodeA = [
        {
            title: '五位靓号',
            des: '',
            key: 1,
        },
        {
            title: '六位靓号',
            des: '',
            key: 2,
        },
        {
            title: '七位靓号',
            des: '',
            key: 3,
        },
    ];
    let tabNodeB = [];
    let tabNodeC = [
        {
            title: '五位靓号',
            des: '',
            key: 1,
        },
        {
            title: '六位靓号',
            des: '',
            key: 2,
        },
        {
            title: '七位靓号',
            des: '',
            key: 3,
        },
    ];

    const getScore = useCallback(() => {
        instance
            .get('/api/v1/getBeautyAccountLists', {
                params: {
                    token: ticket,
                },
            })
            .then((d) => {
                if (d.code === '200') {
                    setInfo(d.content);
                }
            });
    }, [ticket]);

    let sContent = {
        1: (
            <ListMain
                ticket={ticket}
                userInfo={userInfo}
                timeCurrent={timeCurrent}
                tabNodeS={tabNodeS}
                todayPage={todayPage}
                numCurrent={numCurrent}
                setNumCurrent={setNumCurrent}
                getScore={getScore}
            ></ListMain>
        ),
        2: (
            <ListMain
                ticket={ticket}
                userInfo={userInfo}
                timeCurrent={timeCurrent}
                tabNodeS={tabNodeA}
                todayPage={todayPage}
                numCurrent={numCurrent}
                setNumCurrent={setNumCurrent}
                getScore={getScore}
            ></ListMain>
        ),
        3: (
            <ListMain
                ticket={ticket}
                userInfo={userInfo}
                timeCurrent={timeCurrent}
                tabNodeS={tabNodeB}
                todayPage={todayPage}
                numCurrent={numCurrent}
                setNumCurrent={setNumCurrent}
                getScore={getScore}
            ></ListMain>
        ),
        4: (
            <ListMain
                ticket={ticket}
                userInfo={userInfo}
                timeCurrent={timeCurrent}
                tabNodeS={tabNodeC}
                todayPage={todayPage}
                numCurrent={numCurrent}
                setNumCurrent={setNumCurrent}
                getScore={getScore}
            ></ListMain>
        ),
    };

    useEffect(() => {
        setTitle('靓号商城');
        getScore();
    }, [getScore]);

    if (searchParam.rule === 'my') {
        return <MyNumList ticket={ticket}></MyNumList>;
    }
    let mainContent = null;

    if (!info) {
        mainContent = <PageLoading></PageLoading>;
    } else {
        mainContent = (
            <Fragment>
                <div className="numShop__banner">
                    <div className="rule__btn" onClick={showRulFn}>
                        规则
                    </div>
                    <div className="rule__text">
                        <div className="s__icon"></div>
                        <div>{info.integral}</div>
                    </div>
                </div>
                <div className="num_tab">
                    <ComTab
                        timeLineFn={timeLineFn}
                        tabNode={tabNode}
                        current={timeCurrent}
                    />
                </div>
                {sContent[timeCurrent]}
            </Fragment>
        );
    }
    return (
        <div className="numShop__warp">
            {mainContent}
            {showRule && <HelpRule setShowRule={setShowRule}></HelpRule>}
        </div>
    );
};

const mapStateTpProps = (state) => {
    return { ...state.user };
};

const mapDispatchToProps = {};

export default connect(mapStateTpProps, mapDispatchToProps)(Level);
