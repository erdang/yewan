import React, { useRef, useEffect, useState, useCallback } from 'react';

/**
 * lottie动画hooks简易封装
 * @param animPath 动画数据data.json的路径
 * @param config 额外配置
 */

const Lottie = (props) => {
    let {
        animPath,
        className,
        autoplay,
        loop,
        lottieAntice,
        onComplete,
        onReady,
    } = props;
    let lottie = useRef(null);

    let lock = useRef(false);

    const lottieRef = useRef(null);
    const [loaded, setLoaded] = useState(false);

    const loadLottie = useCallback(async () => {
        if (!lottie.current && !lock.current) {
            lock.current = true;
            try {
                // lottie-web体积较大，单独分包加载
                lottie.current = await import(
                    /* webpackChunkName: "lottie_web" */
                    'lottie-web'
                );
                setLoaded(true);
            } catch (err) {
                lock.current = false;
                console.error(err);
            }
        }
    }, []);

    loadLottie();
    useEffect(() => {
        // loaded表示lottie-web库加载完毕，lottie表示已有该实例

        if (loaded || lottie.current) {
            lottieAntice.current = lottie.current.loadAnimation({
                container: lottieRef.current,
                renderer: 'canvas',
                // 动画json数据
                path: animPath,
                autoplay: false,
                loop: loop,
            });
            if (onComplete) {
                lottieAntice.current &&
                    lottieAntice.current.addEventListener(
                        'complete',
                        onComplete,
                    );
            }
            if (onReady) {
                lottieAntice.current &&
                    lottieAntice.current.addEventListener(
                        'data_ready',
                        onReady,
                    );
            }

            if (autoplay) {
                lottieAntice.current.play();
            }
        }
        return () => {
            lottie.current && lottie.current.destroy();
        };
    }, [loaded, animPath, autoplay, loop, lottieAntice, onComplete, onReady]);

    return <div ref={lottieRef} className={className} />;
};

export default Lottie;
