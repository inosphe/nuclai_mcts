#------------------------------------------------------------------------------

util        = require 'gulp-util'
http        = require 'http'
st          = require 'st'
livereload  = require 'gulp-livereload'


#------------------------------------------------------------------------------

first_task = if util.env._.length > 0 then util.env._[0] else 'default'

watch = first_task.substring( 0, 5 ) == "watch"

module.exports =
  flavour     : if util.env.flavour then util.env.flavour else 'development'
  changed     : not util.env.force?
  watch       : watch
  notify      : watch
  verbose     : util.env.verbose?
  livereload  : util.env.livereload?


if module.exports.livereload

  dir   = "../output/#{ module.exports.flavour }/www"
  port  = 8080

  http
    .createServer st
      path: dir
      index: 'index.html'
      cache: false
    .listen port

  livereload.listen basePath: dir

  util.log util.colors.yellow "Live reload enabled"
  util.log util.colors.green( "Port: " ), port
  util.log util.colors.green( " Dir: " ), dir
