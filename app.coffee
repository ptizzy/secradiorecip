axis         = require 'axis'
rupture      = require 'rupture'
jeet         = require 'jeet'
autoprefixer = require 'autoprefixer-stylus'
js_pipeline  = require 'js-pipeline'
css_pipeline = require 'css-pipeline'

module.exports =
  ignores: ['readme.md', '**/layout.*', '**/_*', '**/*.swp', '**/*.*~', 'includes/*.*', '.gitignore', 'ship.*conf']

  debug: true

  extensions: [
    js_pipeline(files: 'assets/js/*.coffee'),
    css_pipeline(files: 'assets/css/*.styl')
  ]

  stylus:
    use: [axis(), rupture(), jeet(), autoprefixer()]
    sourcemap: true

  'coffee-script':
    sourcemap: true

  jade:
    pretty: true
    data: ->
      elements = {}
      sources = {'alabama': './views/includes/alabama_data'}
      for name, data of sources
        _data = require data
        elements[name] = _data.elements
        #elements[name] = JSON.stringify(_data.elements)
      return elements
