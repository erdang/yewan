/** IndexedDB 使用示例 (以下为个人封装版, 具体内容下方有注释)

     // @params: 第一个参数: db名, 第二个参数: 表名, 第三个参数(注意了): 类似于数据库的主键key
     initDB('db', 'mytable', 'url') // 初始化

     // @params: 第三个参数要存的值
     setVal('db', 'mytable', {url: 222, data: {a: 11111}}) // 存数据
     
     // @params: 第三个参数是主键key对的值, 根据这个值, 拿到之前存过的值
     getVal('db', 'mytable', 222, (e) => { console.log(e) }) // 取数据  返回: {url: 222, data: {…}}

     注：初始化成功后，控制台的Application内能看到。 新db注册后, 要关闭控制台, 重开一遍, 才能在控制台的Application内看见
 */

export const initDB = function (dbName, tableName, key) {
    // 初始化db
    const IndexedDB = window.indexedDB.open(dbName);
    IndexedDB.onupgradeneeded = function (event) {
        // 如果指定的版本号，大于数据库的实际版本号，就会发生数据库升级事件upgradeneeded
        // 新建数据库
        const result = event.target.result;
        if (!result.objectStoreNames.contains(tableName)) {
            // 先判断库是否存在
            result
                .createObjectStore(tableName, { keyPath: key }) // 表的主键 是 url 比如{url: 'xx', data: {xx}}  主键会自动生成索引
                .createIndex(key, key, { unique: true }); // 建立索引
        }
        IndexedDB.result.close();
    };
};

export const setVal = function (dbName, tableName, setData) {
    try {
        const IndexedDB1 = window.indexedDB.open(dbName);
        IndexedDB1.onsuccess = function (event) {
            const db = IndexedDB1.result;
            db.transaction([tableName], 'readwrite') // 指定需要访问的 数据库名
                .objectStore(tableName) // 返回数据库对象
                .put(setData);

            db.close();
        };
    } catch (error) {
        console.error(error);
    }
};

export const getVal = function (dbName, tableName, key, cb) {
    const IndexedDB2 = window.indexedDB.open(dbName);
    IndexedDB2.onsuccess = function (event) {
        const db = IndexedDB2.result;
        if (db.objectStoreNames.contains(tableName)) {
            const request = db
                .transaction([tableName], 'readwrite')
                .objectStore(tableName)
                .get(key); // key是: JSON.stringify(opt)
            request.onsuccess = function (event) {
                if (request.result) {
                    cb(request.result);
                    return true;
                } else {
                    cb(null);
                }
            };
        }
        db.close();
    };
};
