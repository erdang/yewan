import { useEffect } from 'react';

const useReqAniFrame = (reqAniFrame, aniFn) => {
    useEffect(() => {
        if (window.requestAnimationFrame) {
            reqAniFrame.current = window.requestAnimationFrame(aniFn);
        } else {
            reqAniFrame.current = setInterval(aniFn, 16.67);
        }
        return () => {
            if (reqAniFrame.current) {
                window.cancelAnimationFrame(reqAniFrame.current);
            } else {
                clearInterval(reqAniFrame.current);
            }
        };
    }, [reqAniFrame, aniFn]);
};
const CancleReqAniFrame = (reqAniFrame, aniFn) => {
    if (reqAniFrame.current) {
        window.cancelAnimationFrame(reqAniFrame.current);
    } else {
        clearInterval(reqAniFrame.current);
    }
};
export { CancleReqAniFrame, useReqAniFrame };
