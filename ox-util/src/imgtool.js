export default {
    url(srcurl, subfix) {
        var reg = /^([^_]+)(_[a-zA-Z])?(\.\w+)$/i;

        return srcurl.replace(reg, '$1' + (subfix || '') + '$3');
    },

    justifySize(width, height, limitWidth, limitHeight) {
        var maxWidth = limitWidth[1];
        var maxHeight = limitHeight[1];
        var minWidth = limitWidth[0];
        var minHeight = limitHeight[0];
        var ratio = maxWidth / maxHeight;
        var w;
        var h;

        if (width <= maxWidth && height <= maxHeight) {
            w = minWidth || width;
            h = minHeight || height;
        } else if (width / height >= ratio) {
            w = Math.min(width, maxWidth);
            h = (w * height) / width;
        } else {
            h = Math.min(height, maxHeight);
            w = (h * width) / height;
        }
        return [w, h];
    }
};
