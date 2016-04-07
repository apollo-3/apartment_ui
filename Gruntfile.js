module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
	all: ['public/**/*.js']
    },
    concat: {
      dist: {
        src: ['public/modules/*.js', 'public/**/*.js'],
        dest: 'build/concat.js'
      },
      options: {
        separator: ';'
      }
    },
    copy: {
      main: {
        expand: true,
        cwd: 'bower_components/bootstrap/dist/fonts/',
        src: '*',
        dest: 'public/fonts/'
      }
    },
    uglify: {
      dist: {
        files: {
          'build/concat.js': [ 'build/concat.js' ]
        },
        options: {
          mangle: false
        }
      }
    },
    watch: {
      dev: {
        files: ['**/*.js'],
        tasks: ['concat'],
        options: {
          atBegin: true,
        },
      },
    },
    bower_concat: {
      all: {
        dest: {
          'js': 'build/bower.js',
          'css': 'build/bower.css'
        },
        mainFiles: {
          'cryptojslib' : 'rollups/md5.js',
          'bootstrap' : ['dist/css/bootstrap.css', 'dist/js/bootstrap.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-bower-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['bower_concat','concat','copy:main']);
  grunt.registerTask('hint', ['jshint']);
  grunt.registerTask('standby',['watch:dev']);
};
