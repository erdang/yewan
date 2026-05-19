import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { Parser as SVGAParser, Player as SVGAPlayer } from 'svga';

const PAG_CDN_URL = 'https://unpkg.com/libpag@latest/libpag.min.js';

let pagScriptPromise = null;

const syncCanvasSize = (canvas, maxCanvasPixels) => {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height));
    const dpr = window.devicePixelRatio || 1;
    let nextWidth = Math.floor(width * dpr);
    let nextHeight = Math.floor(height * dpr);
    const maxPixels = Number(maxCanvasPixels) || 0;
    if (maxPixels > 0 && nextWidth * nextHeight > maxPixels) {
        const ratio = Math.sqrt(maxPixels / (nextWidth * nextHeight));
        nextWidth = Math.max(1, Math.floor(nextWidth * ratio));
        nextHeight = Math.max(1, Math.floor(nextHeight * ratio));
    }
    if (canvas.width !== nextWidth) {
        canvas.width = nextWidth;
    }
    if (canvas.height !== nextHeight) {
        canvas.height = nextHeight;
    }
};

const detectType = (src = '', type = '') => {
    if (type) {
        return String(type).toLowerCase();
    }
    const clean = String(src).split('?')[0].toLowerCase();
    if (clean.endsWith('.mp4')) return 'mp4';
    if (clean.endsWith('.svga')) return 'svga';
    if (clean.endsWith('.pag')) return 'pag';
    return 'unknown';
};

const loadLibpag = (cdnUrl) => {
    if (window.libpag) {
        return Promise.resolve(window.libpag);
    }
    if (pagScriptPromise) {
        return pagScriptPromise;
    }
    pagScriptPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = cdnUrl;
        script.async = true;
        script.onload = () => {
            if (window.libpag) {
                resolve(window.libpag);
            } else {
                reject(new Error('libpag load failed'));
            }
        };
        script.onerror = () => {
            reject(new Error('libpag script error'));
        };
        document.head.appendChild(script);
    });
    return pagScriptPromise;
};

const AnimationPlayer = ({
    src = '',
    type = '',
    fallbackSrc = '',
    className = '',
    style = {},
    autoPlay = true,
    loop = true,
    muted = true,
    controls = false,
    poster = '',
    pagCdnUrl = PAG_CDN_URL,
    maxCanvasPixels = 0,
    svgaLoadTimeoutMs = 7000,
    onError,
    onReady,
    onEnd,
}) => {
    const baseType = useMemo(() => detectType(src, type), [src, type]);
    const [renderType, setRenderType] = useState(baseType);
    const canvasRef = useRef(null);
    const videoRef = useRef(null);
    const svgaPlayerRef = useRef(null);
    const svgaParserRef = useRef(null);
    const pagViewRef = useRef(null);
    const onReadyRef = useRef(onReady);
    const onErrorRef = useRef(onError);
    const onEndRef = useRef(onEnd);
    const fallbackSrcRef = useRef(fallbackSrc);
    const renderTypeRef = useRef(baseType);

    useEffect(() => {
        setRenderType(baseType);
    }, [baseType]);
    useEffect(() => {
        renderTypeRef.current = renderType;
    }, [renderType]);

    useEffect(() => {
        onReadyRef.current = onReady;
    }, [onReady]);

    useEffect(() => {
        onErrorRef.current = onError;
    }, [onError]);

    useEffect(() => {
        onEndRef.current = onEnd;
    }, [onEnd]);

    useEffect(() => {
        fallbackSrcRef.current = fallbackSrc;
    }, [fallbackSrc]);

    const toFallback = useCallback((error) => {
        if (fallbackSrcRef.current && renderTypeRef.current !== 'mp4') {
            setRenderType('mp4');
            return;
        }
        if (typeof onErrorRef.current === 'function') {
            onErrorRef.current(error);
        }
    }, []);

    const mp4Src = useMemo(() => {
        if (renderType === 'mp4') {
            if (baseType === 'mp4') return src;
            return fallbackSrc || '';
        }
        return '';
    }, [renderType, baseType, src, fallbackSrc]);

    useEffect(() => {
        if (renderType !== 'svga') return undefined;
        if (!src || !canvasRef.current) return undefined;

        let canceled = false;
        let settled = false;
        let timeoutId = null;
        syncCanvasSize(canvasRef.current, maxCanvasPixels);
        const player = new SVGAPlayer(canvasRef.current);
        const parser = new SVGAParser();
        svgaPlayerRef.current = player;
        svgaParserRef.current = parser;
        player.setConfig({
            loop: loop ? 0 : 1,
        });
        player.onEnd = () => {
            if (canceled) return;
            if (typeof onEndRef.current === 'function') {
                onEndRef.current({ type: 'svga' });
            }
        };

        if (svgaLoadTimeoutMs > 0) {
            timeoutId = setTimeout(() => {
                if (canceled || settled) return;
                settled = true;
                toFallback(new Error('svga load timeout'));
            }, svgaLoadTimeoutMs);
        }

        parser
            .load(src)
            .then(async (videoItem) => {
                if (canceled || settled) return;
                try {
                    await player.mount(videoItem);
                    if (autoPlay) {
                        player.start();
                    }
                    if (typeof onReadyRef.current === 'function') {
                        onReadyRef.current({ type: 'svga' });
                    }
                    settled = true;
                    if (timeoutId) {
                        clearTimeout(timeoutId);
                    }
                } catch (err) {
                    if (canceled || settled) return;
                    settled = true;
                    if (timeoutId) {
                        clearTimeout(timeoutId);
                    }
                    toFallback(err);
                }
            })
            .catch((err) => {
                if (canceled || settled) return;
                settled = true;
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                toFallback(err);
            });

        return () => {
            canceled = true;
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            try {
                if (svgaPlayerRef.current) {
                    svgaPlayerRef.current.stop();
                    svgaPlayerRef.current.clear();
                    svgaPlayerRef.current.destroy();
                }
            } catch (e) {
                // ignore stop/clear errors
            }
            try {
                if (svgaParserRef.current && svgaParserRef.current.destroy) {
                    svgaParserRef.current.destroy();
                }
            } catch (e) {
                // ignore parser destroy errors
            }
            svgaPlayerRef.current = null;
            svgaParserRef.current = null;
        };
    }, [
        autoPlay,
        loop,
        maxCanvasPixels,
        renderType,
        src,
        svgaLoadTimeoutMs,
        toFallback,
    ]);

    useEffect(() => {
        if (renderType !== 'pag') return undefined;
        if (!src || !canvasRef.current) return undefined;

        let canceled = false;
        syncCanvasSize(canvasRef.current, maxCanvasPixels);

        (async () => {
            try {
                const libpag = await loadLibpag(pagCdnUrl);
                if (canceled) return;
                const PAG = await libpag.PAGInit();
                if (canceled) return;
                const pagFile = await PAG.PAGFile.load(src);
                if (!pagFile || canceled) {
                    throw new Error('pag file load failed');
                }
                const pagView = await PAG.PAGView.init(
                    pagFile,
                    canvasRef.current,
                );
                pagViewRef.current = pagView;
                pagView.setRepeatCount(loop ? 0 : 1);
                if (autoPlay) {
                    pagView.play();
                }
                if (typeof onReadyRef.current === 'function') {
                    onReadyRef.current({ type: 'pag' });
                }
            } catch (err) {
                if (!canceled) {
                    toFallback(err);
                }
            }
        })();

        return () => {
            canceled = true;
            if (pagViewRef.current) {
                try {
                    pagViewRef.current.stop();
                } catch (e) {
                    // ignore stop errors
                }
                try {
                    pagViewRef.current.destroy();
                } catch (e) {
                    // ignore destroy errors
                }
            }
            pagViewRef.current = null;
        };
    }, [
        autoPlay,
        loop,
        maxCanvasPixels,
        pagCdnUrl,
        renderType,
        src,
        toFallback,
    ]);

    useEffect(() => {
        if (
            renderType === 'mp4' &&
            typeof onReadyRef.current === 'function' &&
            mp4Src
        ) {
            onReadyRef.current({ type: 'mp4' });
        }
    }, [renderType, mp4Src]);

    if (renderType === 'mp4') {
        return (
            <video
                ref={videoRef}
                className={className}
                style={style}
                src={mp4Src}
                poster={poster}
                autoPlay={autoPlay}
                loop={loop}
                muted={muted}
                controls={controls}
                playsInline
                webkit-playsinline="true"
                x5-video-player-type="h5-page"
                onError={(err) => {
                    if (typeof onErrorRef.current === 'function') {
                        onErrorRef.current(err);
                    }
                }}
                onEnded={() => {
                    if (typeof onEndRef.current === 'function') {
                        onEndRef.current({ type: 'mp4' });
                    }
                }}
            />
        );
    }

    if (renderType === 'pag') {
        return (
            <canvas
                ref={canvasRef}
                className={className}
                style={style}
                width={style?.width || undefined}
                height={style?.height || undefined}
            />
        );
    }

    if (renderType === 'svga') {
        return (
            <canvas
                ref={canvasRef}
                className={className}
                style={style}
                width={style?.width || undefined}
                height={style?.height || undefined}
            />
        );
    }

    return fallbackSrc ? (
        <video
            className={className}
            style={style}
            src={fallbackSrc}
            poster={poster}
            autoPlay={autoPlay}
            loop={loop}
            muted={muted}
            controls={controls}
            playsInline
            webkit-playsinline="true"
            x5-video-player-type="h5-page"
            onError={(err) => {
                if (typeof onErrorRef.current === 'function') {
                    onErrorRef.current(err);
                }
            }}
            onEnded={() => {
                if (typeof onEndRef.current === 'function') {
                    onEndRef.current({ type: 'mp4' });
                }
            }}
        />
    ) : null;
};

export default AnimationPlayer;
