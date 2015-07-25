#-------------------------------------------------------------------------------

gNextID = 0;

MCTSNode = (d) ->

  @id         = gNextID++
  @visits     = 0
  @score      = 0
  @player     = 'X'
  @action     = null
  @parent     = null
  @untried    = []

  _.extend this, d

  return


#-------------------------------------------------------------------------------

MCTS = (state) ->

  @uctk  = 0.1
  @iteration = 0

  @state =
    player    : 1
    clone     : -> return this
    apply     : (action) ->
    actions   : -> return []
    score     : (player) -> return 0

  @root = new MCTSNode


  #-------------------------------------------------------------------------------

  @mostPromising = ->
    return null if not @root? or not @root.children? or @root.children.length == 0
    _.max @root.children, (c) -> c.score / c.visits

  @init = (state) ->

    @state = state
    @root = new MCTSNode
    @root.untried = state.actions()

    @curNode  = null
    @curState = null
    @defaultPolicy = false



  @defaultPolicy = false
  @curNode  = null
  @curState = null

  @step = ->

    # default policy

    if @defaultPolicy

      actions = @curState.actions()

      if actions.length > 0
        @curState.apply actions[ Math.floor Math.random() * actions.length ]
        return false


      # propagate score

      while @curNode != null
        @curNode.visits = @curNode.visits + 1
        @curNode.score += @curState.score @curNode.player
        @curNode = @curNode.parent

      @defaultPolicy = false


      return true



    # begin

    if not @curNode?

      @iteration++

      @curState       = @state.clone()
      @curNode        = @root
      @defaultPolicy  = false


    # select

    if @curNode.untried.length == 0 and @curNode.children? and @curNode.children.length > 0

      node = @curNode

      children = _.map @curNode.children, (c) -> { node: c, score: c.score / c.visits + 0.5 * Math.sqrt( 2 * Math.log( node.visits / c.visits ) ) }
      child = _.last _.sortBy children, 'score'

      @curState.apply child.node.action
      @curNode  = child.node

      return false


    # expand

    if @curNode.untried.length > 0

      # remove random action from list

      idx  = Math.floor Math.random() * @curNode.untried.length
      move = @curNode.untried.splice( idx, 1 )[0]


      # apply

      player = @curState.player
      @curState.apply move


      # add new node to tree

      newnode = new MCTSNode
        visits    : 0
        score     : 0
        player    : player
        action    : move
        parent    : @curNode
        untried   : @curState.actions()

      @curNode.children = [] unless @curNode.children?
      @curNode.children.push newnode
      @curNode = newnode

      @defaultPolicy = true

      return false

  @tick = ->
    tick = 0
    tick += 1 while not @step()

  return


