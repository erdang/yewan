import React, { useEffect, useCallback, useState, useRef } from 'react';
import { InfiniteScroll } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';

import instance from '@/request/index';

const Home = (props) => {
    // const [bannerList, serBannerList] = useState([]);
    // const [hotList, setHotList] = useState([]);
    // const [recommendList, setRecommendList] = useState([]);
    const [roomVoiceList, setRoomVoiceList] = useState([]);
    // const [info, setInfo] = useState();
    const [hasMore, setHasMore] = useState(true);
    const todayPage = useRef(0);
    let navigate = useNavigate();

    // const toPageFn = useCallback((event) => {
    //     let url = event.currentTarget.dataset.url;
    //     window.location.href = url;
    // }, []);

    // const toSearchFn = useCallback(
    //     (event) => {
    //         navigate('/search');
    //     },
    //     [navigate],
    // );

    const toRoomFn = useCallback(
        (event) => {
            let rid = event.currentTarget.dataset.rid;
            navigate('/room/' + rid);
        },
        [navigate],
    );

    const getIndex = useCallback(() => {
        instance
            .get('/api/v1/app/roomList', {
                params: {
                    page: 1,
                },
            })
            .then((d) => {
                console.log(d);
                setRoomVoiceList(d.content.roomList);
                // serBannerList(d.content.bannerList);
                // setHotList(d.content.hotList);
                // setRecommendList(d.content.recommendList);

                //setRoomVoiceList(d.content.roomVoiceList);
            });
    }, []);

    const loadMore = useCallback(() => {
        // if (info && todayPage.current > info.page_number) {
        //     return;
        // }
        todayPage.current++;
        return instance
            .get('/api/v1/app/roomList', {
                params: {
                    page: todayPage.current,
                },
            })
            .then((d) => {
                if (d.code === '200') {
                    if (d.content.length > 0) {
                        setHasMore(true);
                    } else {
                        setHasMore(false);
                    }
                    setRoomVoiceList((val) => [...val, ...d.content.roomList]);
                }
            });
    }, []);

    // const verticalItems =
    //     bannerList.length > 0 &&
    //     bannerList.map((item, index) => (
    //         <Swiper.Item key={index} onClick={toPageFn} data-url={item.jumpUrl}>
    //             <div className="verticalContent">
    //                 <img src={item.bannerimg} alt="" />
    //             </div>
    //         </Swiper.Item>
    //     ));

    // const recommendContent =
    //     recommendList.length > 0 &&
    //     recommendList.map((item, index) => (
    //         <Swiper.Item
    //             key={index}
    //             onClick={toRoomFn}
    //             data-url={item.jumpUrl}
    //             data-rid={item.uid}
    //         >
    //             <div className="recom-bg">
    //                 <div className="recom-user">
    //                     <div className="spic">
    //                         <img src={item.userInfo.pos_pic} alt="" />
    //                     </div>
    //                     <div className="info">
    //                         <div className="alias">{item.userInfo.alias}</div>
    //                         <div className="type-title">{item.typeTitle}</div>
    //                     </div>
    //                 </div>
    //                 <div className="recom-icon"></div>
    //             </div>
    //         </Swiper.Item>
    //     ));

    // const hostConetnt =
    //     hotList.length > 0 &&
    //     hotList.map((item, index) => {
    //         return (
    //             <li
    //                 key={index}
    //                 onClick={toRoomFn}
    //                 data-rid={item.uid}
    //                 style={{
    //                     backgroundImage: 'url(' + item.userInfo.pos_pic + ')',
    //                     backgroundSize: '100% 100%',
    //                 }}
    //             >
    //                 <div className="li-type">{item.typeTitle}</div>
    //                 <div className="li-mask">
    //                     <div className="name">{item.title}</div>
    //                     <div className="num">{item.heatNum}</div>
    //                 </div>
    //             </li>
    //         );
    //     });

    const VoiceConetnt =
        roomVoiceList.length > 0 &&
        roomVoiceList.map((item, index) => {
            return (
                <li
                    key={index}
                    onClick={toRoomFn}
                    data-rid={item.uid}
                    style={{
                        backgroundImage: 'url(' + item.poster + ')',
                        backgroundSize: '100% 100%',
                    }}
                >
                    <div className="li-type">{item.typeTitle}</div>
                    <div className="li-mask">
                        <div className="name">{item.title}</div>
                        <div className="num">{item.heatNum}</div>
                    </div>
                </li>
            );
        });

    //useStyles(s);
    useEffect(() => {
        getIndex();
    }, [getIndex]);

    return (
        <div className="home">
            <header>
                <div className="nav-text">推荐</div>
                {/* <div className="search-div" onClick={toSearchFn}>
                    <div className="s-icon"></div>
                    <div className="s-text">搜索房间号/ID</div>
                </div> */}
            </header>
            {/* <div className="banner-swiper">
                <Swiper
                    autoplay={true}
                    loop={true}
                    autoplayInterval={5000}
                    indicatorProps={{
                        color: 'white',
                    }}
                >
                    {verticalItems}
                </Swiper>
            </div>
            <div className="hot-list">
                <div className="title">热门推荐</div>
                <div className="hot-arr">
                    <ul>{hostConetnt}</ul>
                </div>
            </div>
            <div className="recommend">
                <Swiper
                    autoplay={true}
                    loop={true}
                    autoplayInterval={5000}
                    direction={'vertical'}
                    style={{ '--height': '120px' }}
                    indicatorProps={{
                        color: 'white',
                    }}
                >
                    {recommendContent}
                </Swiper>
            </div> */}
            <div className="voice-list">
                <div className="title">热门推荐</div>
                <div className="voice-arr">
                    <ul>{VoiceConetnt}</ul>
                    <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
                </div>
            </div>
        </div>
    );
};

export default Home;
