import { appGate } from '@/utility/appGate';
import mediator from 'ox-util/src/mediator';
import instance from '@/request/index';
import { defaultUserInfo } from '@/utility/orizeInfo';
import urltool from 'ox-util/src/url';

import { Dialog } from 'antd-mobile';
// import VConsole from 'vconsole';

// // eslint-disable-next-line no-unused-vars
// const vConsole = new VConsole();
// console.log(process.env.NODE_ENV);

class User {
    constructor() {
        this.userInfo = localStorage.getItem('userInfo') || 'null';
        this.ticket = localStorage.getItem('ticket') || '';

        // if (appGate.inApp()) {
        //     this.synchronizeWithApp();
        // }
    }

    getUser(ticket) {
        return new Promise((resolve, reject) => {
            instance
                .post('/api/v1/user/getUserInfo', {
                    token: ticket,
                })
                .then((e) => {
                    if (e.code === '200') {
                        resolve(e.content);
                    }
                });
        });
    }
    refresh(ticket) {
        mediator.publish('changeTicket', ticket);

        if (
            (ticket &&
                ticket !== 'null' &&
                (this.userInfoString === 'null' ||
                    this.userInfoString === JSON.stringify(defaultUserInfo))) ||
            ticket !== this.ticket
        ) {
            //切换用户 清除 store 里的上一个用户信息
            this.userInfoString = JSON.stringify(defaultUserInfo);
            localStorage.setItem('userInfo', JSON.stringify(defaultUserInfo));
            mediator.publish('userInfo', JSON.stringify(defaultUserInfo));
            return new Promise((resolve, reject) => {
                instance
                    .post('/api/v1/user/getUserInfo', {
                        token: ticket,
                    })
                    .then((e) => {
                        resolve(e);
                        if (e.code === '200') {
                            this.userInfoString = JSON.stringify(e.content);
                            localStorage.setItem(
                                'userInfo',
                                JSON.stringify(e.content),
                            );
                            mediator.publish(
                                'userInfo',
                                JSON.stringify(e.content),
                            );
                            this.ticket = ticket;
                            localStorage.setItem('ticket', ticket);
                            !appGate.inApp() && this.toNextPage();
                        } else if (e.code === '402') {
                            Dialog.alert({
                                content: '请去APP完善资料',
                                confirmText: '确定',
                                onConfirm: () => {},
                            });
                            return false;
                        }
                    });
            });
        }
    }
    toNextPage() {
        const searchParam = urltool.param(window.location.search);
        searchParam.next
            ? window.location.assign(decodeURIComponent(searchParam.next))
            : window.location.assign('/home');
    }
    logout() {
        localStorage.setItem('ticket', '');
        this.ticket = '';
        localStorage.setItem('userInfo', JSON.stringify(defaultUserInfo));
        this.userInfoString = JSON.stringify(defaultUserInfo);
    }
    toLogin() {
        let next =
            window.location.pathname +
            encodeURIComponent(window.location.search);

        if (appGate.inApp()) {
            appGate.toLogin();
        } else {
            this.logout();
            window.location.assign('/logonPage?next=' + next);
        }
    }
    synchronizeWithApp() {
        return appGate.getTicket().then((ticket) => {
            this.refresh(ticket);
        });
    }
}

const user = new User();

export default user;
