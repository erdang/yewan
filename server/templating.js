import fs from 'fs';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { useRoutes, matchRoutes } from 'react-router-dom';
import RouterConfig from '../src/routes/index';
import React from 'react';
import path from 'path';
import { Provider } from 'react-redux';
import { severStore } from '../src/store/index';
import StyleContext from 'isomorphic-style-loader/StyleContext';

// 匹配模板中的{{}}
function templating(props) {
    const template = fs.readFileSync(
        path.join(__dirname, './template/server.html'),

        'utf-8',
    );
    return template.replace(/{{([\s\S]*?)}}/g, (_, key) => props[key.trim()]);
}
const Add = () => {
    let routes = useRoutes(RouterConfig);
    return routes;
};

const paserFn = function (ctx, next) {
    console.log(ctx.req.url);
    const store = severStore(ctx);

    const matchedRoutes = matchRoutes(RouterConfig, ctx.req.url);

    const promises = [];

    matchedRoutes.forEach((item) => {
        if (item.route.loadData) {
            const promise = new Promise((resolve, reject) => {
                item.route.loadData(store).then(resolve).catch(resolve);
                console.log(store.getState());
            });
            promises.push(promise);
        }
    });

    try {
        // const context = { css: [] };
        // const cssStr = context.css.length ? context.css.join('\n') : '';
        const css = new Set();
        const insertCss = (...styles) =>
            styles.forEach((style) => css.add(style._getCss()));
        // console.log(insertCss());
        const html = ReactDOMServer.renderToString(
            <StyleContext.Provider value={{ insertCss }}>
                <Provider store={store}>
                    <StaticRouter location={ctx.url}>
                        <Add />
                    </StaticRouter>
                </Provider>
            </StyleContext.Provider>,
        );

        const body = templating({
            html,
            store: JSON.stringify(store.getState()),
            // cssStr,
        });
        ctx.body = body;
    } catch (err) {
        ctx.body = templating({ html: err.message });
    }
    ctx.type = 'text/html';
};

export default paserFn;
