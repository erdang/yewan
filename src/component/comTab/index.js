import './index.scss';

import { createElement } from 'react';

const ComTab = ({ tabNode, current, timeLineFn, className }) => {
    let content = tabNode.map((i, d) => {
        return createElement(
            'div',
            {
                className:
                    'ls-tab-ul-li ' + (current === i.key ? 'active' : ''),
                key: d,
                'data-key': i.key,
                'data-index': d,
                onClick: timeLineFn,
            },

            createElement(
                'div',
                {
                    className: 'ls-tab-ul-li-title',
                },
                i.title,
            ),
            createElement(
                'div',
                {
                    className: 'ls-tab-ul-li-des',
                },
                i.des,
            ),
        );
    });
    return createElement(
        'div',
        { className: 'ls-tab ' + className },
        createElement(
            'div',
            {
                className: 'ls-tab-header',
            },
            createElement(
                'div',
                {
                    className: 'ls-tab-ul',
                },
                content,
            ),
        ),
    );
};
export default ComTab;
