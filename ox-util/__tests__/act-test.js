import createAct, {autoBind, bindActionCreator, getState} from '../src/act.js';

describe('autoBind', () => {
    it('auto bind methods from prototype object', () => {
        var instance = null;
        var proto = {
            a() {
                expect(this).toEqual(instance);
            }
        };

        instance = Object.create(proto);
        autoBind(instance, proto);
        instance.a.call(null);
    });
    it("don'st bind for instance methods", () => {
        var instance = null;
        var proto = {
            a() {
                expect(this).toEqual(instance);
            }
        };

        instance = Object.create(proto);
        instance.b = function () {
            expect(this).toEqual(null);
        };
        autoBind(instance, proto);
        instance.a.call(null);
        instance.b.call(null);
    });
});

describe('bindActionCreator', () => {
    it('bind actionCreator correctly', () => {
        var dispatch = jest.fn();
        var instance = {};
        var actionCreator = jest.fn(function (data) {
            return {
                type: 't',
                data
            };
        });

        var bindedAction = bindActionCreator(actionCreator, dispatch, instance);

        bindedAction('a');
        expect(dispatch.mock.calls.length).toBe(1);
        expect(actionCreator.mock.calls[0][0]).toBe('a');
        expect(dispatch.mock.calls[0][0]).toEqual(
            actionCreator.mock.results[0].value
        );
        expect(actionCreator.mock.results[0].value).toEqual({
            type: 't',
            data: 'a'
        });
    });
});

describe('getState', () => {
    it('works', () => {
        var instance = {
            namespace: 'a.b.c',
            getRootState: jest.fn(function () {
                return {
                    a: {
                        b: {
                            c: 1
                        }
                    }
                };
            })
        };
        expect(getState.call(instance)).toBe(1);
        instance.namespace = 'a.b';
        expect(getState.call(instance)).toEqual({
            c: 1
        });
        instance.namespace = 'a';
        expect(getState.call(instance)).toEqual({
            b: {
                c: 1
            }
        });
        expect(instance.getRootState.mock.calls.length).toBe(3);
    });
    it('throw error', () => {
        var instance = {
            getRootState: jest.fn(function () {
                return {
                    a: 1
                };
            })
        };
        expect(() => {
            getState.call(instance);
        }).toThrow();
    });
});

describe('createAct', () => {
    it('works', () => {
        var store = {
            dispatch: jest.fn(),
            getState: jest.fn(function () {
                return {
                    a: {
                        b: {
                            A: 1,
                            B: {
                                C: 2
                            }
                        }
                    }
                };
            })
        };
        var namespace = 'a.b';
        var act = createAct(store, namespace, {
            n: 1,

            actionCreator: {
                x() {
                    expect(this).toBe(act);
                    return {
                        type: 'a.b.x',
                        payload: this.n
                    };
                }
            },

            a() {
                expect(this).toBe(act);
            }
        });

        act.a.call(null);
        act.update({
            name: 'dexbol'
        });
        expect(store.dispatch.mock.calls.length).toBe(1);
        expect(store.dispatch.mock.calls[0][0]).toEqual({
            type: 'a.b.UPDATE',
            payload: {
                name: 'dexbol'
            }
        });
        act.x.call(null);
        expect(store.dispatch.mock.calls[1][0]).toEqual({
            type: 'a.b.x',
            payload: 1
        });
        expect(act.getState()).toEqual({
            A: 1,
            B: {
                C: 2
            }
        });
        act.reset.call(null);
        expect(store.dispatch.mock.calls[2][0]).toEqual({
            type: 'a.b.RESET'
        });
    });
});
