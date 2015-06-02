

module.exports = function (grunt) {

    'use strict';

    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // Project configuration.
    grunt.initConfig({
        mochacli: {
            options: {
                reporter: 'spec'
            },
            all: ['test/{,*/}*.js']
        },
        watch: {
            scripts: {
                files: ['<%= jshint.all %>'],
                tasks: ['default']
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                'lib/**',
                'test/**',
                'api.js'
            ]
        },
        mocha_istanbul: {
            coverage: {
                src: 'test',
                options: {
                    mask: '*.js',
                    reportFormats: ['clover', 'lcov']
                }
            }
        },
        shell: {
            serve: {
                command: 'nodemon api.js -c dev --v'
            }
        }
    });

    // serve
    grunt.registerTask('serve', ['shell:serve']);

    // Default task.
    grunt.loadNpmTasks('grunt-mocha-istanbul');
    grunt.registerTask('test', ['jshint', 'mochacli']);
    grunt.registerTask('default', ['test']);
    grunt.registerTask('coverage', ['mocha_istanbul:coverage']);
};
