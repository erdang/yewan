import { useEffect, useCallback } from 'react';
import { initDB, setVal, getVal } from '@/utility/indexdb';
import instance, { instanceGift } from '@/request/index';

const useGift = (changeGift) => {
    const indexdbInit = useCallback(() => {
        initDB('db', 'cache', 'gift');
        instance
            .get('/api/gift/update', {
                params: {
                    ver: '1',
                },
            })
            .then((d) => {
                if (d.code === '200') {
                    let url = d.content.down;
                    let ver = d.content.ver;
                    // console.log(url.substring(21));
                    getVal('db', 'cache', 'gift', (e) => {
                        if ((e && e.data.ver !== ver) || e === null) {
                            instanceGift.get(url).then((s) => {
                                console.log(s);
                                setVal('db', 'cache', {
                                    gift: 'gift',
                                    data: { ver: ver, gifts: s.gifts },
                                });
                                changeGift(s.gifts);
                            });
                        } else {
                            getVal('db', 'cache', 'gift', (e) => {
                                console.log(e);
                                changeGift(e.data.gifts);
                            });
                        }
                    });
                } else {
                    console.log(d.content);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, [changeGift]);
    useEffect(() => {
        indexdbInit();
    }, [indexdbInit]);
};

export default useGift;
