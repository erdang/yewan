import Koa from 'koa';
import templating from './templating';
var router = require('koa-router')();

const app = new Koa();

const staticKoa = require('koa-static');
app.use(staticKoa(__dirname + '/public'));

router.get('/(.*)', templating);
app.use(router.routes(), router.allowedMethods());

app.listen(9000, () => {
    console.log(`node服务已经启动, 请访问localhost:9000`);
});
