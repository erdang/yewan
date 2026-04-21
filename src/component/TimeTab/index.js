import './index.scss';

import { createElement } from 'react';

const TimeTab = ({ tabNode, status, timeLineFn }) => {
    let content = tabNode.map((i, d) => {
        let iconclass = '';
        if (i.key === status) {
            iconclass = 'ls-tab-ul-li-icon active';
        } else if (i.key <= status) {
            iconclass = 'ls-tab-ul-li-icon actived';
        } else {
            iconclass = 'ls-tab-ul-li-icon';
        }

        return createElement(
            'div',
            {
                className: 'ls-tab-ul-li',
                key: d,
                'data-key': i.key,
                'data-index': d,
                onClick: i.key <= status ? timeLineFn : () => {},
            },
            createElement(
                'div',
                {
                    className: 'ls-tab-ul-li-line-warp',
                },
                createElement('div', {
                    className: iconclass,
                }),
                d < tabNode.length - 1 &&
                    createElement('div', {
                        className:
                            'ls-tab-ul-li-line ' +
                            (i.key < status ? 'active' : ''),
                    }),
            ),

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
        { className: 'ls-tab' },
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
export default TimeTab;
