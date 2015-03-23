module.exports = (grunt) ->

  require('time-grunt')(grunt)

  require('load-grunt-config') grunt,
    jitGrunt: true,
    data:
      date: grunt.template.today('dd-mm-yyyy')

  grunt.registerTask 'test', ['coffeelint', 'mochaTest', 'karma']
  grunt.registerTask 'default', ['clean', 'coffee', 'test', 'uglify']
