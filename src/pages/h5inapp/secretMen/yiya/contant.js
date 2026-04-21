import { APPNAME } from '@/utility/appName';

const hostname = window.location.hostname;

const IMG_URL_NEW = APPNAME[hostname].staticUrl + '/secretPeople/';

const MEN = [
    {
        title: '专属礼物',
        icon: IMG_URL_NEW + 'icon_new.png',
        text: '赠予独一无二的宠爱',
    },
    {
        title: '专属座驾',
        icon: IMG_URL_NEW + 'icon_7.png',
        text: '炫酷特效随你高调入场',
    },
    {
        title: '专属形象',
        icon: IMG_URL_NEW + 'icon_1.png',
        text: '专属头像与头像框充斥神秘魔力',
    },
    {
        title: '专属勋章',
        icon: IMG_URL_NEW + 'icon_2.png',
        text: '独特的勋章彰显尊贵身份',
    },
    {
        title: '专属资料卡',
        icon: IMG_URL_NEW + 'icon_5.png',
        text: '高奢资料卡隐匿你的真面目',
    },
    {
        title: '专属变声、声波效果',
        icon: IMG_URL_NEW + 'icon_4.png',
        text: '从里到外无法猜透',
    },
    {
        title: '专属上麦动效',
        icon: IMG_URL_NEW + 'icon_3.png',
        text: '从里到外无法猜透',
    },
];
export { MEN };
