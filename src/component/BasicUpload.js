import React, { useCallback, useEffect, useState } from 'react';
import { ImageUploader, Toast } from 'antd-mobile';

import { instancePic } from '@/request';
import { appGate } from '@/utility/appGate';

const BasicUpload = ({
    value = {},
    onChange,
    first,
    face,
    isBind,
    setIsBind,
    imgUrlFont,
    multiple,
    maxCount,
    childNe,
}) => {
    const [fileList, setFileList] = useState(() => {
        return imgUrlFont
            ? [
                  {
                      url: imgUrlFont,
                      url2: imgUrlFont,
                  },
              ]
            : [];
    });
    // const [fileNone, setFileNone] = useState(false);

    const triggerChange = useCallback(
        (changedValue) => {
            onChange?.({
                fileList,
                ...value,
                ...changedValue,
            });
        },
        [fileList, onChange, value],
    );

    useEffect(() => {}, []);

    const mpFn = useCallback(
        (e) => {
            console.log(e);
            setFileList(e);

            if (e.length > 0) {
                triggerChange({
                    fileList: [...e],
                });
            } else if (e.length === 0 && first === false) {
                triggerChange({
                    fileList: [...e],
                });
            }
        },
        [triggerChange, first],
    );

    const mockUpload = useCallback(async (file) => {
        var params = new FormData();
        params.append('file', file);
        params.append('tid', '101');
        params.append('priv', '0');
        const respone = await instancePic.post('/api/v1/upload/getUploadInfo', {
            tid: 106,
            ext: file.name.split('.').pop(),
        });

        if (respone.code === '200') {
            try {
                const { key, signUrl } = respone.content;
                await instancePic.put(signUrl, file, {
                    onUploadProgress: (e) => {
                        console.log('进度：', (e.loaded / e.total) * 100);
                    },
                });

                return {
                    url2: key,
                    url: URL.createObjectURL(file),
                };
            } catch (error) {
                return {
                    url2: '',
                    url: '',
                };
            }
        }
    }, []);

    const onDelete = useCallback((e) => {}, []);
    const clickFn = useCallback(
        (e) => {
            appGate.GetPermission(['photos', 'camera']).then((err) => {
                if (err === '0') {
                    setIsBind(true);
                } else if (err === '1') {
                    setIsBind(false);
                }
            });
            e.preventDefault();
        },
        [setIsBind],
    );

    return (
        <ImageUploader
            value={fileList}
            onChange={mpFn}
            upload={mockUpload}
            multiple={multiple || false}
            maxCount={maxCount || 1}
            showUpload={true}
            onDelete={onDelete}
            className={'image-' + face}
            clickFn={isBind ? clickFn : null}
            // eslint-disable-next-line react/no-children-prop
            children={childNe || ''}
        ></ImageUploader>
    );
};

const BasicUploadNoForm = ({
    value,
    setFileList,
    face,
    isBind,
    setIsBind,
    multiple,
    maxCount,
    childNe,
}) => {
    const mockUpload = useCallback((file) => {
        var params = new FormData();
        params.append('file', file);
        params.append('tid', '101');
        params.append('priv', '0');

        return instancePic
            .post('/api/v1/uploads', params)
            .then((d) => {
                if (d === undefined || d === '') {
                    if (appGate.inApp() && !appGate.inAppIOS()) {
                        appGate.GetPermission(['photos', 'camera']);
                    }
                    return { url: '' };
                } else if (d && d.content && d.code && d.code !== '200') {
                    Toast.show({
                        content: d.content,
                        afterClose: () => {
                            console.log('after');
                        },
                    });
                    return { url: '' };
                } else {
                    return {
                        url2: (d && d.content && d.content.url) || '',
                        url: URL.createObjectURL(file),
                    };
                }
            })
            .catch((err) => {
                return {
                    url2: '',
                    url: '',
                };
            });
    }, []);

    const onDelete = useCallback((e) => {}, []);
    const clickFn = useCallback(
        (e) => {
            appGate.GetPermission(['photos', 'camera']).then((err) => {
                if (err === '0') {
                    setIsBind(true);
                } else if (err === '1') {
                    setIsBind(false);
                }
            });
            e.preventDefault();
        },
        [setIsBind],
    );

    return (
        <ImageUploader
            value={value}
            onChange={(e) => {
                setFileList(e);
            }}
            upload={mockUpload}
            multiple={multiple || false}
            maxCount={maxCount || 1}
            showUpload={true}
            onDelete={onDelete}
            className={'image-' + face}
            clickFn={isBind ? clickFn : null}
            // eslint-disable-next-line react/no-children-prop
            children={childNe || ''}
        ></ImageUploader>
    );
};

export default BasicUpload;
export { BasicUploadNoForm };
