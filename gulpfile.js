var TaskBuilder = require('gulp-task-builder');

TaskBuilder.task('app')
    .webpack('scripts/app.js', false)
    //.removeEmptyLines()
    .dest();

// TaskBuilder.task('example-js')
//     .webpack('scripts/example/example.js', false)
//     .dest();

TaskBuilder.task('styles')
    .src('styles/**')
    .stylus()
    .concatCss('app.css')
    .dest();

TaskBuilder.task('resources')
    .src('../node_modules/cesium/Build/Cesium/**')
    .dest();

// TaskBuilder
//     .task('example-html')
//     .src('html/example.html')
//     .fileInclude()
//     .dest();

TaskBuilder
    .task('default')
    .depends([
        'app',
        'styles',
        'resources'
    ])
    .src('html/index.html')
    // .fileInclude()
    .dest();
