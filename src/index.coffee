#-------------------------------------------------------------------------------

gCurSlide = null

Reveal.initialize

    controls    : false
    progress    : false
    slideNumber : false

    width       : 1920
    height      : 1080

    margin      : 0
    minScale    : 0.01
    maxScale    : 100

    # math:
    #     mathjax: 'js/MathJax.js',
    #     config: 'TeX-AMS_HTML-full'

    dependencies: [
        { src: 'js/math.js', async: true }
    ]


Reveal.addEventListener 'ready', (e) ->

    gSlides[ id ].onReady() for id of gSlides
    gCurSlide = if e.currentSlide.id of gSlides then gSlides[ e.currentSlide.id  ] else null

    if gCurSlide?
        gCurSlide.onShow e
        gCurSlide.shown = true


Reveal.addEventListener 'slidechanged', (e) ->

    console.log "slide: #{ e.currentSlide.id }"

    if gCurSlide?
        gCurSlide.onHide e
        gCurSlide.shown = false

    gCurSlide = if e.currentSlide.id of gSlides then gSlides[ e.currentSlide.id  ] else null

    if gCurSlide?
        gCurSlide.onShow e
        gCurSlide.shown = true


Reveal.addEventListener 'fragmentshown', (e) ->

    console.log "fragment: #{ e.fragment.id }"

    # video = e.fragment.querySelector 'video'
    # video.play() if video?

    gCurSlide.onFragementShow e if gCurSlide?


Reveal.addEventListener 'fragmenthidden', (e) ->

    # video = e.fragment.querySelector 'video'
    # video.pause() if video?

    gCurSlide.onFragementHide e if gCurSlide?

