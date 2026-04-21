import http from 'http';
import os from 'os';
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
const PORT = 80;
const server = http.createServer((req, res) => {
    //console.log(req);
    // delete req.headers.host;
    var requst = http.request(op, function (s) {
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
    console.log('监听：80端口');
});
