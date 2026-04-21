import { useEffect, useCallback, useState } from 'react';
import instance from '@/request/index';

const useGetAppVer = (ticket) => {
    const [info, setInfo] = useState('');
    const getUserInfo = useCallback(() => {
        instance
            .post('/app/ver', {
                encpass: ticket,
            })
            .then((e) => {
                if (e.flag === '001') {
                    setInfo(e.content);
                }
            });
    }, [ticket]);
    useEffect(() => {
        getUserInfo();
    }, [getUserInfo]);

    return info;
};

export default useGetAppVer;
