#------------------------------------------------------------------------------
#

fs              = require 'fs'
path            = require 'path'
gulp            = require 'gulp'
gulpif          = require 'gulp-if'
changed         = require 'gulp-changed'
coffee          = require "gulp-coffee"
filter          = require 'gulp-filter'
flatten         = require 'gulp-flatten'
haml            = require "gulp-ruby-haml"
sass            = require "gulp-sass"
sourcemaps      = require 'gulp-sourcemaps'
util            = require "gulp-util"
dependencies    = require 'gulp-dependencies'
using           = require 'gulp-using'
mainBowerFiles  = require 'main-bower-files'
notify          = require 'gulp-notify'
plumber         = require 'gulp-plumber'
prettify        = require 'gulp-prettify'
include         = require 'gulp-include'
through         = require 'through2'

Project         = require "./project.coffee"
Task            = require "./task.coffee"



#------------------------------------------------------------------------------
#

removeUnderscore = ->

  add = (file, unused, cb) ->
    fn = path.basename file.path
    if fn[0] != '_'
      this.push file
    else
      util.log util.colors.red( "ignore" ), file.path
    cb()

  through.obj add, null

printFileContents = ->

  add = (file, unused, cb) ->

    if file.isBuffer()
      util.log util.colors.magenta file.path
      console.log file.contents.toString()

    this.push file
    cb()

  through.obj add, null


touch = ( filename ) ->

  add = (file, unused, cb) ->

    if file.isBuffer()

      now = new Date()

      if filename?
        if file.path.indexOf( filename ) != -1
          util.log util.colors.magenta( "touch" ), file.path
          fs.utimesSync file.path, now, now
      else
        util.log util.colors.magenta( "touch" ), file.path
        fs.utimesSync file.path, now, now

    this.push file
    cb()

  through.obj add, null



#------------------------------------------------------------------------------
#

module.exports = (options) ->

  src = "../src/"
  out = "../root/"

  return [

    #------------------------------------------------------------------------------
    # third party libraries
    #------------------------------------------------------------------------------

    new Project

      name  : "3p"
      src   : "#{src}third_party/"
      dst   : out
      tasks : [

        # copy main files from bower.json files

        new Task
          name  : "bower-main"
          run   : ( options ) ->

            # get bower files

            stream  = gulp.src mainBowerFiles()

            # copy to folder structure

            dst     = @getDst ""
            task    = this

            cpy = ( match, subdir ) ->


              dir = "#{ dst }#{ subdir }"
              selector = filter match

              stream = stream
                .pipe selector
                .pipe gulpif options.changed, changed dir
                .pipe task.printfiles task
                .pipe gulp.dest dir
                .pipe selector.restore()

            cpy '*.js', 'js'
            cpy '*.css', 'css'
            cpy '*.{woff,woff2,eot,svg,ttf}', 'fonts'
            cpy '*.{gif,jpg,jpeg,ico,png}', 'img'
      ]


    #------------------------------------------------------------------------------
    # slides
    #------------------------------------------------------------------------------

    new Project

      name  : "slides"
      src   : src
      dst   : out
      tasks : [

        new Task
          name  : "coffee"
          match : "**/*.coffee"
          watch : "*"
          ext   : ".js"
          action: (task) ->
            task

              # .pipe touch  "_tree.coffee"

              .pipe dependencies

                basepath: @getSrc()
                dest    : @getDst ""
                ext     : @ext()

                match   : /#=\s*include\s+([\w\.]+)/g


              .pipe removeUnderscore()
              .pipe touch()
              .pipe include()

              .pipe sourcemaps.init()
              .pipe coffee bare: true
              .pipe sourcemaps.write()


        new Task
          name  : "scss"
          match : "**/*.scss"
          watch : "*"
          ext   : ".css"
          action: (task) -> task.pipe sass()


        new Task
          name  : "haml"
          match : [ "index.haml" ] #, "**/*.haml" ]
          watch : [ "**/*.haml", "**/*.rb" ]
          ext   : ".html"

          prologue: ( match ) ->
            gulp
              .src match.pattern
              .pipe gulpif @options.notify, plumber errorHandler: notify.onError '<%= error.message %>'

          action: ( stream, match, task ) ->

            stream

              .pipe haml()
              .pipe prettify indent_size: 2, preserve_newlines: true
              .pipe @printfiles this

        new Task
          name  : "copy"
          match : "**/*.{png,gif,jpg,json,css,js}"

      ]
  ]

