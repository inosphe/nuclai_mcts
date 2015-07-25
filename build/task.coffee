#------------------------------------------------------------------------------

_           = require 'lodash'
gulp        = require 'gulp'
util        = require 'gulp-util'
notify      = require 'gulp-notify'
plumber     = require 'gulp-plumber'
changed     = require 'gulp-changed'
livereload  = require 'gulp-livereload'
gulpif      = require 'gulp-if'
rename      = require 'gulp-rename'
map         = require 'map-stream'
path        = require 'path'


#------------------------------------------------------------------------------
# Task

module.exports = ( config ) ->

  #------------------------------------------------------------------------------

  @name     = "task"
  @ext      = null
  @src      = ""
  @dst      = ""
  @match    = []
  @watch    = false
  @action   = ( task ) -> task

  @project  = null
  @options  = null


  #------------------------------------------------------------------------------
  # util functions

  @getSrc   = -> path.join @project.src, @src()
  @getDst   = ( subdir ) -> path.join @project.dst, @dst(), subdir


  @processMatch = ( match ) ->

    result =
      pattern : null
      rename  : null
      dst     : ""

    if Object.prototype.toString.call( match ) == "[object Object]"
      result.pattern  = match.pattern
      result.rename   = match.rename
      result.dst      = match.subdir if match.subdir?
    else
      result.pattern  = match

    result.pattern  = @resolvePaths result.pattern
    result.dst      = @getDst result.dst

    return result


  @resolvePaths = ( pattern ) ->

    pattern = [ pattern ] unless _.isArray pattern
    srcdir  = @getSrc()

    (
      for v in pattern
        if v.indexOf( '!' ) == 0
          "!#{ srcdir }#{ v.substring 1 }"
        else
          "#{ srcdir }#{ v }"
    )


  @printfiles = ( task ) -> return map ( file, cb ) ->
      util.log util.colors.green( task.name() ), ':', file.path
      cb( null, file );


  #------------------------------------------------------------------------------
  # create task

  @create = ( project, options ) ->

    @project  = project
    @options  = options

    task = this
    gulp.task @name(), -> task.run options


  #------------------------------------------------------------------------------
  # run task

  @run = ( options ) ->

    util.log util.colors.cyan( @name() ), config if options.verbose

    list = @match()
    list = [ list ] unless Object.prototype.toString.call( list ) is "[object Array]"

    for match in list

      match = @processMatch match

      stream = @prologue  match
      stream = @action    stream, match, this
      stream = @epilogue  stream, match


  @prologue = ( match ) ->
    gulp.src match.pattern
      .pipe gulpif match.rename?,     rename match.rename
      .pipe gulpif @options.changed,  changed match.dst, extension: @ext()
      .pipe gulpif @options.notify,   plumber errorHandler: notify.onError '<%= error.message %>'
      .pipe @printfiles this



  @epilogue = ( stream, match ) ->
    stream
      .pipe gulp.dest match.dst
      .pipe gulpif @options.notify, notify message: '<%= file.relative %>'
      .pipe gulpif @options.livereload, livereload()



  #------------------------------------------------------------------------------
  # watch

  @watcher = ->

    watch = @watch()
    return if not watch

    xtask = this

    watch = @match() if watch == "*"
    watch = [ watch ] unless _.isArray watch
    watch = _.map watch, (w) -> xtask.processMatch( w ).pattern[0]

    util.log 'Watching ', util.colors.yellow @name(), util.colors.cyan watch

    gulp
      .watch watch, [ @name() ]
      .on 'change', (e) ->
        util.log util.colors.green e.type, e.path


  #------------------------------------------------------------------------------
  # finalise setup

  # override properties from config

  this[k] = v for k,v of config


  # convert to functions

  name = @name
  if typeof @name isnt "function" then @name = -> "#{ @project.name }-#{ name }"

  shim = (v) -> -> v
  this[k] = shim v for k,v of this when typeof this[k] isnt "function" and k isnt "action"


  return

