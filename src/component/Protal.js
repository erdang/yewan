import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

const PORTAL = document.getElementById('reactportal');

const Portal = (props) => {
    const [target, setTarget] = useState(null);
    useEffect(() => {
        setTarget(PORTAL);
    }, []);

    return target ? ReactDOM.createPortal(props.children, target) : null;
};

export default Portal;
