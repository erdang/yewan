import { useEffect, useCallback, useState } from 'react';
import instance from '@/request/index';

const useGetUserInfo = (ticket) => {
    const [info, setInfo] = useState('');
    const getUserInfo = useCallback(() => {
        instance
            .post('/api/v1/user/getUserInfo', {
                token: ticket,
            })
            .then((e) => {
                if (e.code === '200') {
                    setInfo(e.content);
                }
            });
    }, [ticket]);
    useEffect(() => {
        getUserInfo();
    }, [getUserInfo]);

    return info;
};

export default useGetUserInfo;
