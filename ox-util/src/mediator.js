import EventEmitter from 'events';
import {extend} from './oop.js';

var Mediator = function () {
    Mediator.superclass.constructor.call(this);
};

extend(Mediator, EventEmitter, {
    subscribe(channel, fn) {
        this.on(channel, fn);
    },

    unsubscribe(channel, fn) {
        if (fn) {
            this.removeListener(channel, fn);
        } else {
            this.removeAllListeners(channel);
        }
    },

    publish(channel) {
        this.emit.apply(this, [].slice.call(arguments, 0));
    }
});

export default new Mediator();
