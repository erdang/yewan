import { useEffect, useCallback, useState } from 'react';
import instance from '@/request/index';

const useGetCoin = (ticket) => {
    const [info, setInfo] = useState('');
    const getAllBalance = useCallback(() => {
        instance
            .post('/api/user/getAllBalance', {
                encpass: ticket,
            })
            .then((e) => {
                if (e.flag === '001') {
                    setInfo(e.content);
                }
            });
    }, [ticket]);
    useEffect(() => {
        getAllBalance();
    }, [getAllBalance]);

    return info;
};

export default useGetCoin;
