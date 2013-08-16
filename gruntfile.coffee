module.exports = (grunt) ->
  
  banner = '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= date %> */\n'
  
  grunt.initConfig
    date: grunt.template.today('dd-mm-yyyy')
    pkg: grunt.file.readJSON 'package.json'
    coffee:
      compile:
        files:
          'dist/<%= pkg.name %>.js': ['udefine/*.coffee', 'src/*.coffee']
    uglify:
      options:
        banner: banner
        report: 'gzip'
      dist:
        files:
          'dist/<%= pkg.name %>.min.js': ['dist/<%= pkg.name %>.js']
    coffeelint:
      app: ['src/**/*.coffee'],
      test: ['test/**/*.coffee'],
      grunt: ['Gruntfile.coffee']

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-coffeelint'

  grunt.registerTask 'test', ['coffeelint']
  grunt.registerTask 'default', ['coffeelint', 'coffee', 'uglify']
