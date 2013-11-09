/*global module:false*/
module.exports = function(grunt) {

  // load all grunt tasks matching the `grunt-*` pattern
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({

    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      src: 'Gruntfile.js'
    },
    
    sass: {
      options: {
        style: 'expanded'
      },
      'styles/styles.css': 'styles/styles.css.scss'
    },

    watch: {
      dev: {
        files: [
          'styles/styles.css.scss'
        ],
        tasks: ['sass', 'jshint'],
        options: {
          livereload: true
        }
      }
    },

    connect: {
      server: {
        options: {
          host: 'localhost',
          port: 8000,
          base: '.'
        }
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['connect:server', 'watch']);

  // Development task.
  grunt.registerTask('dev', ['jshint', 'sass']);
};
