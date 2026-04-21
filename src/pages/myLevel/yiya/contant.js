import { APPNAME } from '@/utility/appName';

const hostname = window.location.hostname;

const IMG_URL_NEW = APPNAME[hostname].staticUrl + '/myLevel_buz/';

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
    // {
    //     icon: 'fenxiang',
    //     title: '分享语音房',
    //     text: '每次可获得3点经验值,每日上限9点',
    //     text_1: '每日上限9点',
    // },
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
        title_1_color: 'rgba(122, 164, 148, 1)',
        title_2_color: 'rgba(105, 140, 126, 1)',
        bar_active_color:
            'linear-gradient(90deg, rgba(132, 181, 150, 1) 0%, rgba(169, 220, 195, 1) 93%)',
        btn_color: 'linear-gradient(131deg, #53685D 0%, #274539 100%)',
        task_color: 'rgba(186, 201, 223, 1)',
        icon_bg_color:
            'linear-gradient(131deg, rgba(83, 104, 93, 0.3) 0%, rgba(39, 69, 57, 0.3) 100%)',
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
        icon_bg_color:
            'linear-gradient(131deg, rgba(77, 104, 128, 0.3) 0%, rgba(38, 73, 108, 0.3) 100%)',
    },
    {
        title: '新星',
        min: '6',
        max: '9',
        vp: 2,
        bg: IMG_URL_NEW + 'xinxing_bg.png',
        k_bg: IMG_URL_NEW + 'xxy.png',
        k_icon: IMG_URL_NEW + 'xinxing_icon.png',
        title_1_color: '#5783F0',
        title_2_color: '#5783F0',
        bar_active_color: 'linear-gradient(90deg, #349AF7 0%, #8EB1FF 100%)',
        btn_color: ' linear-gradient(131deg, #3B4B6E 0%, #1D2350 100%)',
        task_color: 'rgba(176, 228, 255, 1)',
        icon_bg_color:
            'linear-gradient(131deg, rgba(52, 154, 247, 0.3) 0%, rgba(142, 177, 255, 0.3) 100%)',
    },
    {
        title: '达人Ⅰ',
        min: '10',
        max: '13',
        vp: 2,
        bg: IMG_URL_NEW + 'daren_bg.png',
        k_bg: IMG_URL_NEW + 'dry.png',
        k_icon: IMG_URL_NEW + 'daren_icon_1.png',
        title_1_color: '#5857B8',
        title_2_color: '#5857B8',
        bar_active_color: 'linear-gradient(90deg, #816BEC 0%, #9B9BFF 100%)',
        btn_color: 'linear-gradient(131deg, #4D497C 0%, #251C4C 100%)',
        task_color: 'rgba(182, 202, 255, 1)',
        icon_bg_color:
            'linear-gradient(131deg, rgba(95, 89, 172, 0.3) 0%, rgba(62, 43, 142, 0.3) 100%)',
    },
    {
        title: '达人Ⅱ',
        min: '14',
        max: '20',
        vp: 2,
        bg: IMG_URL_NEW + 'daren_bg.png',
        k_bg: IMG_URL_NEW + 'dry.png',
        k_icon: IMG_URL_NEW + 'daren_icon_2.png',
        title_1_color: '#5857B8',
        title_2_color: '#5857B8',
        bar_active_color: 'linear-gradient(90deg, #816BEC 0%, #9B9BFF 100%)',
        btn_color: 'linear-gradient(131deg, #4D497C 0%, #251C4C 100%)',
        task_color: 'rgba(182, 202, 255, 1)',
        icon_bg_color:
            'linear-gradient(131deg, rgba(95, 89, 172, 0.3) 0%, rgba(62, 43, 142, 0.3) 100%)',
    },
    {
        title: '达人Ⅲ',
        min: '21',
        max: '27',
        vp: 2,
        bg: IMG_URL_NEW + 'daren_bg.png',
        k_bg: IMG_URL_NEW + 'dry.png',
        k_icon: IMG_URL_NEW + 'daren_icon_3.png',
        title_1_color: '#5857B8',
        title_2_color: '#5857B8',
        bar_active_color: 'linear-gradient(90deg, #816BEC 0%, #9B9BFF 100%)',
        btn_color: 'linear-gradient(131deg, #4D497C 0%, #251C4C 100%)',
        task_color: 'rgba(182, 202, 255, 1)',
        icon_bg_color:
            'linear-gradient(131deg, rgba(95, 89, 172, 0.3) 0%, rgba(62, 43, 142, 0.3) 100%)',
    },
    {
        title: '强者Ⅰ',
        min: '28',
        max: '35',
        vp: 3,
        bg: IMG_URL_NEW + 'qiangzhe_bg.png',
        k_bg: IMG_URL_NEW + 'qzy.png',
        k_icon: IMG_URL_NEW + 'qiangzhe_icon_1.png',
        title_1_color: '#8A4FDE',
        title_2_color: '#8A4FDE',
        bar_active_color: 'linear-gradient(90deg, #9859FE 0%, #BE98FF 100%)',
        btn_color: 'linear-gradient(131deg, #654587 0%, #321543 100%)',
        task_color: 'rgba(255, 228, 188, 1)',
        icon_bg_color:
            'linear-gradient(131deg, rgba(137, 82, 195, 0.3) 0%, rgba(105, 40, 142, 0.3) 100%)',
    },
    {
        title: '强者Ⅱ',
        min: '36',
        max: '54',
        vp: 4,
        bg: IMG_URL_NEW + 'qiangzhe_bg.png',
        k_bg: IMG_URL_NEW + 'qzy.png',
        k_icon: IMG_URL_NEW + 'qiangzhe_icon_2.png',
        title_1_color: '#8A4FDE',
        title_2_color: '#8A4FDE',
        bar_active_color: 'linear-gradient(90deg, #9859FE 0%, #BE98FF 100%)',
        btn_color: 'linear-gradient(131deg, #654587 0%, #321543 100%)',
        task_color: 'rgba(255, 228, 188, 1)',
        icon_bg_color:
            'linear-gradient(131deg, rgba(137, 82, 195, 0.3) 0%, rgba(105, 40, 142, 0.3) 100%)',
    },
    {
        title: '强者Ⅲ',
        min: '55',
        max: '69',
        vp: 5,
        bg: IMG_URL_NEW + 'qiangzhe_bg.png',
        k_bg: IMG_URL_NEW + 'qzy.png',
        k_icon: IMG_URL_NEW + 'qiangzhe_icon_3.png',
        title_1_color: '#8A4FDE',
        title_2_color: '#8A4FDE',
        bar_active_color: 'linear-gradient(90deg, #9859FE 0%, #BE98FF 100%)',
        btn_color: 'linear-gradient(131deg, #654587 0%, #321543 100%)',
        task_color: 'rgba(255, 228, 188, 1)',
        icon_bg_color:
            'linear-gradient(131deg, rgba(137, 82, 195, 0.3) 0%, rgba(105, 40, 142, 0.3) 100%)',
    },
    {
        title: '名流Ⅰ',
        min: '70',
        max: '87',
        vp: 6,
        bg: IMG_URL_NEW + 'mingliu_bg.png',
        k_bg: IMG_URL_NEW + 'mly.png',
        k_icon: IMG_URL_NEW + 'mingliu_icon_1.png',
        title_1_color: '#FFFFFF',
        title_2_color: '#FFFFFF',
        bar_active_color: 'linear-gradient(285deg, #F30F9F 0%, #D11096 100%)',
        btn_color: 'linear-gradient(131deg, #874587 0%, #681752 100%)',
        task_color: 'rgba(182, 220, 255, 1)',
        icon_bg_color:
            'linear-gradient(131deg, rgba(196, 84, 197, 0.3) 0%, rgba(134, 27, 106, 0.3) 100%)',
    },
    {
        title: '名流Ⅱ',
        min: '88',
        max: '112',
        vp: 6,
        bg: IMG_URL_NEW + 'mingliu_bg.png',
        k_bg: IMG_URL_NEW + 'mly.png',
        k_icon: IMG_URL_NEW + 'mingliu_icon_2.png',
        title_1_color: '#FFFFFF',
        title_2_color: '#FFFFFF',
        bar_active_color: 'linear-gradient(285deg, #F30F9F 0%, #D11096 100%)',
        btn_color: 'linear-gradient(131deg, #874587 0%, #681752 100%)',
        task_color: 'rgba(182, 220, 255, 1)',
        icon_bg_color:
            'linear-gradient(131deg, rgba(196, 84, 197, 0.3) 0%, rgba(134, 27, 106, 0.3) 100%)',
    },
    {
        title: '名流Ⅲ',
        min: '113',
        max: '131',
        vp: 6,
        bg: IMG_URL_NEW + 'mingliu_bg.png',
        k_bg: IMG_URL_NEW + 'mly.png',
        k_icon: IMG_URL_NEW + 'mingliu_icon_3.png',
        title_1_color: '#FFFFFF',
        title_2_color: '#FFFFFF',
        bar_active_color: 'linear-gradient(285deg, #F30F9F 0%, #D11096 100%)',
        btn_color: 'linear-gradient(131deg, #874587 0%, #681752 100%)',
        task_color: 'rgba(182, 220, 255, 1)',
        icon_bg_color:
            'linear-gradient(131deg, rgba(196, 84, 197, 0.3) 0%, rgba(134, 27, 106, 0.3) 100%)',
    },
    {
        title: '顶流Ⅰ',
        min: '132',
        max: '144',
        vp: 7,
        bg: IMG_URL_NEW + 'dingliu_bg.png',
        k_bg: IMG_URL_NEW + 'dly.png',
        k_icon: IMG_URL_NEW + 'dingliu_icon_1.png',
        title_1_color: '#FFFFFF',
        title_2_color: '#FFFFFF',
        bar_active_color: 'linear-gradient(304deg, #D92F2F 0%, #E43232 100%)',
        btn_color: 'linear-gradient(131deg, #874545 0%, #3E0D0D 100%)',
        task_color: 'rgba(184, 182, 255, 1)',
        icon_bg_color:
            'linear-gradient(131deg, rgba(197, 42, 18, 0.3) 0%, rgba(129, 29, 29, 0.3) 100%)',
    },
    {
        title: '顶流Ⅱ',
        min: '145',
        max: '158',
        vp: 7,
        bg: IMG_URL_NEW + 'dingliu_bg.png',
        k_bg: IMG_URL_NEW + 'dly.png',
        k_icon: IMG_URL_NEW + 'dingliu_icon_2.png',
        title_1_color: '#FFFFFF',
        title_2_color: '#FFFFFF',
        bar_active_color: 'linear-gradient(304deg, #D92F2F 0%, #E43232 100%)',
        btn_color: 'linear-gradient(131deg, #874545 0%, #3E0D0D 100%)',
        task_color: 'rgba(184, 182, 255, 1)',
        icon_bg_color:
            'linear-gradient(131deg, rgba(197, 42, 18, 0.3) 0%, rgba(129, 29, 29, 0.3) 100%)',
    },
    {
        title: '顶流Ⅲ',
        min: '159',
        max: '169',
        vp: 7,
        bg: IMG_URL_NEW + 'dingliu_bg.png',
        k_bg: IMG_URL_NEW + 'dly.png',
        k_icon: IMG_URL_NEW + 'dingliu_icon_3.png',
        title_1_color: '#FFFFFF',
        title_2_color: '#FFFFFF',
        bar_active_color: 'linear-gradient(304deg, #D92F2F 0%, #E43232 100%)',
        btn_color: 'linear-gradient(131deg, #874545 0%, #3E0D0D 100%)',
        task_color: 'rgba(184, 182, 255, 1)',
        icon_bg_color:
            'linear-gradient(131deg, rgba(197, 42, 18, 0.3) 0%, rgba(129, 29, 29, 0.3) 100%)',
    },
    {
        title: '神豪',
        min: '170',
        max: '9999',
        vp: 8,
        bg: IMG_URL_NEW + 'shenhao_bg.png',
        k_bg: IMG_URL_NEW + 'shy.png',
        k_icon: IMG_URL_NEW + 'shenhao_icon.png',
        title_1_color: '#FBF8FF',
        title_2_color: '#FBF8FF',
        bar_active_color: 'linear-gradient(318deg, #ECC06D 0%, #F09552 100%)',
        btn_color: 'linear-gradient(131deg, #8A6938 0%, #6D3E20 100%)',
        task_color: 'rgba(255, 196, 222, 1)',
        icon_bg_color:
            'linear-gradient(131deg, rgba(179, 130, 57, 0.3) 0%, rgba(156, 82, 36, 0.3) 100%)',
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

export { LEVEL_ARR, VP, getReal, Task_Arr, Task_Color };
