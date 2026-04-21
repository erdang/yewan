import {
    getFormatDuringTime,
    getFormatSe,
    getFormatDay,
} from 'ox-util/src/time';
import { Timer } from 'ox-util/src/timer';

import { createElement, useEffect, useRef, useCallback, useState } from 'react';

const Countdown = ({
    count,
    startTime = 0,
    formatTime = true,
    formatHour = false,
    formatDay = false,
    comp,
    onEnd,
    onKick,
}) => {
    const [counter, setCounter] = useState(0);
    const timer = useRef(null);
    const startTimeV = useRef(null);

    const kick = useCallback(() => {
        let countv = Math.max(
            0,
            count - Math.round((Date.now() - startTimeV.current) / 1000),
        );

        if (onKick) {
            onKick(countv);
        }
        setCounter(countv);

        if (countv > 0) {
            timer.current.set(kick, 1000);
        } else if (onEnd) {
            onEnd();
        }
    }, [onEnd, onKick, startTimeV, count]);

    useEffect(() => {
        timer.current = new Timer();
        startTimeV.current = startTime || Date.now();
        kick();
        return () => {
            if (timer.current) {
                timer.current.clear();
            }
        };
    }, [kick, startTime]);
    let result = '';
    if (comp) {
        result = createElement(comp, { count: counter });
    } else if (formatTime) {
        result = getFormatDuringTime(counter);
    } else if (formatHour) {
        result = getFormatSe(counter);
    } else if (formatDay) {
        result = getFormatDay(counter);
    }

    return result;
};

export default Countdown;
