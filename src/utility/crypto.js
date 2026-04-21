import pako from 'pako';
import Base64 from 'ox-util/src/base_atob';
import randomString from '@/utility/getRandomString';
import CryptoJS from 'crypto-js';

let randomStr = randomString(16);
const iv = CryptoJS.enc.Utf8.parse(randomStr);
const key = CryptoJS.enc.Utf8.parse('avDCsZD7njkzq4lG');

const base64Encode = function (binaryString) {
    return binaryString.replace(/\+|\/|=/g, function (c) {
        switch (c) {
            case '+':
                return '(';
            case '/':
                return ')';
            case '=':
                return '@';
            default:
        }
    });
};
const base64Decode = function (str) {
    return str.replace(/\(|\)|@/g, function (c) {
        switch (c) {
            case '(':
                return '+';
            case ')':
                return '/';
            case '@':
                return '=';
            default:
        }
    });
};

const decode = function (str) {
    //var binaryString = window.atob(base64Decode(str));
    console.log('sssss----' + str);
    var binaryString = Base64.atob(base64Decode(str));
    var uint8Array = new Uint8Array(binaryString.length);
    var inflatedBuffer;

    for (var i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
    }
    inflatedBuffer = pako.inflate(uint8Array, {
        level: 6,
        raw: true,
    });

    return new TextDecoder().decode(inflatedBuffer);
};

const encode = function (str) {
    var utf8UnitArray = new TextEncoder().encode(str);
    var binaryString = String.fromCharCode.apply(
        null,
        pako.deflate(utf8UnitArray, {
            level: 6,
            raw: true,
        }),
    );

    return base64Encode(window.btoa(binaryString));
};

// const wordArrayToUint8 = function (array, length = array.length * 4) {
//     var bin = new Uint8Array(Math.min(array.length * 4, length));
//     for (var i = 0; i < array.length; i++) {
//         var num = array[i];
//         if (num < 0) {
//             num = array[i] + 0x100000000;
//         }
//         bin[i * 4 + 0] = (num >>> 24) & 0xff;
//         bin[i * 4 + 1] = (num >>> 16) & 0xff;
//         bin[i * 4 + 2] = (num >>> 8) & 0xff;
//         bin[i * 4 + 3] = (num >>> 0) & 0xff;
//     }
//     return bin;
// };

const encrypt = (str) => {
    const srcs = CryptoJS.enc.Utf8.parse(str);
    const encrypted = CryptoJS.AES.encrypt(srcs, key, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });

    return base64Encode(encrypted.toString());
};

// decrypt decodes base64-encoded ciphertext into a utf8-encoded string
const decrpt = (str, piv) => {
    let ivc = CryptoJS.enc.Hex.parse(piv);
    // GZIP 数据 AES 解密
    var decrypt = CryptoJS.AES.decrypt(base64Decode(str), key, {
        iv: ivc,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    console.log(base64Decode(str));
    return decrypt.toString(CryptoJS.enc.Utf8);
};

export {
    encrypt,
    decrpt,
    randomStr,
    key,
    base64Decode,
    base64Encode,
    decode,
    encode,
};
