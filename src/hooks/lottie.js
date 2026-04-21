import React, { useRef, useEffect, useState, useCallback } from 'react';

let lottie = null;
let lock = false;

/**
 * lottie动画hooks简易封装
 * @param animPath 动画数据data.json的路径
 * @param config 额外配置
 */
function useLottie(animPath, config) {
    const lottieRef = useRef(null);
    const [loaded, setLoaded] = useState(false);
    // 渲染出来的svg动画DOM实例

    const animInstance = useRef(null);
    const { className, ...animParams } = config || {};

    const loadLottie = useCallback(async () => {
        if (!lottie && !lock) {
            lock = true;
            try {
                // lottie-web体积较大，单独分包加载
                lottie = await import(
                    /* webpackChunkName: "lottie_web" */
                    'lottie-web'
                );
                setLoaded(true);
            } catch (err) {
                lock = false;
                console.error(err);
            }
        }
    }, []);

    loadLottie();

    useEffect(() => {
        // loaded表示lottie-web库加载完毕，lottie表示已有该实例

        if (loaded || lottie) {
            const inst = lottie.loadAnimation({
                container: lottieRef.current,
                renderer: 'svg',
                // 动画json数据
                path: animPath,
                ...animParams,
            });
            animInstance.current = inst;
        }
    }, [loaded, animPath, animParams]);

    /**
     * 动画DOM渲染函数
     */
    const RenderAnimWrap = () => <div ref={lottieRef} className={className} />;
    return { RenderAnimWrap, animInstance };
}

export default useLottie;
