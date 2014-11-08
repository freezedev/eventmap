module.exports = (grunt) ->
  options:
    banner: '/*! <%= package.name %> - v<%= package.version %> - <%= date %> */\n'
    report: 'gzip'
  dist:
    files:
      'dist/<%= package.name %>.min.js': ['dist/<%= package.name %>.js']
