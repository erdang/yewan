var fill = function (n) {
    return n < 10 ? '0' + n : n + '';
};

export function format(time, template = 'y-m-d') {
    var dateObj = new Date(time);
    var year = dateObj.getFullYear();
    var month = fill(dateObj.getMonth() + 1);
    var date = fill(dateObj.getDate());
    var hour = fill(dateObj.getHours());
    var minute = fill(dateObj.getMinutes());
    var second = fill(dateObj.getSeconds());

    return template.replace(/y|m|d|h|i|s/g, function (s) {
        switch (s) {
            case 'y':
                return year;
            case 'm':
                return month;
            case 'd':
                return date;
            case 'h':
                return hour;
            case 'i':
                return minute;
            case 's':
                return second;
        }
    });
}

export function parseSecond(seconds) {
    var dateObj = new Date(seconds * 1000);
    var date = dateObj.getUTCDate() - 1;
    var hour = dateObj.getUTCHours();
    var minute = dateObj.getUTCMinutes();
    var second = dateObj.getUTCSeconds();

    return [date, hour, minute, second];
}

export function formatSecond(seconds) {
    var [hour, minute, second] = parseSecond(seconds).slice(1);

    return (
        (hour ? fill(hour) + ':' : '') +
        (minute ? fill(minute) + ':' : '') +
        (minute ? fill(second) : second)
    );
}

export function getFormatDuringTime(num) {
    var sec = num % 60; //06 秒
    var min = Math.floor(num / 60) % 60; //Math.floor(num / 60) % 60     分
    var hour = Math.floor(num / 60 / 60) % 24; //时
    var day = Math.floor(num / 60 / 60 / 24); //天数
    // var mon = setDb()
    return (
        (hour ? fill(hour) + ':' : '') +
        (min ? fill(min) + ':' : '') +
        fill(sec)
    );
}

export function getFormatSe(num) {
    var sec = num % 60; //06 秒
    var min = Math.floor(num / 60) % 60; //Math.floor(num / 60) % 60     分
    var hour = Math.floor(num / 60 / 60) % 24; //时
    var day = Math.floor(num / 60 / 60 / 24); //天数
    // var mon = setDb()
    return fill(hour) + ':' + fill(min) + ':' + fill(sec);
}
export function getFormatDay(num) {
    var sec = num % 60; //06 秒
    var min = Math.floor(num / 60) % 60; //Math.floor(num / 60) % 60     分
    var hour = Math.floor(num / 60 / 60) % 24; //时
    var day = Math.floor(num / 60 / 60 / 24); //天数
    // var mon = setDb()
    return (
        fill(day) +
        '天' +
        fill(hour) +
        '小时' +
        fill(min) +
        '分' +
        fill(sec) +
        '秒'
    );
}

export default {
    format,
    parseSecond,
    formatSecond,
    getFormatDuringTime,
    getFormatSe,
    getFormatDay,
};
