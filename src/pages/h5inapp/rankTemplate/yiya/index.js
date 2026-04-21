import './index.scss';

import React, { Fragment, useState, useCallback, useEffect } from 'react';
import DawerOverlay from '@/component/DawerOverlay';
import { PageLoading } from '@/component/PageLoading';
import { BadgeIcon } from '@/component/BadgeIcon';
import { Tabs } from 'antd-mobile';

import instance from '@/request/index';
import urlTool from 'ox-util/src/url';
import setTitle from '@/utility/settitle.js';
import { appGate } from '@/utility/appGate.js';
import { APPNAME } from '@/utility/appName';

const hostname = window.location.hostname;
const money = APPNAME[hostname].money;
// import VConsole from 'vconsole';

// // eslint-disable-next-line no-unused-vars
// const vConsole = new VConsole();

const searchParam = urlTool.param(window.location.search);

const RankTemplate = () => {
    let [data, setData] = useState('');
    let [tabKey, setTabKey] = useState('1');

    let getInfo = useCallback(() => {
        instance
            .post('/api/eventCenter/getEventInfo', {
                eid: 2,
            })
            .then((data) => {
                //data.content.showRankType = '0';

                setTitle(data.content.title);
                setData(data.content);
            });
    }, []);

    const setTabFn = useCallback((key) => {
        setTabKey(key);
    }, []);

    useEffect(() => {
        getInfo();
    }, [getInfo]);

    let maincontent = null;

    if (!data) {
        maincontent = <PageLoading />;
    } else {
        let bgStyle = {
            background: data.backgroundColor,
            width: '100%',
            height: '100%',
            overflowY: 'auto',
        };

        let bgTab = {
            background:
                'linear-gradient(to bottom,' +
                data.tab.gradient1 +
                ',' +
                data.tab.gradient2 +
                ')',
            color: data.rankHeadBackgroundColor,
        };

        let tabStyle = {
            background: data.contentBoxBackgroundColor,
            width: '90%',
            margin: 'auto',
            color: data.contentBoxFontColor,
            border: `1px solid ${data.contentBoxFontColor}`,
        };

        let tabColor = {
            color: data.fontColor,
        };
        let headBg = {
            background: data.rankHeadBackgroundColor,
            color: data.fontColor,
        };
        let headBgBorderTop = {
            borderTop: `10px solid ${data.rankHeadBackgroundColor}`,
        };

        let giftContent = null;
        let liStlye = {
            border: '1px solid ' + data.backgroundColor,
        };
        let pStlye = {
            backgroundColor: data.backgroundColor,
        };
        let idColor = {
            color: '',
        };

        let eventGiftStyle = {
            backgroundColor: data.contentBoxBackgroundColor,
        };

        giftContent =
            data &&
            data.eventGiftList.map((item, index) => {
                return (
                    <li key={index} style={liStlye}>
                        <div className="g-div">
                            <img src={item.icon} alt="" />
                        </div>
                        <p style={pStlye}>{item.title}</p>
                    </li>
                );
            });
        let showInfo = null;
        let fClass = '';
        let bgTitleGift = data &&
            data.headImage.giftUrlH5 && {
                backgroundImage: 'url(' + data.headImage.giftUrlH5 + ')',
                backgroundSize: '100% 100%',
            };
        if (data && data.eventGiftList.length > 0) {
            showInfo = (
                <div
                    className={
                        'event-icon' +
                        (data.eventGiftList.length > 6
                            ? ' lang-gift'
                            : ' no-lang')
                    }
                    style={eventGiftStyle}
                >
                    <div
                        className="title"
                        style={bgTitleGift ? bgTitleGift : null}
                    ></div>
                    <div className="event-gift-list">
                        <ul>{giftContent}</ul>
                    </div>
                    <div className="event-tips">1{money}=1积分</div>
                </div>
            );
        } else if (data && data.eventGiftList.length === 0) {
            fClass = ' no-f-content';
        }

        let pkBg = '';
        if (data.themeStyle === 2) {
            pkBg = 'pk-bg' + fClass;
        } else if (data.themeStyle === 3) {
            pkBg = 'hat-bg' + fClass;
        } else {
            pkBg = 'f-content' + fClass;
        }

        if (data.showRankType === '0') {
            maincontent = (
                <div className="rank-template" style={bgStyle}>
                    <div className="tem-warp">
                        <div className="nav-bg-1">
                            <img src={data.background} alt="" />
                        </div>
                        {showInfo}
                        <div className={pkBg} style={eventGiftStyle}>
                            <div className="tem-tab">
                                <Tabs
                                    activeLineMode="fixed"
                                    onChange={setTabFn}
                                    active={bgTab}
                                    styles={tabStyle}
                                    style={{
                                        '--fixed-active-line-width': '0px',
                                        '--content-padding': '0px',
                                    }}
                                >
                                    <Tabs.Tab title="主播榜" key="1">
                                        <MoneyRank
                                            contribute={data.receive}
                                            fontColor={tabColor}
                                            headBg={headBg}
                                            themeStyle={data.themeStyle}
                                            headImage={data.headImage}
                                            headBgBorderTop={headBgBorderTop}
                                            tabKey={tabKey}
                                            showRankType={data.showRankType}
                                            idColor={idColor}
                                        />
                                    </Tabs.Tab>

                                    <Tabs.Tab
                                        title={data.room.tab_title}
                                        key="2"
                                    >
                                        <MoneyRank
                                            contribute={data.room}
                                            fontColor={tabColor}
                                            headBg={headBg}
                                            themeStyle={data.themeStyle}
                                            headImage={data.headImage}
                                            headBgBorderTop={headBgBorderTop}
                                            tabKey={tabKey}
                                            showRankType={data.showRankType}
                                            idColor={idColor}
                                        />
                                    </Tabs.Tab>
                                    <Tabs.Tab title="富豪榜" key="3">
                                        <MoneyRank
                                            contribute={data.contribute}
                                            fontColor={tabColor}
                                            headBg={headBg}
                                            themeStyle={data.themeStyle}
                                            headImage={data.headImage}
                                            headBgBorderTop={headBgBorderTop}
                                            tabKey={tabKey}
                                            showRankType={data.showRankType}
                                            idColor={idColor}
                                        />
                                    </Tabs.Tab>
                                </Tabs>
                            </div>
                        </div>
                        <div className="kong-div"></div>
                    </div>
                </div>
            );
        } else if (data.showRankType === '1') {
            maincontent = (
                <div className="rank-template" style={bgStyle}>
                    <div className="tem-warp">
                        <div className="nav-bg-1">
                            <img src={data.background} alt="" />
                        </div>
                        {showInfo}
                        <div className={pkBg} style={eventGiftStyle}>
                            <div className="tem-tab">
                                <MoneyRank
                                    contribute={data.room}
                                    fontColor={tabColor}
                                    headBg={headBg}
                                    themeStyle={data.themeStyle}
                                    headImage={data.headImage}
                                    headBgBorderTop={headBgBorderTop}
                                    tabKey={'2'}
                                    showRankType={data.showRankType}
                                    idColor={idColor}
                                />
                            </div>
                        </div>
                        <div className="kong-div"></div>
                    </div>
                </div>
            );
        } else if (data.showRankType === '2') {
            maincontent = (
                <div className="rank-template" style={bgStyle}>
                    <div className="tem-warp">
                        <div className="nav-bg-1">
                            <img src={data.background} alt="" />
                        </div>
                        {showInfo}
                        <div className={pkBg} style={eventGiftStyle}>
                            <div className="tem-tab">
                                <MoneyRank
                                    contribute={data.receive}
                                    fontColor={tabColor}
                                    headBg={headBg}
                                    themeStyle={data.themeStyle}
                                    headImage={data.headImage}
                                    headBgBorderTop={headBgBorderTop}
                                    tabKey={'1'}
                                    showRankType={data.showRankType}
                                    idColor={idColor}
                                />
                            </div>
                        </div>
                        <div className="kong-div"></div>
                    </div>
                </div>
            );
        } else if (data.showRankType === '3') {
            maincontent = (
                <div className="rank-template" style={bgStyle}>
                    <div className="tem-warp">
                        <div className="nav-bg-1">
                            <img src={data.background} alt="" />
                        </div>
                        {showInfo}
                        <div className={pkBg} style={eventGiftStyle}>
                            <div className="tem-tab">
                                <MoneyRank
                                    contribute={data.contribute}
                                    fontColor={tabColor}
                                    headBg={headBg}
                                    themeStyle={data.themeStyle}
                                    headImage={data.headImage}
                                    headBgBorderTop={headBgBorderTop}
                                    tabKey={'3'}
                                    showRankType={data.showRankType}
                                    idColor={idColor}
                                />
                            </div>
                        </div>
                        <div className="kong-div"></div>
                    </div>
                </div>
            );
        } else if (data.showRankType === '4') {
            maincontent = (
                <div className="rank-template" style={bgStyle}>
                    <div className="tem-warp">
                        <div className="nav-bg-1">
                            <img src={data.background} alt="" />
                        </div>
                        {showInfo}
                        <div className={pkBg} style={eventGiftStyle}>
                            <div className="tem-tab">
                                <Tabs
                                    activeLineMode="fixed"
                                    onChange={setTabFn}
                                    active={bgTab}
                                    styles={tabStyle}
                                    style={{
                                        '--fixed-active-line-width': '0px',
                                        '--content-padding': '0px',
                                    }}
                                >
                                    <Tabs.Tab
                                        title={data.room.tab_title}
                                        key="2"
                                    >
                                        <MoneyRank
                                            contribute={data.room}
                                            fontColor={tabColor}
                                            headBg={headBg}
                                            themeStyle={data.themeStyle}
                                            headImage={data.headImage}
                                            headBgBorderTop={headBgBorderTop}
                                            tabKey={tabKey}
                                            showRankType={data.showRankType}
                                            idColor={idColor}
                                        />
                                    </Tabs.Tab>
                                    <Tabs.Tab title="富豪榜" key="3">
                                        <MoneyRank
                                            contribute={data.contribute}
                                            fontColor={tabColor}
                                            headBg={headBg}
                                            themeStyle={data.themeStyle}
                                            headImage={data.headImage}
                                            headBgBorderTop={headBgBorderTop}
                                            tabKey={tabKey}
                                            showRankType={data.showRankType}
                                            idColor={idColor}
                                        />
                                    </Tabs.Tab>
                                </Tabs>
                            </div>
                        </div>
                        <div className="kong-div"></div>
                    </div>
                </div>
            );
        } else if (data.showRankType === '5') {
            maincontent = (
                <div className="rank-template" style={bgStyle}>
                    <div className="tem-warp">
                        <div className="nav-bg-1">
                            <img src={data.background} alt="" />
                        </div>
                        {showInfo}
                        <div className={pkBg} style={eventGiftStyle}>
                            <div className="tem-tab">
                                <Tabs
                                    activeLineMode="fixed"
                                    onChange={setTabFn}
                                    active={bgTab}
                                    styles={tabStyle}
                                    style={{
                                        '--fixed-active-line-width': '0px',
                                        '--content-padding': '0px',
                                    }}
                                >
                                    <Tabs.Tab title="主播榜" key="1">
                                        <MoneyRank
                                            contribute={data.receive}
                                            fontColor={tabColor}
                                            headBg={headBg}
                                            themeStyle={data.themeStyle}
                                            headImage={data.headImage}
                                            headBgBorderTop={headBgBorderTop}
                                            tabKey={tabKey}
                                            showRankType={data.showRankType}
                                            idColor={idColor}
                                        />
                                    </Tabs.Tab>
                                    <Tabs.Tab title="富豪榜" key="3">
                                        <MoneyRank
                                            contribute={data.contribute}
                                            fontColor={tabColor}
                                            headBg={headBg}
                                            themeStyle={data.themeStyle}
                                            headImage={data.headImage}
                                            headBgBorderTop={headBgBorderTop}
                                            tabKey={tabKey}
                                            showRankType={data.showRankType}
                                            idColor={idColor}
                                        />
                                    </Tabs.Tab>
                                </Tabs>
                            </div>
                        </div>
                        <div className="kong-div"></div>
                    </div>
                </div>
            );
        } else if (data.showRankType === '6') {
            maincontent = (
                <div className="rank-template" style={bgStyle}>
                    <div className="tem-warp">
                        <div className="nav-bg-1">
                            <img src={data.background} alt="" />
                        </div>
                        {showInfo}
                        <div className={pkBg} style={eventGiftStyle}>
                            <div className="tem-tab">
                                <Tabs
                                    activeLineMode="fixed"
                                    onChange={setTabFn}
                                    active={bgTab}
                                    styles={tabStyle}
                                    style={{
                                        '--fixed-active-line-width': '0px',
                                        '--content-padding': '0px',
                                    }}
                                >
                                    <Tabs.Tab title="主播榜" key="1">
                                        <MoneyRank
                                            contribute={data.receive}
                                            fontColor={tabColor}
                                            headBg={headBg}
                                            themeStyle={data.themeStyle}
                                            headImage={data.headImage}
                                            headBgBorderTop={headBgBorderTop}
                                            tabKey={tabKey}
                                            showRankType={data.showRankType}
                                            idColor={idColor}
                                        />
                                    </Tabs.Tab>
                                    <Tabs.Tab
                                        title={data.room.tab_title}
                                        key="2"
                                    >
                                        <MoneyRank
                                            contribute={data.room}
                                            fontColor={tabColor}
                                            headBg={headBg}
                                            themeStyle={data.themeStyle}
                                            headImage={data.headImage}
                                            headBgBorderTop={headBgBorderTop}
                                            tabKey={tabKey}
                                            showRankType={data.showRankType}
                                            idColor={idColor}
                                        />
                                    </Tabs.Tab>
                                </Tabs>
                            </div>
                        </div>
                        <div className="kong-div"></div>
                    </div>
                </div>
            );
        }
    }

    return <Fragment>{maincontent}</Fragment>;
};

const RankAward = ({ receive, headImage, borderBg, fontColor }) => {
    let { awardImageList, awardInfo, rules } = receive;
    let bgTitle = {
        backgroundImage: 'url(' + headImage.ruleUrlH5 + ')',
        backgroundSize: '100% 100%',
    };

    let bgTitleAward = {
        backgroundImage: 'url(' + headImage.awardUrlH5 + ')',
        backgroundSize: '100% 100%',
    };

    return (
        <div className="rule-warp">
            <div className="rules-warp" style={borderBg}>
                <div
                    className="title-icon1"
                    style={headImage.awardUrlH5 ? bgTitleAward : null}
                ></div>
                <pre
                    className="text-p"
                    dangerouslySetInnerHTML={{ __html: awardInfo }}
                    style={fontColor}
                ></pre>

                <div className="gif-list">
                    {awardImageList.map((item, index) => {
                        return (
                            <div className="gift-icon1" key={index}>
                                <img src={item} alt="" />
                            </div>
                        );
                    })}
                </div>
            </div>
            {headImage.ruleUrlH5 ? (
                <div className="rules-warp" style={borderBg}>
                    <div
                        className="title-icon2"
                        style={headImage.ruleUrlH5 ? bgTitle : null}
                    ></div>
                    <div
                        className="text"
                        dangerouslySetInnerHTML={{ __html: rules }}
                        style={fontColor}
                    ></div>
                </div>
            ) : null}
        </div>
    );
};

const MoneyRank = ({
    contribute,
    fontColor,
    themeStyle,
    headImage,
    headBg,
    headBgBorderTop,
    tabKey,
    showRankType,
    idColor,
}) => {
    let content = null;
    let { rankArr, rules } = contribute;
    let detailContent = '';
    // let roomstatus = {
    //     0: null,
    //     1: <div className="mvp-room-status"></div>,
    //     2: <div className="mvp-room-status">娱乐中</div>,
    //     3: <div className="mvp-room-status">交友中</div>,
    // };

    let toFunction = useCallback((event) => {
        let uid = event.currentTarget.dataset.uid;
        appGate.openProfileCard(uid, 'page');
    }, []);

    let rankTop = null;
    let rankTopStyle = null;
    let liBorder = null;
    let borderBg = null;
    // let ruleTextColor = null;
    if (themeStyle === 2) {
        rankTop = null;
        rankTopStyle = { color: '#fff' };
        liBorder = '';
    } else if (themeStyle === 3) {
        rankTop = null;
        rankTopStyle = { color: '#fff' };
        liBorder = '';
    } else {
        borderBg = headBgBorderTop;
        if (
            showRankType === '1' ||
            showRankType === '2' ||
            showRankType === '3'
        ) {
            rankTop = null;
            rankTopStyle = { ...headBg, marginTop: 0 };
        } else {
            rankTop = (
                <pre
                    className="text-rule"
                    dangerouslySetInnerHTML={{ __html: rules }}
                    style={fontColor}
                ></pre>
            );
            rankTopStyle = headBg;
        }

        liBorder = 'border-bottom';
    }

    if (rankArr && rankArr.length > 0) {
        detailContent = (
            <div className="master">
                <div className="user mvpuser">
                    <ul>
                        {rankArr.map((item, index) => {
                            content = (
                                <BadgeIcon level={Number(item.coinrank)} />
                            );

                            return (
                                <li key={index}>
                                    <div
                                        className={
                                            'li-b ' +
                                            (index === rankArr.length - 1
                                                ? ''
                                                : liBorder)
                                        }
                                    >
                                        <div className="warp-pic">
                                            {index < 3 ? (
                                                <div
                                                    className={
                                                        'li-num-' + index
                                                    }
                                                ></div>
                                            ) : (
                                                <div className="li-num">
                                                    {index + 1}
                                                </div>
                                            )}
                                        </div>

                                        <div
                                            className="info"
                                            data-uid={item.uid}
                                            onClick={toFunction}
                                        >
                                            <div className="pic">
                                                <img
                                                    src={item.picuser}
                                                    alt=""
                                                />
                                            </div>
                                            <div className="user-info">
                                                <div
                                                    className={'user-alias-mvp'}
                                                >
                                                    <span style={fontColor}>
                                                        {item.alias}
                                                    </span>

                                                    {content}
                                                </div>

                                                <div className="user-text">
                                                    <div
                                                        className="uid-text"
                                                        style={idColor}
                                                    >
                                                        ID:{item.rid}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className="score-num-div"
                                            style={fontColor}
                                        >
                                            {item.num}
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        );
    } else if (rankArr && rankArr.length === 0) {
        detailContent = (
            <div className="master">
                <div className="nodata" style={fontColor}>
                    暂无数据
                </div>
            </div>
        );
    } else {
        detailContent = null;
    }

    let titleMvp =
        showRankType === '4'
            ? { 1: '厅主', 2: '厅主', 3: '富豪' }
            : {
                  1: '主播',
                  2: '厅主',
                  3: '富豪',
              };

    return (
        <div className="star-rank">
            {rankTop}
            <div className="warp-title-mvp" style={rankTopStyle}>
                <span>排名</span>
                <span>{titleMvp[tabKey]}</span>
                <span>{tabKey !== '3' ? '获得积分' : '贡献积分'}</span>
            </div>
            {detailContent}
            <RankAward
                receive={contribute}
                headImage={headImage}
                borderBg={borderBg}
                fontColor={fontColor}
            />
        </div>
    );
};

const KingBuddingPaste = ({ page, pageID }) => {
    let clickFn = useCallback(() => {
        if (appGate.inApp()) {
            appGate.openDrawer(
                window.location.protocol +
                    '//' +
                    window.location.hostname +
                    '/appmate/friend-rank-template?eid=4&type=room',
            );
        }
    }, []);

    return (
        <div className="room-national">
            <div className="warp" onClick={clickFn}></div>
        </div>
    );
};

const CommonPaste = ({ page, pageID }) => {
    // if (!searchParam.event_data) {
    //     alert('event_data,不存在');
    // }
    // searchParam.event_data =
    //     '{"icon":"http://suerdev-img.v.6.cn/2022/01/19/15/1014v1642579079646977222.png","eid":"1","url":"http://develop-suer-mobile.6.cn/h5inapp/rankTemplate?eid=1&type=commonpaste"}';
    const [info] = useState(() => {
        let result = '';
        try {
            result = JSON.parse(decodeURIComponent(searchParam.event_data));
        } catch (e) {
            if (process.env.NODE_ENV !== 'production') {
                result = JSON.parse(
                    decodeURIComponent(
                        '%7B%22content%22%3A%22%5Cu60a8%5Cu5f53%5Cu524d%5Cu5185%5Cu5bb9%5Cu8fdd%5Cu89c4%5Cuff0c%5Cu8bf7%5Cu53ca%5Cu65f6%5Cu8c03%5Cu6574%5Cu3002%22%7D',
                    ),
                );
            }
        }
        return result;
    });
    let clickFn = useCallback(() => {
        let url =
            window.location.origin +
            window.location.pathname +
            '?eid=' +
            info.eid +
            '&room=room';
        appGate.openUrl(encodeURI(url), 'headless');
    }, [info]);

    let bIcon = info.icon
        ? info.icon
        : '//vr0.6rooms.com/tao/i/r4/5cb73e5b297241369446afff8f27e4ec.png';

    return (
        <div className="room-national-com">
            <div
                className="warp"
                style={{
                    background: 'url(' + bIcon + ')',
                    backgroundSize: '100% 100%',
                }}
                onClick={clickFn}
            ></div>
        </div>
    );
};

var BlindRankTemplate = function () {
    if (searchParam.type === 'paste') {
        return <KingBuddingPaste />;
    }
    if (searchParam.type === 'commonpaste') {
        return <CommonPaste />;
    }
    if (searchParam.room === 'full') {
        return <RankTemplate />;
    }

    return (
        <DawerOverlay onClose={appGate.closeWeb}>
            <RankTemplate />
        </DawerOverlay>
    );
};
export default BlindRankTemplate;
