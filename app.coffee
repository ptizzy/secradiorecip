axis         = require 'axis'
rupture      = require 'rupture'
jeet         = require 'jeet'
autoprefixer = require 'autoprefixer-stylus'
js_pipeline  = require 'js-pipeline'
css_pipeline = require 'css-pipeline'

module.exports =

  ignores: ['readme.md', '**/layout.*', '**/_*', '**/*.swp', '**/*.*~', '**/includes/*.*', '**/templates/*.*', '.gitignore', 'ship.*conf']


  extensions: [
    js_pipeline(files: ['assets/js/vendor/**', 'assets/js/main.coffee']),
    css_pipeline(files: ['assets/css/vendor/**', 'assets/css/master.styl'])
  ]

  stylus:
    use: [axis(), rupture(), jeet(), autoprefixer()]
    sourcemap: true

  'coffee-script':
    #debug: true
    sourcemap: true


  jade:
    pretty: true
    data: ->
      elements = {}
      sources = {
        'alabama': './views/includes/alabama_data',
        'arkansas': './views/includes/arkansas_data',
        'auburn': './views/includes/auburn_data'
      }

      for name, data of sources
        _data = require data
        elements[name] = _data.elements
      return elements
