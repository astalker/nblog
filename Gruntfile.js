module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-cli');
  grunt.initConfig({
    watch: {
      scripts: {
        files: ['test/**/*.js', 'lib/*.js'],
        tasks: ['test'],
        options: {
          debounceDelay: 250
        }
      }
    },
    mochacli: {
        options: {
            require: ['should'],
            reporter: 'list'
        },
        all: ['test/**/*.js']
    }
  });
  grunt.registerTask('test', 'mochacli');
  grunt.event.on('watch', function(action, filepath, target) {
    grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
  });
};
