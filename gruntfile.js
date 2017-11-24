module.exports = function (grunt) {
    grunt.initConfig({
        nodemon: {
            dev: {
                script: 'app.js'
            }
        }

    });
    //实时监控文件变化、调用相应的任务重新执行
   // grunt.loadNpmTasks('grunt-contrib-watch');
    //自动重启app.js
    grunt.loadNpmTasks('grunt-nodemon');
    //优化慢任务的时间，跑多个组策的任务
   // grunt.loadNpmTasks('grunt-concurrent');

    //不因为语法警告等而中断任务
    grunt.option('fore', true);

    //注册默认任务
    grunt.registerTask('default', ['nodemon'])

};