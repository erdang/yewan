const DEFAULT_KEY = 'timer';

class Timer {
    constructor() {
        this._timerHolder = {};
    }

    get(key = DEFAULT_KEY) {
        return this._timerHolder[key];
    }

    set(key, func, time) {
        if (arguments.length == 2) {
            time = func;
            func = key;
            key = DEFAULT_KEY;
        }
        if (this.get(key)) {
            this.clear(key);
        }
        return (this._timerHolder[key] = setTimeout(func, time));
    }

    clear(key = DEFAULT_KEY) {
        clearTimeout(this.get(key));
        delete this._timerHolder[key];
    }

    clearAll() {
        var keys = Object.keys(this._timerHolder);

        for (var i = 0; i < keys.length; i++) {
            this.clear(keys[i]);
        }
    }
}

export {Timer};
export default new Timer();
