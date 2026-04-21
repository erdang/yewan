const changeList = (list) => ({
    type: 'CHANGE_LIST',
    list,
});

export const getHomeList = () => {
    return (dispatch, getState, axiosInstance) => {
        // getState, axiosInstance
        // return axiosInstance.get('/api/news.json').then((res) => {
        //     const list = res.data.data;
        //     dispatch(changeList(list));
        // });

        return new Promise(() => {
            const list = ['2', '2'];
            dispatch(changeList(list));
        });
    };
};
