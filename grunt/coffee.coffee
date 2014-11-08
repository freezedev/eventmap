module.exports =
  compile:
    files: ['dist/<%= package.name %>.js': ['src/*.coffee']
    {
      expand: true
      src: ['test/*.coffee']
      ext: '.js'
    }]