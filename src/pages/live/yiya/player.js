import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.min.css';
// import VConsole from 'vconsole';
// /*eslint-disable*/
// const vConsole = new VConsole();

const VideoPlayer = ({ url, options = {}, onReady, type }) => {
    const videoRef = useRef(null);
    const playerRef = useRef(null);

    useEffect(() => {
        if (!playerRef.current) {
            const videoElement = videoRef.current;

            if (!videoElement) return;

            const player = (playerRef.current = videojs(
                videoElement,
                {
                    autoplay: true,
                    bigPlayButton: true,
                    errorDisplay: false,
                    controls: true,
                    language: 'zh-CN',
                    preload: 'auto',
                    ...(options || {}),
                },
                () => {
                    videojs.log('player is ready');
                    player.src(url);
                    // player.play();
                    onReady?.(player);
                },
            ));
        } else {
            const player = playerRef.current;
            // player.autoplay(true);
            player.src(url);
            videojs.log('player');
        }
    }, [onReady, options, url, videoRef]);

    useEffect(() => {
        const player = playerRef.current;

        return () => {
            if (player) {
                player.dispose();
                playerRef.current = null;
            }
        };
    }, [playerRef]);

    return (
        <div data-vjs-player>
            <video
                style={{ width: '100%', height: 230 }}
                ref={videoRef}
                autoPlay
                controls
                controlsList="nodownload"
                x5-video-player-type="h5-page"
                webkit-playsinline="true"
                playsInline
                className="video-js vjs-default-skin  vjs-big-play-centered"
            ></video>
        </div>
    );
};

export default VideoPlayer;
