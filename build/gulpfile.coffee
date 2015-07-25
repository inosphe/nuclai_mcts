gulp    = require 'gulp'
util    = require 'gulp-util'
options = require './options.coffee'
config  = require( './config.coffee')( options )

project.create options for project in config

gulp.task 'clean', ( "clean-#{project.name}" for project in config )
gulp.task 'build', ( "build-#{project.name}" for project in config )
gulp.task 'watch', ( "watch-#{project.name}" for project in config )
gulp.task 'default', [ 'build' ]
