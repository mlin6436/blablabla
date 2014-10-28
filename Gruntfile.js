'use strict';

var RUNNING_PORT = 80;

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({

    cssmin: {
      combine: {
        files: {
          'public/css/core.css': 'bower_components/bootstrap.css/css/bootstrap.css'
        }
      }
    },

    less: {
      options: {
        //report:'gzip'
      },
      production: {
        options: {
          cleancss: true
        },
        files: {
          "public/css/core.css": "public/bower_components/bootstrap/less/bootstrap.less"
        }
      }
    },

    sass: {
      dist: {
        options: {
          style: 'compressed'
        },
        files: {
          'public/css/core.css': 'public/bower_components/sass-bootstrap/lib/bootstrap.scss',
        }
      }
    },

    stylus: {
      compile: {
        options: {
          compress:true
        },
        files: {
          'public/css/core.css': 'public/bower_components/bootstrap-stylus/stylus/bootstrap.styl'
        }
      }
    },

    concat: {
      options: {
        separator: ';',
        stripBanners:true
      },
      dist: {
        src: ['public/js/app.js'],
        dest: 'public/js/concat.js',
      },
    },

    //this is currently turned off, since jquery KILLS it
    jshint: {
      options: {
        curly: true,
        eqeqeq: false,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        }
      },
      files:{
        src:['public/js/concat.js']
      }
    },

    uglify: {
      options: {
        mangle: false
      },
      my_target: {
        files: {
          'public/js/app.min.js': ['public/js/concat.js']
        }
      }
    },

    // Watch Config
    watch: {
        files: ['views/**/*'],
        options: {
            livereload: true
        },
        scripts: {
            files: [
                'public/js/**/*.js'
            ],
            tasks:['build']
        },
        css: {
            files: [
                'public/css/**/*.css',
            ],
        },
        less: {
            files: ['public/bower_components/bootstrap/less/**/*.less'],
            tasks: ['build']
        },
        express: {
            files:  [ 'server.js', '!**/node_modules/**', '!Gruntfile.js' ],
            tasks:  [ 'watch' ],
            options: {
                nospawn: true // Without this option specified express won't be reloaded
            }
        },
    },

    nodemon:{
      dev: {
        script: 'server.js',
        options: {
          //args: ['dev'],
          //nodeArgs: ['--debug'],
          ignoredFiles: ['node_modules/**'],
          //watchedExtensions: ['js'],
          watchedFolders: ['views', 'routes'],
          //delayTime: 1,
          legacyWatch: true,
          env: {
            PORT: RUNNING_PORT
          },
          cwd: __dirname
        }
      }
    },

    // run 'watch' and 'nodemon' indefinitely, together
    // 'launch' will just kick it off, and won't stay running
    concurrent: {
        target: {
            tasks: ['nodemon', 'watch', 'launch'],
            options: {
                logConcurrentOutput: true
            }
        }
    },

    wait:{
      options: {
          delay: 1000
      },
      pause:{
        options:{
          before:function(options){
            console.log('pausing %dms before launching page', options.delay);
          },
          after : function() {
              console.log('pause end, heading to page (using default browser)');
          }
        }
      }
    },

    open: {
      server: {
        path: 'http://blablabla-mlin6436.rhcloud.com' + RUNNING_PORT
      }
    }

  });

  grunt.registerTask('build', ['cssmin', 'concat', 'uglify']);

  grunt.registerTask('launch', ['wait', 'open']);

  grunt.registerTask('default', ['build', 'concurrent']);

};
