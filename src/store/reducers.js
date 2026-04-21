import home from './home/reducer';
import list from './list/reducer';
import apply from './apply/reducer';
import user from './user/reducer';
import gift from './gift/reducer';

import { combineReducers } from 'redux';

// 其实就是把分散的reducers给合并了

const Reducers = combineReducers({
    home,
    list,
    apply,
    user,
    gift,
});
export default Reducers;
