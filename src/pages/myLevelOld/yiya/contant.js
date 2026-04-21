import { APPNAME } from '@/utility/appName';

const hostname = window.location.hostname;

const IMG_URL_NEW = APPNAME[hostname].staticUrl + '/r_level/';

const Task_Color = [
    '#8B9FBF',
    '#74BFA4',
    '#5EA4E5',
    '#758BFF',
    '#D9A65A',
    '#599AD7',
    '#8D73F2',
    '#E55E8F',
];

const Task_Arr = [
    {
        icon: 'liwu',
        title: '赠送任意礼物',
        text: '每1Z币可获得1点经验值',
        text_1: '',
    },
    {
        icon: 'fenxiang',
        title: '分享语音房',
        text: '每次可获得3点经验值,每日上限9点',
        text_1: '每日上限9点',
    },
    {
        icon: 'zhibo',
        title: '观看直播',
        text: '每2min可获得1点经验值,每日上限15点',
        text_1: '每日上限15点',
    },
    {
        icon: 'liaotian',
        title: '发聊天消息',
        text: '每条消息可获得1点经验值,每日上限5点',
        text_1: '每日上限5点',
    },
    {
        icon: 'dongtai',
        title: '动态互动',
        text: '每次互动可获得3点经验值,每日上限9点',
        text_1: '每日上限9点',
    },
];

const VP = [
    {
        title: '声波样式7天',
        id: 1,
        icon: 'shengbo',
        text: '3级解锁',
    },
    {
        title: '声波样式10天',
        id: 2,
        icon: 'shengbo',
        text: '6级解锁',
    },
    {
        title: '进场特效7天',
        id: 3,
        icon: 'jinchang',
        text: '28级解锁',
    },
    {
        title: '只接收我关注人的消息',
        id: 4,
        icon: 'guanzhu',
        text: '36级解锁',
    },
    {
        title: '动态头像、活跃称号隐藏',
        id: 5,
        icon: 'dongtai',
        text: '55级解锁',
    },
    {
        title: '资料卡背景颜色15天',
        id: 6,
        icon: 'ziliaoka',
        text: '70级解锁',
    },
    {
        title: '资料卡背景颜色30天',
        id: 7,
        icon: 'ziliaoka',
        text: '132级解锁',
    },
    {
        title: '专属客服',
        id: 8,
        icon: 'kefu',
        text: '170级解锁',
    },
];
const LEVEL_ARR = [
    {
        title: '小透明',
        min: '1',
        max: '2',
        vp: 0,
        bg: IMG_URL_NEW + 'touming_bg.png',
        k_bg: IMG_URL_NEW + 'xtm.png',
        k_icon: IMG_URL_NEW + 'touming_icon.png',
        title_1_color: '#7B8DA5',
        title_2_color: '#69798C',
        bar_active_color: 'linear-gradient(90deg, #667D9D 0%, #8EABD0 93%)',
        btn_color: '#8B9FBF',
        task_color: '#C2E2E0',
    },
    {
        title: '蛋蛋',
        min: '3',
        max: '5',
        vp: 1,
        bg: IMG_URL_NEW + 'dandan_bg.png',
        k_bg: IMG_URL_NEW + 'ddy.png',
        k_icon: IMG_URL_NEW + 'dandan_icon.png',
        title_1_color: '#39B9DF',
        title_2_color: '#39B9DF',
        bar_active_color: 'linear-gradient(297deg, #A2E2FF 0%, #44CFFC 100%)',
        btn_color: 'linear-gradient(131deg, #374B5C 0%, #1A2E42 100%)',
        task_color: 'rgba(194, 226, 224, 1)',
    },
    {
        title: '新星',
        min: '6',
        max: '9',
        vp: 2,
        bg: IMG_URL_NEW + 'xinxing_bg.png',
        k_bg: IMG_URL_NEW + 'xxy.png',
        k_icon: IMG_URL_NEW + 'xinxing_icon.png',
        title_1_color: '#4EA5E4',
        title_2_color: '#1679D4',
        bar_active_color: 'linear-gradient(90deg, #207FD7 0%, #3FA2EB 93%)',
        btn_color: '#5EA4E5',
        task_color: '#DFFBFF',
    },
    {
        title: '达人Ⅰ',
        min: '10',
        max: '13',
        vp: 2,
        bg: IMG_URL_NEW + 'daren_bg.png',
        k_bg: IMG_URL_NEW + 'dry.png',
        k_icon: IMG_URL_NEW + 'daren_icon_1.png',
        title_1_color: '#7782EC',
        title_2_color: '#4454E2',
        bar_active_color: 'linear-gradient(90deg, #4B63E0 0%, #7B8DFD 93%)',
        btn_color: '#758BFF',
        task_color: '#D7E2FF',
    },
    {
        title: '达人Ⅱ',
        min: '14',
        max: '20',
        vp: 2,
        bg: IMG_URL_NEW + 'daren_bg.png',
        k_bg: IMG_URL_NEW + 'dry.png',
        k_icon: IMG_URL_NEW + 'daren_icon_2.png',
        title_1_color: '#7782EC',
        title_2_color: '#4454E2',
        bar_active_color: 'linear-gradient(90deg, #4B63E0 0%, #7B8DFD 93%)',
        btn_color: '#758BFF',
        task_color: '#D7E2FF',
    },
    {
        title: '达人Ⅲ',
        min: '21',
        max: '27',
        vp: 2,
        bg: IMG_URL_NEW + 'daren_bg.png',
        k_bg: IMG_URL_NEW + 'dry.png',
        k_icon: IMG_URL_NEW + 'daren_icon_3.png',
        title_1_color: '#7782EC',
        title_2_color: '#4454E2',
        bar_active_color: 'linear-gradient(90deg, #4B63E0 0%, #7B8DFD 93%)',
        btn_color: '#758BFF',
        task_color: '#D7E2FF',
    },
    {
        title: '强者Ⅰ',
        min: '28',
        max: '35',
        vp: 3,
        bg: IMG_URL_NEW + 'qiangzhe_bg.png',
        k_bg: IMG_URL_NEW + 'qzy.png',
        k_icon: IMG_URL_NEW + 'qiangzhe_icon_1.png',
        title_1_color: '#DE7A4F',
        title_2_color: '#A44629',
        bar_active_color: 'linear-gradient(90deg, #DC7A53 0%, #FF975C 93%)',
        btn_color: '#D9A65A',
        task_color: '#FFE4BC',
    },
    {
        title: '强者Ⅱ',
        min: '36',
        max: '54',
        vp: 4,
        bg: IMG_URL_NEW + 'qiangzhe_bg.png',
        k_bg: IMG_URL_NEW + 'qzy.png',
        k_icon: IMG_URL_NEW + 'qiangzhe_icon_2.png',
        title_1_color: '#DE7A4F',
        title_2_color: '#A44629',
        bar_active_color: 'linear-gradient(90deg, #DC7A53 0%, #FF975C 93%)',
        btn_color: '#D9A65A',
        task_color: '#FFE4BC',
    },
    {
        title: '强者Ⅲ',
        min: '55',
        max: '69',
        vp: 5,
        bg: IMG_URL_NEW + 'qiangzhe_bg.png',
        k_bg: IMG_URL_NEW + 'qzy.png',
        k_icon: IMG_URL_NEW + 'qiangzhe_icon_3.png',
        title_1_color: '#DE7A4F',
        title_2_color: '#A44629',
        bar_active_color: 'linear-gradient(90deg, #DC7A53 0%, #FF975C 93%)',
        btn_color: '#D9A65A',
        task_color: '#FFE4BC',
    },
    {
        title: '名流Ⅰ',
        min: '70',
        max: '87',
        vp: 6,
        bg: IMG_URL_NEW + 'mingliu_bg.png',
        k_bg: IMG_URL_NEW + 'mly.png',
        k_icon: IMG_URL_NEW + 'mingliu_icon_1.png',
        title_1_color: '#F7FDFF',
        title_2_color: '#D7F8FF',
        bar_active_color: 'linear-gradient(90deg, #DFFDFF 0%, #CAE4EB 93%)',
        btn_color: '#599AD7',
        task_color: '#D7ECFF',
    },
    {
        title: '名流Ⅱ',
        min: '88',
        max: '112',
        vp: 6,
        bg: IMG_URL_NEW + 'mingliu_bg.png',
        k_bg: IMG_URL_NEW + 'mly.png',
        k_icon: IMG_URL_NEW + 'mingliu_icon_2.png',
        title_1_color: '#F7FDFF',
        title_2_color: '#D7F8FF',
        bar_active_color: 'linear-gradient(90deg, #DFFDFF 0%, #CAE4EB 93%)',
        btn_color: '#599AD7',
        task_color: '#D7ECFF',
    },
    {
        title: '名流Ⅲ',
        min: '113',
        max: '131',
        vp: 6,
        bg: IMG_URL_NEW + 'mingliu_bg.png',
        k_bg: IMG_URL_NEW + 'mly.png',
        k_icon: IMG_URL_NEW + 'mingliu_icon_3.png',
        title_1_color: '#F7FDFF',
        title_2_color: '#D7F8FF',
        bar_active_color: 'linear-gradient(90deg, #DFFDFF 0%, #CAE4EB 93%)',
        btn_color: '#599AD7',
        task_color: '#D7ECFF',
    },
    {
        title: '顶流Ⅰ',
        min: '132',
        max: '144',
        vp: 7,
        bg: IMG_URL_NEW + 'dingliu_bg.png',
        k_bg: IMG_URL_NEW + 'dly.png',
        k_icon: IMG_URL_NEW + 'dingliu_icon_1.png',
        title_1_color: '#FBF9FF',
        title_2_color: '#F7EEFF',
        bar_active_color: 'linear-gradient(90deg, #DCE2FA 0%, #DDD7FF 93%)',
        btn_color: '#8D73F2',
        task_color: '#DFD7FF',
    },
    {
        title: '顶流Ⅱ',
        min: '145',
        max: '158',
        vp: 7,
        bg: IMG_URL_NEW + 'dingliu_bg.png',
        k_bg: IMG_URL_NEW + 'dly.png',
        k_icon: IMG_URL_NEW + 'dingliu_icon_2.png',
        title_1_color: '#FBF9FF',
        title_2_color: '#F7EEFF',
        bar_active_color: 'linear-gradient(90deg, #DCE2FA 0%, #DDD7FF 93%)',
        btn_color: '#8D73F2',
        task_color: '#DFD7FF',
    },
    {
        title: '顶流Ⅲ',
        min: '159',
        max: '169',
        vp: 7,
        bg: IMG_URL_NEW + 'dingliu_bg.png',
        k_bg: IMG_URL_NEW + 'dly.png',
        k_icon: IMG_URL_NEW + 'dingliu_icon_3.png',
        title_1_color: '#FBF9FF',
        title_2_color: '#F7EEFF',
        bar_active_color: 'linear-gradient(90deg, #DCE2FA 0%, #DDD7FF 93%)',
        btn_color: '#8D73F2',
        task_color: '#DFD7FF',
    },
    {
        title: '神豪',
        min: '170',
        max: '9999',
        vp: 8,
        bg: IMG_URL_NEW + 'shenhao_bg.png',
        k_bg: IMG_URL_NEW + 'shy.png',
        k_icon: IMG_URL_NEW + 'shenhao_icon.png',
        title_1_color: '#FBF9FF',
        title_2_color: '#F1DADE',
        bar_active_color: 'linear-gradient(90deg, #FFE2E5 0%, #FFC6CC 93%)',
        btn_color: '#E55E8F',
        task_color: '#FFDFDA',
    },
];

const getReal = (d) => {
    let real = '';
    if (d >= 1 && d <= 2) {
        real = LEVEL_ARR[0];
    } else if (d >= 3 && d <= 5) {
        real = LEVEL_ARR[1];
    } else if (d >= 6 && d <= 9) {
        real = LEVEL_ARR[2];
    } else if (d >= 10 && d <= 13) {
        real = LEVEL_ARR[3];
    } else if (d >= 14 && d <= 20) {
        real = LEVEL_ARR[4];
    } else if (d >= 21 && d <= 27) {
        real = LEVEL_ARR[5];
    } else if (d >= 28 && d <= 35) {
        real = LEVEL_ARR[6];
    } else if (d >= 36 && d <= 54) {
        real = LEVEL_ARR[7];
    } else if (d >= 55 && d <= 69) {
        real = LEVEL_ARR[8];
    } else if (d >= 70 && d <= 87) {
        real = LEVEL_ARR[9];
    } else if (d >= 88 && d <= 112) {
        real = LEVEL_ARR[10];
    } else if (d >= 113 && d <= 131) {
        real = LEVEL_ARR[11];
    } else if (d >= 132 && d <= 144) {
        real = LEVEL_ARR[12];
    } else if (d >= 145 && d <= 158) {
        real = LEVEL_ARR[13];
    } else if (d >= 159 && d <= 169) {
        real = LEVEL_ARR[14];
    } else if (d >= 170 && d <= 999) {
        real = LEVEL_ARR[15];
    }
    return real;
};

const TE_ARR = [
    {
        title: '头像框',
        info: 'XX等级解锁',
        icon: IMG_URL_NEW + 'touxiang.png',
    },
    {
        title: '聊天气泡',
        info: 'XX等级解锁',
        icon: IMG_URL_NEW + 'liaotian.png',
    },
    {
        title: '昵称样式',
        info: 'XX等级解锁',
        icon: IMG_URL_NEW + 'nicheng.png',
    },
    {
        title: '礼物特权',
        info: 'XX等级解锁',
        icon: IMG_URL_NEW + 'liwu.png',
    },
    {
        title: '麦位声波',
        info: 'XX等级解锁',
        icon: IMG_URL_NEW + 'maiwei.png',
    },
    {
        title: '入场特效',
        info: 'XX等级解锁',
        icon: IMG_URL_NEW + 'ruchang.png',
    },
    {
        title: '上麦动效',
        info: 'XX等级解锁',
        icon: IMG_URL_NEW + 'shangmai.png',
    },
    {
        title: '资料卡边框',
        info: 'XX等级解锁',
        icon: IMG_URL_NEW + 'ziliaoka.png',
    },
    {
        title: '座驾',
        info: 'XX等级解锁',
        icon: IMG_URL_NEW + 'zuojia.png',
    },
];

export { LEVEL_ARR, VP, getReal, Task_Arr, Task_Color, TE_ARR };
