var reg = /(\d+)(\d{3})/;

export default function addcommma(num) {
    num += '';
    while (reg.test(num)) {
        num = num.replace(reg, '$1,$2');
    }
    return num;
}
