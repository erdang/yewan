import EventEmitter from 'events';
import {extend} from './oop.js';
import browser from './browser.js';
import urltool from './url.js';

var Histo = function (disabledSpa) {
    Histo.superclass.constructor.call(this);

    this.spa = !disabledSpa && this._supportPushState();
    this._current = this.getPath();
    this._popstateHandler = this._popstateHandler.bind(this);

    this._getGlobalScope().addEventListener(
        'popstate',
        this._popstateHandler,
        false
    );
};

extend(Histo, EventEmitter, {
    getPath() {
        var loc = this._getLocation();

        return loc.pathname + loc.search;
    },

    push(url, stateObject) {
        this._changeState(url, stateObject);
    },

    replace(url, stateObject) {
        this._changeState(url, stateObject, true);
    },

    destroy() {
        this._getGlobalScope().removeEventListener(
            'popstate',
            this._popstateHandler,
            false
        );
    },

    _getGlobalScope() {
        return window;
    },

    _getLocation() {
        return window.location;
    },

    _getHistory() {
        return window.history;
    },

    _supportPushState() {
        var poorSupport =
            (browser.ios && (browser.getiOSVersion() < 5 || browser.chrome)) ||
            (browser.android &&
                !browser.chrome &&
                browser.getandroidVersion() < 4.2);
        return 'pushState' in this._getHistory() && !poorSupport;
    },

    _getPathBaseOnCurrent(urlObj, currentUrlObj) {
        var result = '';

        if (!urlObj.host) {
            result =
                (urlObj.pathname || currentUrlObj.pathname) + urlObj.search;
        }

        return result;
    },

    _popstateHandler(event) {
        var oldPath = this._current;
        var oldPathObj = urltool.parse(oldPath);
        var path = this.getPath();
        var pathObj = urltool.parse(path);

        this._current = path;
        this.emit('change', path);
        if (oldPathObj.pathname == pathObj.pathname) {
            this.emit('change-query', path);
        }
    },

    _changeState(url, stateObject, replace) {
        var loc = this._getLocation();
        var current = this._current;
        var currentObj = urltool.parse(current);
        var urlObj = urltool.parse(url);
        var pathnameWithSearch = this._getPathBaseOnCurrent(urlObj, currentObj);
        var pathnameWithSearchObj = urltool.parse(pathnameWithSearch);

        if (pathnameWithSearch && current != pathnameWithSearch && this.spa) {
            this.emit(replace ? 'replace' : 'push', url);
            this._getHistory()[replace ? 'replaceState' : 'pushState'](
                stateObject || null,
                null,
                pathnameWithSearch
            );
            this._current = pathnameWithSearch;
            this.emit('change', pathnameWithSearch);
            if (currentObj.pathname == pathnameWithSearchObj.pathname) {
                this.emit('change-query', pathnameWithSearch);
            }
        } else {
            loc[replace ? 'replace' : 'assign'](url);
        }
    }
});

export {Histo};
export default new Histo();
