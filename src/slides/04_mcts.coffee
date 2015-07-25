#-------------------------------------------------------------------------------
# MCTS state

XOXState = (cpy) ->


  # data

  @player     = 'X'
  @board      = [ ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ' ]
  @text       = ""

  @scoreline  = []
  @highlight  = []
  @moves      = []

  if cpy? and cpy.board?
    @player     = cpy.player
    @board[ i ] = e for e, i in cpy.board



  # MCTS interface

  @clone = ->

    new XOXState this


  @apply = ( pos ) ->

    @board[ pos ] = @player
    @player = if @player is 'X' then 'O' else 'X'


  @actions = ->

    score = @score 'X'
    return [] if score isnt 0.5

    a = []
    for e, i in @board
      a.push i if e is ' '

    return a


  @score = ( player ) ->

    @scoreline = []

    for l in [ [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6] ]
      if @board[ l[0] ] == @board[ l[1] ] == @board[ l[2] ] and @board[ l[0] ] != ' '
        @scoreline = l
        return if @board[ l[0] ] == player then 1.0 else 0.0

    return 0.5


  # rendering

  @drawSVG = ->

    svg = $ "#mcts svg"

    board = d3.select svg[0]

    board
      .selectAll '#board use'
      .remove()

    state = @text
    colour = "black"

    if @actions().length == 0

      score = @score 'X'

      if score == 1
        state = "Win"
        colour = "green"
      else if score is 0
        state = "Lose"
        colour = "red"
      else
        state = "Draw"
      #   colour = "#e5e500"

    board
      .select '#board text'
      .text state
      .attr 'stroke', colour
      .attr 'fill', colour

    p1 = {x:0,y:0}
    p2 = {x:0,y:0}
    d  = {x:0,y:0}

    if @scoreline.length > 0

      p1.x = ( @scoreline[0] % 3 ) * 100 + 50
      p1.y = Math.floor( @scoreline[0] / 3 ) * 100 + 50
      p2.x = ( @scoreline[2] % 3 ) * 100 + 50
      p2.y = Math.floor( @scoreline[2] / 3 ) * 100 + 50

      d.x = ( p2.x - p1.x ) / 4
      d.y = ( p2.y - p1.y ) / 4

      p1.x -= d.x
      p1.y -= d.y

      p2.x += d.x
      p2.y += d.y


    board
      .select '#board #win line'
      .attr 'x1', p1.x
      .attr 'y1', p1.y
      .attr 'x2', p2.x
      .attr 'y2', p2.y
      .attr 'stroke', if state == "Win" then "green" else "Red"


    for el, idx in @board

      pos  = board.select "#p#{idx}"
      use = null

      # if idx in @scoreline
      #   pos.append( 'use' ).attr 'xlink:href', '#score'
      #else
      if idx in @highlight
        if el is 'O'
          pos.append( 'use' ).attr 'xlink:href', '#highlight_o'
        else
          pos.append( 'use' ).attr 'xlink:href', '#highlight_x'

      if el is 'X'
        pos.append 'use'
          .attr 'xlink:href', '#cross'
          .attr 'stroke', if idx in @moves then 'black' else '#888'

      else if el is 'O'
        pos.append( 'use' )
          .attr 'xlink:href', '#nought'
          .attr 'stroke', if idx in @moves then 'black' else '#888'



  return


#-------------------------------------------------------------------------------

new Slide

  id: "mcts"

  onShow: (e) ->

    @xox  = new XOXState
    @mcts = new MCTS
    @mcts.init @xox

    @stop = false

    # center board

    svg   = $ "#mcts svg"
    root  = d3.select svg[0]
    cx    = svg.width() / 2
    cy    = svg.height() / 2
    scale = 2

    root.select( '#tree > *' ).remove()
    root.select( '#iter' ).attr 'display', 'none'
    root.select( '#iter > text' ).text "Iteration 1"
    root.select( '#board2' ).attr 'display', 'none'

    root
      .select '#board'
      .attr 'transform', "translate( #{ cx - 150 * scale }, #{ cy - 150 * scale } ) scale( #{ scale })"

    # draw

    @xox.drawSVG()


  onHide: (e) ->



  onFragementShow: (e) ->

    slide = this
    svg   = $ "#mcts svg"
    root  = d3.select svg[0]
    cx    = svg.width() / 2
    cy    = svg.height() / 2

    switch e.fragment.id


      when "xox_smartmoves"

        @xox.highlight = [0,1,4]
        @xox.drawSVG()


      when "xox_pickone"

        @mcts.step()
        @mcts.curState.highlight = [ @mcts.curNode.action ]
        @mcts.curState.moves = [ @mcts.curNode.action ]
        @mcts.curState.drawSVG()


      when "xox_transition1"

        #  board top left

        root
          .select '#board'
          .transition()
            .duration 500
            .attr 'transform', "translate( 0,0 ) scale(0.75)"

        setTimeout ( -> Reveal.nextFragment() ), 500



      when "xox_playtoend"

        @tree = new Tree
          g      : root.select '#tree'
          width  : svg.width()
          height : svg.height()

        @tree.highlight = []
        @tree.draw @mcts.root


        play = ->
          finished = slide.mcts.step()
          slide.mcts.curState.drawSVG()

          if finished
            slide.tree.draw slide.mcts.root

            root.select '#iter'
              .attr 'display', 'block'
              .attr 'transform', (d) -> "translate( #{ cx }, #{ cy + 200 } )"
              .attr 'text-anchor', 'middle'

          else
            setTimeout play, 100

        setTimeout play, 100

        # TODO: # iteration count


      when "xox_first9"

        @mcts.tick() for i in [ 1..8 ]
        @tree.highlight = []
        @tree.draw @mcts.root

        root.select '#iter > text'
          .text @mcts.iteration
          .attr 'text-anchor', 'end'

        root.select '#iter'
          .transition()
            .duration 500
            .attr   'transform', (d) -> "translate( #{ svg.width() }, #{ svg.height() - 30 } )"

        # hack in animation

        @tree.g
          .selectAll '.node'
          .attr 'transform', (d) -> "rotate( #{ 180 } ) translate( #{ d.y } )"
          .transition()
            .duration 500
            .attrTween "transform", (d) -> d3.interpolateString "rotate(#{ 180 }) translate( #{ d.y } )", "rotate( #{ d.x } ) translate( #{ d.y } )"

        @tree.g
          .selectAll '.link'

          .attr 'd', (d) ->
            slide.tree.diagonal
              source: { x: d.source.x, y: d.source.y }
              target: { x: d.source.x, y: d.source.y }

          .transition()
            .delay 200
            .duration 300
            .attr 'd', (d) ->
              slide.tree.diagonal
                source: { x: d.source.x, y: d.source.y }
                target: { x: d.target.x, y: d.target.y }


        @xox.highlight = []
        @xox.drawSVG()


      when "xox_select"

        @mcts.step()
        @mcts.step()

        # add current nodes

        @mcts.curState.highlight = []
        @mcts.curState.moves     = []
        @tree.highlight          = [0]

        node = @mcts.curNode

        while node != null

          @tree.highlight.push node.id
          @mcts.curState.highlight.push node.action
          @mcts.curState.moves.push node.action

          node = node.parent

        @mcts.curState.drawSVG()
        @tree.draw @mcts.root

        root.select '#iter > text'
          .text @mcts.iteration
          .attr 'text-anchor', 'end'



      when "xox_continue"

        play = ->

          slide.mcts.step()

          # add current nodes

          slide.mcts.curState.highlight = []
          slide.mcts.curState.moves     = []
          slide.tree.highlight          = [0]

          node = slide.mcts.curNode

          while node != null
            slide.tree.highlight.push node.id
            slide.mcts.curState.highlight.push node.action
            slide.mcts.curState.moves.push node.action
            node = node.parent

          slide.mcts.curState.drawSVG()
          slide.tree.draw slide.mcts.root

          root.select '#iter > text'
            .text slide.mcts.iteration

          setTimeout play, 100 if not slide.stop

        setTimeout play, 100


      when "xox_stop"

        @stop = true

        highlight = ->

          root
            .select '#board'
            .transition()
              .duration 500
              .attr 'transform', "scale(0)"

          root
            .selectAll '.link'
            .attr 'stroke',       "#ccc"
            .attr 'stroke-width', "1.5px"
            .attr 'stroke-opacity', "0.7"

          root
            .selectAll '#tree circle'
            .attr 'stroke', ''
            .attr 'fill',   (d) ->

                if d.parent? and not d.parent.parent
                  return d3.select( this ).attr "fill"
                else
                  "whitesmoke"

            .attr 'fill-opacity', (d) -> if d.parent? and not d.parent.parent  then "1.0" else "0.7"

        setTimeout highlight, 500


      when "xox_rank"

        nodes = _.sortBy @mcts.root.children, (c) -> - c.score / c.visits

        move = _.first(nodes).action

        @xox.apply move
        @xox.moves = [ move ]
        @xox.highlight = [ move ]
        @xox.drawSVG()

        root
          .selectAll '#tree g'
          .filter (d) -> return not d.parent? or d.parent.parent
          .remove()

        root
          .selectAll '.link'
          .remove()

        separation = 80

        root
          .selectAll '#tree g'
          .transition()
            .duration 500
            .attr 'class',      (d) -> if _.indexOf( nodes, d) == 0 then 'topnode' else ''
            .attr 'transform',  (d) ->  "translate( 0 , #{ _.indexOf( nodes, d ) * separation - 4.5 * separation } )"

        root
          .selectAll '#tree g'
          .append 'text'
            .attr 'class', 'xox_right'
            .attr 'transform', (d) -> "translate( 2000, 17 )"
            .text (d) -> ( d.score / d.visits ).toFixed 2
            .transition()
              .delay 500
              .duration 500
              .attr 'transform', (d) -> "translate( 50, 17 )"

        root
          .selectAll '#tree g'
          .append 'text'
            .attr 'class', 'xox_left'
            .attr 'transform', (d) -> "translate( -2000, 17 )"
            .text (d) -> d.visits
            .transition()
              .delay 500
              .duration 500
              .attr 'transform', (d) -> "translate( -55, 17 )"

      when "xox_move"

        @xox.drawSVG()

        root
          .select '#tree'
          .transition()
            .duration 500
            .attr 'transform', (d) -> "translate( #{ cx - 300 }, #{ cy } )"

        scale = 1.5

        root
          .select '#board'
          .attr 'transform', (d) -> "translate( #{ cx + 150 }, #{ cy } ) scale(0)"
          .transition()
            .delay 500
            .ease 'elastic'
            .duration 500
            .attr 'transform', (d) -> "translate( #{ cx }, #{ cy - 300 * scale / 2 } ) scale( #{ scale })"

        root
          .select '.topnode'
          .insert 'rect',         ':first-child'
            .attr 'transform',    "translate( 20,25 ) scale(0)"
            .attr 'width',        400
            .attr 'height',       80
            .attr 'fill',         '#cca44a'
            .attr 'fill-opacity', 0.5
            .transition()
              .delay    500
              .ease     'elastic'
              .duration 500
              .attr     'transform', "translate( -160,-40 ) scale(1)"


      when "xox_tactics"

        root
          .select '#tree'
          .remove()

        scale  = 1.5
        margin = 100

        sy = cy
        ey = cy - 420 * scale / 2

        root.select '#iter'
          .attr 'display', 'none'

        root
          .select '#board'
          .attr 'transform', (d) -> "translate( #{ cx - 150 * scale - margin }, #{ sy } ) scale(0)"
          .transition()
            .ease 'elastic'
            .duration 500
            .attr 'transform', "translate( #{ cx - 300 * scale - margin }, #{ ey } ) scale( #{ scale })"

        root
          .select '#board2'
          .attr 'display', 'block'
          .attr 'transform', (d) -> "translate( #{ cx + margin + 150 * scale }, #{ sy } ) scale(0)"
          .transition()
            .ease 'elastic'
            .duration 500
            .attr 'transform', (d) -> "translate( #{ cx + margin }, #{ ey } ) scale( #{ scale })"

        @xox.board      = [' ','X',' ','O','O','X','X',' ',' ']
        @xox.moves      = [0,1,2,3,4,5,6,7,8]
        @xox.highlight  = [5]
        @xox.text       = "~70"
        @xox.drawSVG()


  onFragementHide: (e) ->

