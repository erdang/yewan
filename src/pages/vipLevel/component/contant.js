import { APPNAME } from '@/utility/appName';

const hostname = window.location.hostname;

const IMG_URL_NEW = APPNAME[hostname].staticUrl + '/vip_buz/';

export const VIP_INFO = {
    0: {
        level: 0,
        levelIcon: IMG_URL_NEW + 'vip0_b.png',
        num: 30000,
        tips: '充值解锁以下权益，享受更多精彩',
        privileged_arr: [
            {
                name: '头像框',
                icon: IMG_URL_NEW + 'vop0_txk.png',
            },
            // {
            //     name: '声波',
            //     icon: IMG_URL_NEW + 'vip0_sb.png',
            // },
            {
                name: '资料卡边框',
                icon: IMG_URL_NEW + 'vop0_zlk.png',
            },
            {
                name: '座驾',
                icon: IMG_URL_NEW + 'vop0_zj.png',
            },
            {
                name: '气泡框',
                icon: IMG_URL_NEW + 'vip0_qpk.png?v=2',
            },
            {
                name: '礼物购买1个',
                icon: IMG_URL_NEW + 'vop0_lwgm.png',
            },
            {
                name: '昵称样式',
                icon: IMG_URL_NEW + 'vop0_ncys.png',
            },
            {
                name: '弹幕卡10个',
                icon: IMG_URL_NEW + 'vop0_dm.png',
            },
        ],
    },
    1: {
        level: 1,
        levelIcon: IMG_URL_NEW + 'vip1_b.png',
        num: 30000,
        tips: '共计7项特权，解锁更多权益，享受更多精彩',
        privileged_arr: [
            {
                name: '头像框',
                icon: IMG_URL_NEW + 'vip1_txk.png',
            },
            // {
            //     name: '声波',
            //     icon: IMG_URL_NEW + 'vip1_sb.png',
            // },
            {
                name: '资料卡边框',
                icon: IMG_URL_NEW + 'vip1_zlk.png',
            },
            {
                name: '座驾',
                icon: IMG_URL_NEW + 'vip1_zj.png',
            },
            {
                name: '气泡框',
                icon: IMG_URL_NEW + 'vip1_qpk.png?v=2',
            },
            {
                name: '礼物购买1个',
                icon: IMG_URL_NEW + 'vip1_lwgm.png',
            },
            {
                name: '昵称样式',
                icon: IMG_URL_NEW + 'vip1_ncys.png',
            },
            {
                name: '弹幕卡10个',
                icon: IMG_URL_NEW + 'vip1_dm.png',
            },
        ],
    },
    2: {
        level: 2,
        levelIcon: IMG_URL_NEW + 'vip2_b.png',
        num: 50000,
        tips: '共计12项特权，解锁更多权益，享受更多精彩',
        privileged_arr: [
            {
                name: '头像框',
                icon: IMG_URL_NEW + 'vip2_txk.png',
            },
            {
                name: '声波',
                icon: IMG_URL_NEW + 'vip2_sb.png',
            },
            {
                name: '资料卡边框',
                icon: IMG_URL_NEW + 'vip2_zlk.png',
            },
            {
                name: '座驾',
                icon: IMG_URL_NEW + 'vip2_zj.png',
            },
            {
                name: '气泡框',
                icon: IMG_URL_NEW + 'vip2_qpk.png?v=2',
            },
            {
                name: '礼物购买2个',
                icon: IMG_URL_NEW + 'vip2_lwgm.png',
            },
            {
                name: '昵称样式',
                icon: IMG_URL_NEW + 'vip2_ncys.png',
            },
            {
                name: '弹幕卡30个',
                icon: IMG_URL_NEW + 'vip2_dm.png',
            },
            {
                name: '上麦动效',
                icon: IMG_URL_NEW + 'vip2_sm.png?v=1',
            },
            {
                name: '防跟随',
                icon: IMG_URL_NEW + 'vip2_fgs.png',
            },
            {
                name: '防踢防禁言',
                icon: IMG_URL_NEW + 'vip2_ft.png',
            },
            {
                name: 'VIP称号隐藏',
                icon: IMG_URL_NEW + 'vip2_ch.png',
            },
        ],
    },
    3: {
        level: 3,
        levelIcon: IMG_URL_NEW + 'vip3_b.png',
        num: 100000,
        tips: '共计14项特权，解锁更多权益，享受更多精彩',
        privileged_arr: [
            {
                name: '头像框',
                icon: IMG_URL_NEW + 'vip3_txk.png',
            },
            {
                name: '声波',
                icon: IMG_URL_NEW + 'vip3_sb.png',
            },
            {
                name: '资料卡边框',
                icon: IMG_URL_NEW + 'vip3_zlk.png',
            },
            {
                name: '座驾',
                icon: IMG_URL_NEW + 'vip3_zj.png',
            },
            {
                name: '气泡框',
                icon: IMG_URL_NEW + 'vip3_qpk.png?v=3',
            },
            {
                name: '礼物购买3个',
                icon: IMG_URL_NEW + 'vip3_lwgm.png',
            },
            {
                name: '昵称样式',
                icon: IMG_URL_NEW + 'vip3_ncys.png',
            },
            {
                name: '弹幕卡50个',
                icon: IMG_URL_NEW + 'vip3_dm.png',
            },
            {
                name: '上麦动效',
                icon: IMG_URL_NEW + 'vip3_sm.png',
            },
            {
                name: '防跟随',
                icon: IMG_URL_NEW + 'vip3_fgs.png',
            },
            {
                name: '防踢防禁言',
                icon: IMG_URL_NEW + 'vip3_ft.png',
            },
            {
                name: 'VIP称号隐藏',
                icon: IMG_URL_NEW + 'vip3_ch.png',
            },
            {
                name: '全服喊话',
                icon: IMG_URL_NEW + 'vip3_qfhh.png',
            },
            {
                name: 'VIP专属客服',
                icon: IMG_URL_NEW + 'vip3_kf.png',
            },
            {
                name: '神秘人',
                icon: IMG_URL_NEW + 'vip3_smR.png',
            },
        ],
    },
};
