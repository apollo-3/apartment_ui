module.exports = function(grunt) {
  grunt.initConfig({
    watch: {
      scripts: {
        files: '**/*.*',
        tasks: ['default'],
        options: {
          interrupt: true,
        },
     },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', []);
};
