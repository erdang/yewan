import './index.scss';

import { connect } from 'react-redux';
import React, {
    memo,
    useCallback,
    useEffect,
    useState,
    Fragment,
    useRef,
} from 'react';
import { Tabs, SearchBar, Button, InfiniteScroll, Dialog } from 'antd-mobile';
import { PageLoading } from '@/component/PageLoading';

import instance from '@/request';
import { appGate } from '@/utility/appGate';
import urlTool from 'ox-util/src/url';

const searchParam = urlTool.param(window.location.search);

const ListMain = memo(
    ({ info, data, pageCount, loadMore, hasMore, addFn, tabKey }) => {
        let liContent = null;

        const toAppIm = useCallback((event) => {
            let uid = event.currentTarget.dataset.uid;
            appGate.openIm(uid, '');
        }, []);

        if (info && info.list.length === 0) {
            liContent = <div className="no__data"> 暂无数据</div>;
        } else if (data && data.length > 0) {
            liContent = data.map((item, index) => {
                let btnContent = {
                    0: (
                        <div
                            className="li__right-add"
                            data-grid={item.id}
                            onClick={addFn}
                        >
                            申请加入
                        </div>
                    ),
                    1: <div className="li__right-adding">申请中</div>,
                    5: <div className="li__right-added">已加入</div>,
                };
                return (
                    <li key={index}>
                        <div className="li__left">
                            <div className="li__left-pic">
                                <img src={item.cover} alt="" />
                            </div>
                            <div className="li__left-info">
                                <div className="li__left-name">
                                    {item.name}{' '}
                                </div>
                                <div className="li__left-alias">
                                    <div className="alias__pic">
                                        <img src={item.avatar} alt="" />
                                    </div>
                                    <div className="alias__name">
                                        {item.nickname}
                                    </div>
                                </div>
                                <div className="li__left-id">
                                    会长ID：{item.id}
                                </div>
                            </div>
                        </div>
                        <div className="li__right">
                            {tabKey === '0' && btnContent[item.state]}
                            {item.isGuild !== '1' && (
                                <div
                                    className="li__right-concat"
                                    onClick={toAppIm}
                                    data-uid={item.uid}
                                >
                                    联系会长
                                </div>
                            )}
                        </div>
                    </li>
                );
            });
        }
        return (
            <div className="grade__list">
                <ul>
                    <ul>{liContent}</ul>
                    {pageCount > 1 && (
                        <InfiniteScroll
                            loadMore={loadMore}
                            hasMore={hasMore}
                            threshold={0}
                        />
                    )}
                </ul>
            </div>
        );
    },
);
const GradeMain = memo(
    ({
        info,
        data,
        pageCount,
        loadMore,
        hasMore,
        searchFn,
        clearFn,
        searchRef,
        valueSearch,
        setValueSearch,
        addFn,
        tabKey,
    }) => {
        return (
            <div className="grade__tab1">
                <div className="g__header">
                    <SearchBar
                        className="s__bar"
                        placeholder="可搜索公会名称、会长ID、公会ID"
                        onClear={() => {
                            clearFn();
                        }}
                        ref={searchRef}
                        value={valueSearch}
                        onChange={setValueSearch}
                    />
                    <Button className="search__btn" onClick={searchFn}>
                        搜索
                    </Button>
                </div>
                <ListMain
                    data={data}
                    loadMore={loadMore}
                    pageCount={pageCount}
                    hasMore={hasMore}
                    info={info}
                    addFn={addFn}
                    tabKey={tabKey}
                ></ListMain>
            </div>
        );
    },
);

const ApplyNew = ({ ticket }) => {
    const [tabKey, setTabKey] = useState('0');
    const [valueSearch, setValueSearch] = useState('');
    const [info, setInfo] = useState('');
    const [data, setData] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const todayPage = useRef(1);

    const [infoAdd, setInfoAdd] = useState('');
    const [dataAdd, setDataAdd] = useState([]);
    const [pageCountAdd, setPageCountAdd] = useState(0);
    const [hasMoreAdd, setHasMoreAdd] = useState(true);
    const todayPageAdd = useRef(1);
    const searchRef = useRef(null);

    const getInfo = useCallback(
        async (val) => {
            const respone = await instance.post('/api/v1/guild/getGuildList', {
                token: ticket,
                current: 0,
                page: todayPage.current,
                size: 10,
                keyword: val,
            });

            if (
                Number(respone.content.totalPage) > 0 &&
                todayPage.current > Number(respone.content.totalPage)
            ) {
                return {
                    list: [],
                };
            }
            if (todayPage.current === 1) {
                setData(respone.content.list);
            }
            setInfo(respone.content);
            setPageCount(Number(respone.content.totalPage));
            todayPage.current++;

            return respone.content;
        },
        [ticket],
    );

    const getInfoAdd = useCallback(async () => {
        const respone = await instance.post('/api/v1/guild/getGuildList', {
            token: ticket,
            current: 1,
            page: todayPageAdd.current,
        });

        if (
            Number(respone.content.totalPage) > 0 &&
            todayPageAdd.current > Number(respone.content.totalPage)
        ) {
            return {
                list: [],
            };
        }
        if (todayPageAdd.current === 1) {
            setDataAdd(respone.content.list);
        }
        setInfoAdd(respone.content);
        setPageCountAdd(Number(respone.content.totalPage));
        todayPageAdd.current++;

        return respone.content;
    }, [ticket]);

    const loadMore = useCallback(async () => {
        const append = await getInfo();
        setData((val) => {
            return [...val, ...append.list];
        });

        setHasMore(append.list.length > 0);
        setPageCount(append.totalPage);
    }, [getInfo]);

    const loadMoreAdd = useCallback(async () => {
        const append = await getInfoAdd();
        setDataAdd((val) => {
            return [...val, ...append.list];
        });

        setHasMoreAdd(append.list.length > 0);
        setPageCountAdd(append.totalPage);
    }, [getInfoAdd]);

    const searchFn = useCallback(() => {
        if (!valueSearch) return;
        todayPage.current = 1;
        setData([]);
        setHasMore(true);
        setPageCount(0);
        getInfo(valueSearch);
    }, [getInfo, valueSearch]);
    const clearFn = useCallback(() => {
        todayPage.current = 1;
        searchRef.current?.clear();
        setData([]);
        setHasMore(true);
        setPageCount(0);
        getInfo();
    }, [getInfo]);

    const setTabFn = useCallback(
        (key) => {
            setTabKey(key);

            if (key === '1') {
                getInfoAdd();
                todayPageAdd.current = 1;
                setPageCountAdd(0);
                setHasMoreAdd(true);
                setDataAdd([]);
            }
        },
        [getInfoAdd],
    );

    const addFn = useCallback(
        (event) => {
            let guildId = event.currentTarget.dataset.grid;
            instance
                .post('/api/v1/guild/apply', {
                    token: ticket,
                    guildId: guildId,
                })
                .then((d) => {
                    if (d.code === '200') {
                        Dialog.alert({
                            content: d.content,
                            confirmText: '确定',
                            onConfirm: () => {},
                        });
                    } else if (d.code === '406') {
                        Dialog.confirm({
                            content: d.message,
                            confirmText: '去认证',
                            onConfirm: () => {
                                appGate.openWebview();
                            },
                            cancelText: '取消',
                            onCancel: () => {},
                        });
                    } else {
                        Dialog.alert({
                            content: d.message,
                            confirmText: '确定',
                            onConfirm: () => {},
                        });
                    }
                });
        },
        [ticket],
    );

    let mainContent = null;

    useEffect(() => {
        getInfo();
    }, [getInfo]);
    if (!info) {
        mainContent = <PageLoading></PageLoading>;
    } else if (info) {
        mainContent = (
            <div className="grade">
                <div className="tem-tab">
                    <Tabs
                        activeLineMode="fixed"
                        onChange={setTabFn}
                        style={{
                            '--active-line-height': '4px',
                        }}
                    >
                        <Tabs.Tab title="公会列表" key="0">
                            <GradeMain
                                data={data}
                                loadMore={loadMore}
                                pageCount={pageCount}
                                hasMore={hasMore}
                                tabKey={tabKey}
                                searchFn={searchFn}
                                clearFn={clearFn}
                                info={info}
                                searchRef={searchRef}
                                valueSearch={valueSearch}
                                setValueSearch={setValueSearch}
                                addFn={addFn}
                            ></GradeMain>
                        </Tabs.Tab>
                        <Tabs.Tab title="当前加入" key="1">
                            <ListMain
                                data={dataAdd}
                                loadMore={loadMoreAdd}
                                pageCount={pageCountAdd}
                                hasMore={hasMoreAdd}
                                info={infoAdd}
                                tabKey={tabKey}
                            ></ListMain>
                        </Tabs.Tab>
                    </Tabs>
                </div>
            </div>
        );
    }
    return <Fragment>{mainContent}</Fragment>;
};

const GradeIm = ({ ticket }) => {
    const [info, setInfo] = useState('');

    const getInfo = useCallback(
        (val) => {
            instance
                .post('/api/v1/guild/getInviteInfo', {
                    token: ticket,
                    guildId: searchParam.guildId,
                })
                .then((d) => {
                    if (d.code === '200') {
                        setInfo(d.content);
                    }
                });
        },
        [ticket],
    );

    const joinHander = useCallback(
        (event) => {
            let tId = event.currentTarget.dataset.hander;
            instance
                .post('/api/v1/guild/memberJoin', {
                    token: ticket,
                    guildId: searchParam.guildId,
                    status: tId,
                })
                .then((d) => {
                    if (d.code === '200') {
                        Dialog.alert({
                            content: d.content,
                            confirmText: '确定',
                            onConfirm: () => {},
                        });
                    } else if (d.code === '402') {
                        Dialog.confirm({
                            content: d.message,
                            confirmText: '去认证',
                            onConfirm: () => {
                                appGate.openWebview();
                            },
                            cancelText: '取消',
                            onCancel: () => {},
                        });
                    } else {
                        Dialog.alert({
                            content: d.message,
                            confirmText: '确定',
                            onConfirm: () => {},
                        });
                    }
                });
        },
        [ticket],
    );
    useEffect(() => {
        getInfo();
    }, [getInfo]);

    let mainContent = null;

    if (!info) {
        mainContent = <PageLoading></PageLoading>;
    } else if (info) {
        mainContent = (
            <div className="g__im">
                <div className="g__im-title">{info.guildName}邀请您的加入</div>
                <div className="g__im-num">ID：{info.guildId}</div>
                <div className="a-button">
                    <Button
                        type="button"
                        color="primary"
                        onClick={joinHander}
                        data-hander={'1'}
                    >
                        加入
                    </Button>
                </div>
                <div className="a-button">
                    <Button
                        type="button"
                        color="default"
                        onClick={joinHander}
                        data-hander={'2'}
                    >
                        拒绝
                    </Button>
                </div>
            </div>
        );
    }
    return <div className="grade__im">{mainContent}</div>;
};

var ApplyNewPage = function ({ ticket }) {
    if (searchParam.rule === 'ruleText') {
        return <div className="applyNew__rule"></div>;
    }
    if (searchParam.rule === 'im') {
        return <GradeIm ticket={ticket}> </GradeIm>;
    }
    return <ApplyNew ticket={ticket}></ApplyNew>;
};

const mapStateTpProps = (state) => {
    return { ...state.apply, ...state.user };
};

const mapDispatchToProps = {};

export default connect(mapStateTpProps, mapDispatchToProps)(ApplyNewPage);
