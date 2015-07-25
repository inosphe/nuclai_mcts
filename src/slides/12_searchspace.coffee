
#-------------------------------------------------------------------------------

SSNode = (p,d) ->

  @depth    = if p? then p.depth + 1 else 0
  @children = []

  if d? and d.children?
    for c in d.children
      @children.push new SSNode this, c

  @expand = ->

    return if @depth > 4
    len = 8 - @depth * 2

    @children = []

    for i in [ 1..len ]
      @children.push new SSNode this

  @findPuck = (b) ->

    if @depth == 5

      if not b?

        b = this

      else if @x / 4 - 45 > -40

        db = Math.abs ( b.x / 4 ) - 45
        dt = Math.abs ( @x / 4 ) - 45
        b = this if db > dt

    else if @children?
      b = c.findPuck b for c in @children

    return b


  return


gSSTree = {children:[{children:[{children:[{},{},{children:[{children:[{},{}]},{}]},{children:[{},{children:[{},{}]}]}]},{children:[{},{},{children:[{children:[{},{}]},{children:[{},{}]}]},{children:[{},{children:[{},{}]}]}]},{children:[{},{},{},{}]},{},{children:[{},{children:[{children:[{},{}]},{children:[{},{}]}]},{children:[{children:[{},{}]},{children:[{},{}]}]},{children:[{},{}]}]},{children:[{children:[{},{}]},{children:[{children:[{},{}]},{}]},{},{children:[{},{}]}]}]},{},{children:[{},{children:[{},{},{children:[{},{children:[{},{}]}]},{children:[{children:[{},{}]},{children:[{},{}]}]}]},{children:[{children:[{children:[{},{}]},{children:[{},{}]}]},{},{},{}]},{},{},{}]},{},{},{},{children:[{children:[{children:[{},{children:[{},{}]}]},{},{},{children:[{},{children:[{},{}]}]}]},{},{},{},{children:[{},{},{children:[{children:[{},{}]},{children:[{},{}]}]},{}]},{}]},{}]}

#-------------------------------------------------------------------------------


new Slide

  id        : "searchspace"
  cur_node  : null
  ratio     : 120 / 360
  turn      : 15

  #-------------------------------------------------------------------------------

  createTree: ->

    @data = new SSNode null, gSSTree


  #-------------------------------------------------------------------------------

  doCollapse: ->

    slide   = this
    node    = @cur_node
    parent  = @cur_node.parent

    @root
      .select ".link_#{ node.id }"
      .remove()

    @root.select "#np_#{ parent.id } > circle"
      .transition()
        .delay 100
        .duration 200
        .attr 'r', '50'
        .each "end", ->

          slide.root.select "#np_#{ parent.id } > circle"
            .transition()
              .delay 0
              .duration 100
              .attr 'r', '0'

    @root.select '.node_action'
      .transition()
        .duration 500
        .attr 'transform', "rotate( #{ slide.ratio * parent.x - 90 - slide.turn } ) translate( #{ parent.y } )"
        .each "end", ->

          slide.cur_node = slide.cur_node.parent

          if slide.cur_node? and slide.cur_node.parent? and slide.cur_node.parent.parent?

            setTimeout ( -> slide.doCollapse() ), 100

          else

            Reveal.nextFragment()

            slide.root.select '.node_action > circle'
              .transition()
                .duration 2000
                .attr 'fill', '#93C572'
                .attr 'stroke', '#568203'

  #-------------------------------------------------------------------------------

  doExpand: ->

    return if @expand.length is 0

    slide = this
    nodes = []

    for e in @expand
      e.expand() if Math.random() < 0.5
      if e.children?
        nodes.push c for c in e.children

    setTimeout ( -> slide.doExpand() ), 500
    @tree.draw @data

    # TODO: transition

    @expand = nodes


  #-------------------------------------------------------------------------------

  doSetup: ->

    slide   = this

    svg   = $ '#searchspace svg'
    @root = d3.select svg[0]

    @tree = new Tree
      g         : @root.select 'g'
      width     : svg.width()
      height    : svg.height()
      highlight : []
      depth     : 200
      colour    : (d) -> "lightsteelblue"
      stroke    : (d) -> "steelblue"
      position  : ->
      diagonal  : d3.svg.diagonal.radial().projection (d) -> [ d.y, ( slide.ratio * d.x - slide.turn ) / 180 * Math.PI ]
      tree      : d3.layout.tree()
                    .size       [ 360, svg.height() / 2  - 50 ]
                    .separation (a, b) -> (if a.parent == b.parent then 1 else 2) / if a.depth > 0 then a.depth else 1
      translate : (d) -> "rotate( #{ slide.ratio * d.x - 90 - slide.turn } ) translate( #{ d.y } )"


  #-------------------------------------------------------------------------------

  onFragementHide: (e) ->

    switch

      when e.fragment.id is "ss_run" or e.fragment.id is "ss_action"

        @root
          .select 'g'
          .selectAll 'path'
          .remove()

        @root
          .select 'g'
          .selectAll 'g'
          .remove()


  #-------------------------------------------------------------------------------

  onReady: (e) ->

    @doSetup()
    @createTree()
    @tree.draw @data


  #-------------------------------------------------------------------------------

  onFragementShow: (e) ->

    slide = this

    switch e.fragment.id

      # when "ss_run"

        # setTimeout ( ->

        #   slide.data.expand()

        #   slide.expand = []
        #   slide.expand.push c for c in slide.data.children

        #   slide.tree.draw slide.data
        #   setTimeout ( -> slide.doExpand() ), 500

        # ), 500


      when "ss_action"

        d = @data.findPuck null
        r = d

        @cur_node = d


        # links

        diagonal = d3.svg.diagonal.radial()
          .source (d) -> return x: d.parent.x, y: d.parent.y
          .target (d) -> return x: d.x, y: d.y
          .projection (d) -> [ d.y, ( slide.ratio * d.x - slide.turn ) / 180 * Math.PI ]


        while d

          if d.parent?

            @root.select 'g'
              .append 'path'
                .attr 'class',        "link link_#{ d.id }"
                .attr 'd',            diagonal d
                .attr 'stroke',       (d) -> "red"
                .attr 'stroke-width', (d) -> "5px"
                .attr 'stroke-opacity', 0
                .transition()
                  .delay 1200 + 200 * ( 4 - d.depth )
                  .duration 10
                  .attr 'stroke-opacity', 1

          d = d.parent

        # action

        d = r

        @root.select 'g'
          .append 'g'
            .attr 'class',    'node_action'
            .attr 'transform', "rotate( #{ slide.ratio * d.x - 90 - slide.turn } ) translate( #{ d.y } )"
            .append 'circle'
              .attr 'r', '30'
              .attr 'stroke', 'red'
              .attr 'stroke-width', '3px'
              .attr 'fill', 'coral'
              .transition()
                .attr 'r', '60'
                .duration 1000
                .ease 'elastic'


        # # nodes

        d = r
        d = d.parent

        while d

          @root.select 'g'
            .append 'g'
              .attr 'id',       "np_#{ d.id }"
              .attr 'transform', "rotate( #{ slide.ratio * d.x - 90 - slide.turn } ) translate( #{ d.y } ) scale(1)"
              .append 'circle'
                .attr 'r', '30'
                .attr 'stroke', 'red'
                .attr 'stroke-width', '3px'
                .attr 'fill', '#FF8080'
                .attr 'stroke-opacity', 0
                .attr 'fill-opacity', 0
                .transition()
                  .delay 1000 + 200 * ( 4 - d.depth )
                  .duration 200
                  .attr 'stroke-opacity', 1
                  .attr 'fill-opacity', 1


          d = d.parent


      when "ss_collapse"

        @doCollapse()

