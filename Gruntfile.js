module.exports = function(grunt) {
  grunt.initConfig({
    bower_concat: {
      all: {
        dest: {
          'js': 'build/bower.js',
          'css': 'build/bower.css'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-bower-concat');
  grunt.registerTask('default', ['bower_concat']);
};
