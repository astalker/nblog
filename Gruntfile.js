module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jasmine-node');
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
    jasmine_node: {
      specNameMatcher: "spec",
      projectRoot: "test",
      requirejs: false,
      forceExit: true,
      jUnit: {
        report: false,
        savePath : "./build/reports/jasmine/",
        useDotNotation: true,
        consolidate: true
      }
    }
  });
  grunt.registerTask('test', 'jasmine_node');
  grunt.event.on('watch', function(action, filepath, target) {
    grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
  });
};
