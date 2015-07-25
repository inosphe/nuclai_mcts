#-------------------------------------------------------------------------------

new Slide

  id: 'legends_model'
  sim: 1


  data: {
    children:[
      { children:[] }
      { children:[] }
      { children:[] }
      { children:[] }
      { children:[] }
      { children:[] }
      { children:[
        #
        { children:[] }
        { children:[] }
        { children:[] }
      ] }
      { children:[] }
    ]
  }


  #-------------------------------------------------------------------------------

  create: ->

    svg   = $ "#legends_model svg"
    root  = d3.select svg[0]
    slide = this

    # map

    @map = new Map

      g         : root.select '#map'
      zoom      : false
      text      : false

      transform : (d) -> "rotate(0) translate(#{d.center.x},#{d.center.y}) scale(0)"
      opacity   : (d) -> 0
      stroke    : (d) -> "none"

    @map.draw gMapData


    # tree

    @tree = new Tree
      g         : root.select '#tree'
      width     : svg.width()
      height    : svg.height()
      highlight : [1] #,4,7,10]
      depth     : 150

      colour    : (d) ->
          if d.id in slide.tree.highlight then "coral" else "lightsteelblue"
      stroke    : (d) ->
          if d.id in slide.tree.highlight then "red" else "steelblue"

      position  : (g) -> g.attr 'transform', "translate( 1500, 800 )"



  #-------------------------------------------------------------------------------

  animatedIn: ->

    areas = @map.g.selectAll ".area"

    i = 0

    areas
      .transition()
        .delay (d) -> ++i * 16
        .duration 500
        .ease "elastic"
        .attr 'transform', (d) -> "translate(#{d.center.x},#{d.center.y}) scale(1.0)"
        .style 'fill-opacity', '0.2'
        .style 'stroke', 'blue'


  #-------------------------------------------------------------------------------

  zoomToAction: ->

    svg   = $ "#legends_model svg > g"
    root  = d3.select svg[0]

    root
      .transition()
        .duration 1000
        .ease "cubic-in-out"
        .attr 'transform', (d) -> "translate(600,550) rotate(-50) scale(3)"
        .each "end", -> Reveal.nextFragment()

  #-------------------------------------------------------------------------------

  zoomOut: ->

    svg   = $ "#legends_model svg > g"
    root  = d3.select svg[0]

    root
      .transition()
        .duration 1000
        .ease "cubic-in-out"
        .attr 'transform', (d) -> "translate(1100,450) rotate(0) scale(1.2)"


  #-------------------------------------------------------------------------------

  showActors: ->

    @map.drawActors gSim[ @sim ].steps[0]

    # animate

    i = 0

    @map.g.selectAll '.actor > circle'
      .attr 'r', '0.0'
      .transition()
        .delay (d) -> ++i * ( 500 / 14 )
        .duration 500
        .ease "elastic", 3, 0.8
        .attr 'r', '50.0'

  #-------------------------------------------------------------------------------

  hideActors: ->

    @map.g
      .selectAll ".actors"
      .remove()
    @map.g
      .selectAll ".orders"
      .remove()

  #-------------------------------------------------------------------------------

  step: (id) ->

    #console.log gSim[ @sim ].steps[ id ].stepcount
    @map.drawActors gSim[ @sim ].steps[ id ]



  #-------------------------------------------------------------------------------

  onReady: (e) ->

    @create()


  #-------------------------------------------------------------------------------

  onFragementHide: (e) ->

    if e.fragment.id.startsWith "lm_step"
      id = e.fragment.id.replace "lm_step", ""
      if --id <= 0
        @hideActors()
      else
        @step id

    switch e.fragment.id

      when "lm_zoom"      then @zoomOut()
      when "lm_show"      then @hideActors()
      when "lm_showtree"  then @tree.g.selectAll('*').remove()


  #-------------------------------------------------------------------------------

  onFragementShow: (e) ->

    if e.fragment.id.startsWith "lm_step"
      @step e.fragment.id.replace "lm_step", ""


    switch e.fragment.id

      when "lm_start"     then @animatedIn()
      when "lm_zoom"      then @zoomToAction()
      when "lm_show"      then @showActors()

      when "lm_showtree"
        @tree.highlight = [1]
        @tree.draw @data

      when "lm_step2"
        @tree.highlight = [1,8]
        @tree.draw @data
      when "lm_step3"
        @tree.highlight = [1,8,10]
        @tree.draw @data

      when "lm_step4"
          setTimeout ( -> Reveal.nextFragment() ), 250

      when "lm_step5"
          setTimeout ( -> Reveal.nextFragment() ), 250

      when "lm_score"
          @tree.g.selectAll('*').remove()

