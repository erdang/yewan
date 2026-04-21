import instance from './index';
//余额
const getCoin = (ticket) => {
    return instance.post('/api/user/getAllBalance', {
        encpass: ticket,
    });
};

export { getCoin };
