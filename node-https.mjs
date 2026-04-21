import https from 'https';
import os from 'os';
import path from 'path';
import fs from 'fs';
import url from 'url';

const getPath = (url2) => {
    // console.log(process.cwd());
    const __filename = url.fileURLToPath(url2);
    const __dirname = path.dirname(__filename);
    return {
        __filename,
        __dirname,
    };
};
const { __dirname } = getPath(import.meta.url);

// 根据项目的路径导入生成的证书文件
const privateKey = fs.readFileSync(
    path.join(__dirname, './ssl/yiayuyin.key'),
    'utf8',
);
const certificate = fs.readFileSync(
    path.join(__dirname, './ssl/yiayuyin.crt'),
    'utf8',
);
const credentials = {
    key: privateKey,
    cert: certificate,
};

const localIP = (function () {
    var ni = os.networkInterfaces();

    for (var p in ni) {
        var device = ni[p];

        for (var i = 0; i < device.length; i++) {
            if (
                device[i].address.indexOf('10.40') === 0 ||
                device[i].address.indexOf('192.168') === 0
            ) {
                return device[i].address;
            }
        }
    }
})();
console.log(localIP);
const op = {
    host: localIP,
    port: 4000,
    method: 'GET',
};
const PORT = 443;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const server = https.createServer(credentials, (req, res) => {
    //console.log(req);
    // delete req.headers.host;
    var requst = https.request(op, function (s) {
        console.log('STATUS: ' + s.statusCode);
        console.log('HEADERS: ' + JSON.stringify(s.headers));
        s.on('data', function (chunk) {
            console.log(chunk);
            res.setHeader('Content-Type', 'text/html;charset=utf-8');
            res.end(chunk);
        });
    });
    requst.end();
});
server.on('error', function (e) {
    console.log('problem with request: ' + e.message);
});

server.listen(PORT, () => {
    console.log('监听：443端口');
});
