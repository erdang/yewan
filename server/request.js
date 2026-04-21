import axios from 'axios';

const createInstance = (ctx) => {
    return axios.create({
        baseURL: '',
        headers: {
            cookie: ctx.cookies.get('cookie') || '',
        },
        params: {},
    });
};

export default createInstance;
