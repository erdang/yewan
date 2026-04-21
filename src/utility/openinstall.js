import { mix } from 'ox-util/src/oop';
// import urlTool from 'ox-util/src/url';
import loadScript from 'ox-util/src/loadscript';

const SDK = '//res.cdn.openinstall.io/openinstall.js';
const KEY_6 = 'c4vfnm';

function loadSdk() {
    return new Promise((resolve) => {
        if (typeof OpenInstall == 'function') {
            resolve();
        } else {
            loadScript(SDK).then(() => resolve());
        }
    });
}
// urlTool.param(location.search)
function getInstance(channelCode, extraParam) {
    return new Promise((resolve) => {
        new self.OpenInstall(
            {
                appKey: KEY_6,
                channelCode,

                onready() {
                    resolve(this);
                },
            },
            mix(extraParam || {}),
        );
    });
}

export default function openInstall({ channelCode, extraParam } = {}) {
    return loadSdk().then(() => getInstance(channelCode, extraParam));
}
