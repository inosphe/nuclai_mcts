#------------------------------------------------------------------------------
# Project

gulp        = require 'gulp'
util        = require 'gulp-util'
using       = require 'gulp-using'
clean       = require 'gulp-clean'


module.exports = (config) ->

  @name     = "project"
  @src      = "./"
  @dst      = "./"
  @tasks    = []

  @options  = null


  #------------------------------------------------------------------------------

  @create = (options) ->

    @options = options

    task.create this, options for task in @tasks


    xproject = this
    gulp.task "clean-#{@name}", -> xproject.clean()
    gulp.task "watch-#{@name}", -> xproject.watch()
    gulp.task "build-#{@name}", ( task.name() for task in @tasks )


  #------------------------------------------------------------------------------

  @clean = ->

    util.log util.colors.yellow "Cleaning #{@name}"

    gulp
      .src  @dst
      .pipe using()
      .pipe clean force: true


  #------------------------------------------------------------------------------

  @watch = -> task.watcher() for task in @tasks


  #------------------------------------------------------------------------------
  # override from config

  this[k] = v for k,v of config


  return
