module.exports = function(grunt) {
    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            sass: {
                files: ['server/src/*.scss'],
                tasks: 'sass'
            },
        },
        sass: {
            dist: {
                options: {
                  style: 'expanded', 
                  // nested , compact , compressed , expanded
                  sourcemap: 'auto',
                },
                files: {
                    'public/css/main.css': 'server/src/main.scss',
                }
            }
        },
    });

    //Load NPM tasks
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['sass', 'watch']);

};
