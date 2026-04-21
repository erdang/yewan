import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import reducers from './reducers';
import clinetHttp from '../request/index';
import severHttp from '../../server/request';

const severStore = (req) =>
    createStore(
        reducers,
        applyMiddleware(thunk.withExtraArgument(severHttp(req)), logger),
    );

const store = (data) =>
    createStore(
        reducers,
        data,
        applyMiddleware(thunk.withExtraArgument(clinetHttp), logger),
    );

export { severStore };
export default store;
