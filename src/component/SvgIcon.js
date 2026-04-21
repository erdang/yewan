import React from 'react';

// console.log(import.meta.env);
if (import.meta.env) {
    // import('virtual:svg-icons-register');
} else {
    let importAll = (requireContext) => {
        requireContext.keys().forEach(requireContext);
    };
    try {
        importAll(require.context('../assets/icon/', true, /\.svg$/));
    } catch (error) {
        console.log(error);
    }
}

const SvgIcon = (props) => {
    const {
        iconClass,
        className,
        width = 100,
        height = 100,
        color = '#000',
        style = {},
        onClick,
    } = props;

    const Style = {
        ...style,
        width: `${width}%`,
        height: `${height}%`,
        color,
    };

    return (
        <svg
            onClick={onClick}
            style={Style}
            className={`svg-icon ${className}`}
            aria-hidden="true"
        >
            <use xlinkHref={'#icon-' + iconClass} fill={color} />
        </svg>
    );
};

export default SvgIcon;
