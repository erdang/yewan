const retry = function (fn, retriesTimes = 5, interval = 1000) {
    return new Promise((resolve, reject) => {
        fn()
            .then(resolve)
            .catch((error) => {
                setTimeout(() => {
                    if (retriesTimes === 0) {
                        reject(error);
                        return;
                    }
                    retry(fn, retriesTimes - 1, interval).then(resolve, reject);
                }, interval);
            });
    });
};

export default retry;
