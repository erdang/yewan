var Action = function (store, ns) {
    this.dispatch = store.dispatch;
    this.getRootState = store.getState;
    this.ns = ns || undefined;

    var actions = this.actionCreator;

    if (this.ns) {
        actions.init = actions.init || this._initActionCreator;
        actions.update = actions.update || this._updateActionCreator;
    }

    Object.keys(actions).forEach((key) => {
        if (process.env.NODE_ENV !== 'production') {
            if (key in this) {
                console.error(
                    'The actionCreator was <' + key + '> alreay binded.'
                );
            }
        }
        this[key] = this._bindActionCreator(key);
    });
};

Action.prototype = {
    actionCreator: {},

    getState() {
        var state = this.getRootState();
        var ns = this.ns;

        if (ns) {
            ns.split('.').forEach((n) => {
                state = state[n];
            });
        }
        return state;
    },

    _bindActionCreator(actionCreatorName) {
        return function () {
            this.dispatch(
                this.actionCreator[actionCreatorName].apply(
                    this,
                    [].slice.call(arguments, 0)
                )
            );
        }.bind(this);
    },

    _initActionCreator() {
        return {
            type: (this.ns ? this.ns + '.' : '') + 'INIT'
        };
    },

    _updateActionCreator(data) {
        return {
            type: (this.ns ? this.ns + '.' : '') + 'UPDATE',
            payload: data
        };
    },

    _bindSelf() {
        var args = [].slice.call(arguments, 0);
        var i = 0;

        for (; i < args.length; i++) {
            if (typeof this[args[i]] == 'function') {
                this[args[i]] = this[args[i]].bind(this);
            }
        }
    }
};

export default Action;
