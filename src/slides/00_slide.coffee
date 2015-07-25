#-------------------------------------------------------------------------------

gSlides = {}

#-------------------------------------------------------------------------------

Slide = (cfg) ->

    slide = this
    shown = false

    @id     = "test"

    @onReady         = (e) ->
    @onShow          = (e) ->
    @onHide          = (e) ->
    @onFragementShow = (e) ->
    @onFragementHide = (e) ->

    _.extend this, cfg
    gSlides[ @id ] = this

    return

