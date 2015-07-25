#-------------------------------------------------------------------------------

Tree = (cfg) ->

  @idx        = 0
  @g          = null
  @width      = 960
  @height     = 600
  @highlight  = [1]
  @depth      = 200

  @colour     = null
  @position   = null

  @diagonal = d3.svg.diagonal.radial().projection (d) -> [ d.y, ( d.x + 90 ) / 180 * Math.PI ]

  @tree = d3.layout.tree()
    .size       [ 360, @height / 2  - 50 ]
    .separation (a, b) -> (if a.parent == b.parent then 1 else 2) / if a.depth > 0 then a.depth else 1

  @heatmap = d3.scale.linear()
    .domain [ 0.0, 0.25, 0.5, 0.75, 1.0 ]
    #.range  [ "#2c7bb6", "#abd9e9", "#ffffbf", "#fdae61", "#d7191c" ]
    .range  [ "#d7191c","#fdae61","#ffffbf","#a6d96a","#1a9641" ]

  xtree = this

  @translate  = (d) -> "rotate( #{ d.x } ) translate( #{ d.y } )"
  @stroke     = (d) -> if d.id in xtree.highlight then 'black' else ''

  _.extend this, cfg



  #-------------------------------------------------------------------------------

  @draw = (root) ->

    xtree = this

    root.x0 = 0
    root.y0 = 0

    if @position?
      @position @g
    else
      @g.attr 'transform', "translate( #{ @width / 2 }, #{ @height / 2 })"

    @g
      .selectAll '.link'
      .remove()

    @g
      .selectAll '.node'
      .remove()


    nodes = @tree.nodes root
    links = @tree.links nodes


    # fixed depth

    nodes.forEach (d) -> d.y = d.depth * xtree.depth

    link = @g
            .selectAll '.link'
            .data links

    enter = link
            .enter()
            .append 'path'
              .attr 'class',        'link'
              .attr 'd',            @diagonal
              .attr 'stroke',       (d) -> if d.source.id in xtree.highlight and d.target.id in xtree.highlight then "black" else "#ccc"
              .attr 'stroke-width', (d) -> if d.source.id in xtree.highlight and d.target.id in xtree.highlight then '3px' else '1.5px'



    node = @g
            .selectAll '.node'
            .data nodes, (d) -> return d.id || (d.id = ++xtree.idx)

    enter = node
              .enter()
              .append 'g'
                .attr 'class',      'node'
                .attr 'transform',  xtree.translate
                .attr 'id',         (d) -> "node_#{d.id}"

    enter
      .append 'circle'

        .attr 'r', 30

        .attr 'stroke',       xtree.stroke
        .attr 'stroke-width', (d) -> if d.id in xtree.highlight then '3px' else '1.5px'
        .attr 'fill',         (d) ->
          if xtree.colour?
            return xtree.colour d
          else if d.parent == null or d.visits == 0
            '#ccc'
          else
            xtree.heatmap d.score / d.visits



  return

