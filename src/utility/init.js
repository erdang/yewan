// import { cache } from './utility/indexdb';
import { initDB, setVal, getVal } from '@/utility/indexdb';
import instance, { instanceGift } from '@/request/index';
import routesConfig from '@/routes/index';
import urltool from 'ox-util/src/url';

const indexdbInit = (store, setHas) => {
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
                            store.dispatch({
                                type: 'CHANGE_GIFT',
                                gift: s.gifts,
                            });
                            setHas(true);
                        });
                    } else {
                        getVal('db', 'cache', 'gift', (e) => {
                            console.log(e);
                            store.dispatch({
                                type: 'CHANGE_GIFT',
                                gift: e.data.gifts,
                            });
                            setHas(true);
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
};
const searchParam = urltool.param(window.location.search);
let location = window.location;
let currentPath = location.pathname;
let matchRoute = (b, type, result) => {
    if (b) {
        b.map((v) => {
            if (v[type] === true) {
                result.push(v.path);
            }
            if (v.children) {
                return matchRoute(v.children, type, result);
            }
        });
    }
};
let addRouteFn = (a, type) => {
    let result = [];
    let result2 = [];
    a.map((i) => {
        matchRoute(i.children, type, result);
        if (i[type] === true) {
            result2.push(i.path);
        }
    });

    return result.concat(result2);
};

const allPath = addRouteFn(routesConfig, 'auth');

// console.log(allPath);

export { indexdbInit, currentPath, allPath, searchParam };
