#-------------------------------------------------------------------------------

Map = (config) ->

  @g          = null
  @zoom       = true
  @text       = false

  @transform  = (d) -> "translate(#{d.center.x},#{d.center.y})"
  @colour     = (d) -> "##{ d.colour_base.slice( 0, 6 ) }"
  @opacity    = (d) -> 0.2
  @stroke     = (d) -> "blue"


  _.extend this, config


  #------------------------------------------------------------------------------

  @drawPawns = (data) ->


    actorData = []

    for s in data.squads
      for m in s.members
        m.squad = s
        actorData.push m


    @g
      .selectAll ".actors"
      .remove()

    actors = @g
      .append 'g'
      .attr 'class', 'actors'

    actors = actors.selectAll ".actor"
      .data actorData
      .enter()
      .append "g"
        .attr "class", "actor"
        .attr "transform", (d) -> "translate( #{d.location.x}, #{d.location.y} )"

    actors
      .append "circle"
        .attr   "class", (d) ->
          if d.squad? and d.squad.type?
            d.squad.type.toLowerCase()
          else
            "creature"
        .attr   "r",      "50.0"
        .style  "fill",   (d) ->
          if d.squad.health <= 0 then "#DDDDDD" else ""
        .style  "stroke", (d) ->
          if d.squad.health <= 0 then "#CCCCCC" else ""


  #------------------------------------------------------------------------------

  @drawOrders = (data) ->

  # "order":"Special","target":"PrinceCharming","targetLocation":{"x":937,"y":31597}}

    @g
      .selectAll ".orders"
      .remove()

    orders = @g
      .append 'g'
      .attr 'class', 'orders'


    for squad in data.squads

      order = if squad.order? then squad.order.toLowerCase() else ""

      continue if order == "none" or order == ""
      continue if squad.health <= 0

      # get order location

      target  = _.find data.squads, (s) -> s.name == squad.target
      to      = if target? then target.members[0].location else squad.targetLocation

    #   # create line

      from  = squad.members[0].location

      orders.append "line"
        .attr "class", "#{ squad.type.toLowerCase() } #{ order }"
        .attr "x1", from.x
        .attr "y1", from.y
        .attr "x2", to.x
        .attr "y2", to.y
        .attr "marker-end", "url(#arrowhead)"



  #------------------------------------------------------------------------------

  @drawActors = (data) ->

    # process data

    return unless data?

    @drawOrders data
    @drawPawns data


  #------------------------------------------------------------------------------

  @draw = (data) ->

    xmap = this

    linesfunc =
      d3.svg.line()
        .x (d) -> d.x
        .y (d) -> d.y
        .interpolate "linear-closed"


    # init zoom handler

    if @zoom

      rot = 0

      zoom = d3.behavior.zoom().on "zoom", ->
        xmap.g.attr "transform", "translate( #{d3.event.translate} ) scale( #{d3.event.scale} )"
        console.log d3.event.translate, d3.event.scale, rot

      d3
        .select '#legends_model svg'
        .call zoom


    # draw areas

    @g
      .selectAll ".areas"
      .remove()

    @g.append 'g'

      .attr 'class', 'areas'
      .selectAll '.area'
      .data data.areas
      .enter()

      .append "g"
        .attr "class",        "area"
        .attr "transform",    (d) -> xmap.transform d
        .attr "fill-opacity", (d) -> xmap.opacity d
        .style "stroke",      (d) -> xmap.stroke d

        .append "path"
          .attr "d",          (d) -> linesfunc d.edges
          .attr "fill",       (d) -> xmap.colour d


    # append text

    if @text
      areas
        .append "text"
          .attr "transform", (d) -> "translate(#{d.center.x},#{d.center.y})" #map.transform d
          .text (d) -> d.id

  return
