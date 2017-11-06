var gulp = require('gulp');
var babel = require('gulp-babel');

gulp.task("default", function(){
    return gulp.src("public/jsx/*.jsx").
        pipe(babel({
            plugins: ['transform-react-jsx']
        })).
        pipe(gulp.dest("public/js/"));
});
