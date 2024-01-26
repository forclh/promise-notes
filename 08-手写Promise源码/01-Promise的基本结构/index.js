// 立即执行函数
// 好处：可以避免对外部的变量造成污染
(function (window) {
    function Promise(executor) {
        executor()
    }
    window.Promise = Promise;
})(window)



