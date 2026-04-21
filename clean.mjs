import fs from 'fs';
import path from 'path';
// var fill = function (n) {
//     return n < 10 ? '0' + n : n + '';
// };
// function format(time, template = 'y-m-d') {
//     var dateObj = new Date(Number(time));
//     var year = dateObj.getFullYear();
//     var month = fill(dateObj.getMonth() + 1);
//     var date = fill(dateObj.getDate());
//     var hour = fill(dateObj.getHours());
//     var minute = fill(dateObj.getMinutes());
//     var second = fill(dateObj.getSeconds());

//     return template.replace(/y|m|d|h|i|s/g, function (s) {
//         switch (s) {
//             case 'y':
//                 return year;
//             case 'm':
//                 return month;
//             case 'd':
//                 return date;
//             case 'h':
//                 return hour;
//             case 'i':
//                 return minute;
//             case 's':
//                 return second;
//         }
//     });
// }

const filePath = path.resolve('../yucha_pre/dist');
const regex = /js|css|chunk$/i;

const fileDisplay = function (filePath) {
    fs.readdir(filePath, function (err, files) {
        if (err) {
            console.warn(err);
        } else {
            //遍历读取到的文件列表

            files.forEach(function (filename) {
                // console.log(filename);
                //获取当前文件的绝对路径
                var filedir = path.join(filePath, filename);

                //根据文件路径获取文件信息，返回一个fs.Stats对象

                fs.stat(filedir, function (eror, stats) {
                    if (eror) {
                        console.warn('获取文件stats失败');
                    } else {
                        var isFile = stats.isFile(); //是文件
                        var isDir = stats.isDirectory(); //是文件夹
                        var nowDate = Date.now();
                        let filenameStr = filename.split('.')[1];
                        if (isFile) {
                            let timeCreate = filenameStr.substring(8, 21);

                            if (
                                nowDate - timeCreate >
                                    60 * 60 * 24 * 30 * 1000 &&
                                regex.test(filename)
                            ) {
                                console.log(filePath + '/' + filename);
                                // fs.unlink(
                                //     filePath + '/' + filename,
                                //     function (err) {
                                //         if (err) {
                                //             return console.log(err);
                                //         }
                                //         console.log('删除成功');
                                //     },
                                // );
                            }
                        }
                        if (isDir && regex.test(filename)) {
                            fileDisplay(filedir); //递归，如果是文件夹，就继续遍历该文件夹下面的文件
                        }
                    }
                });
            });
        }
    });
};
fileDisplay(filePath);
