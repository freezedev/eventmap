module.exports = (grunt) ->
  
  banner = '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= date %> */\n'
  
  grunt.initConfig
    date: grunt.template.today('dd-mm-yyyy')
    pkg: grunt.file.readJSON 'package.json'
    coffee:
      compile:
        files: ['dist/<%= pkg.name %>.js': ['udefine/*.coffee', 'src/*.coffee']
        {
          expand: true
          src: ['test/*.coffee']
          ext: '.js'
        }]
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

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks)

  grunt.registerTask 'test', ['coffeelint']
  grunt.registerTask 'default', ['coffeelint', 'coffee', 'uglify']
