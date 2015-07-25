#-------------------------------------------------------------------------------

new Slide

  id: "buckets"

  data: {
    children:[
      { children:[
        { children:[] }
        { children:[] }
        { children:[] }
      ] }
      { children:[
        { children:[] }
        { children:[] }
        { children:[] }
      ] }
      { children:[
        { children:[] }
        { children:[] }
        { children:[] }
      ] }
      { children:[
        { children:[] }
        { children:[] }
        { children:[] }
      ] }
      { children:[
        { children:[] }
        { children:[] }
        { children:[] }
      ] }
      { children:[
        { children:[] }
        { children:[] }
        { children:[] }
      ] }
      { children:[
        { children:[] }
        { children:[] }
        { children:[] }
      ] }
      { children:[
        { children:[] }
        { children:[] }
        { children:[] }
      ] }
    ]
  }


  #-------------------------------------------------------------------------------

  onReady: (e) ->

    slide = this
    svg   = $ '#buckets svg'
    root  = d3.select svg[0]

    @tree = new Tree
      g         : root.select '#tree'
      width     : svg.width()
      height    : svg.height()
      highlight : [1] #,4,7,10]
      depth     : 150

      colour    : (d) -> if d.id in slide.tree.highlight then "coral" else "lightsteelblue"
      stroke    : (d) -> if d.id in slide.tree.highlight then "red" else "steelblue"
      position  : (g) -> g.attr 'transform', "translate( 440, 280 ) scale(0.4)"


    root.selectAll '.rule'
      .each -> this.__transition__.active = 0 if this.__transition__?
      .attr 'display', 'none'

    root.selectAll '.label'
      .each -> this.__transition__.active = 0 if this.__transition__?
      .attr 'opacity', 0

  #-------------------------------------------------------------------------------

  onFragementHide: (e) ->

    slide = this
    svg   = $ '#buckets svg'
    root  = d3.select svg[0]

    switch e.fragment.id

      when "b_arrange"

        pos = [
          "matrix(1 0 0 1 97.63546798029554 156.65024630541944)"
          "matrix(1 0 0 1 49.753694581281934 40.34482758620838)"
          "matrix(1 0 0 1 56.403940886700184 216.226600985224)"
          "matrix(1 0 0 1 216.8965517241381 112.1674876847293)"
          "matrix(1 0 0 1 138.42364532019704 262.6108374384248)"
          "matrix(1 0 0 1 260.34482758620743 210.44334975369745)"
          "matrix(1 0 0 1 310 64.2857142857149)"
        ]

        root.selectAll '.rule'
          .each -> this.__transition__.active = 0 if this.__transition__?
          .attr 'transform', (d) -> id = this.id.replace "r", ""; pos[ id - 1 ]

        root.selectAll '.label'
          .each -> this.__transition__.active = 0 if this.__transition__?
          .attr 'opacity', 0

      when "b_predicates"

        root.select '#textroot'
          .each -> this.__transition__.active = 0 if this.__transition__?
          .attr 'transform', "translate(0,0)"

        root.selectAll '.pred'
          .each -> this.__transition__.active = 0 if this.__transition__?
          .attr 'opacity', 0

        @onFragementShow fragment: id: "b_arrange"

      when "b_root"

        root.select '#tree'
          .attr 'display', "none"

        root.select '#bucket1'
          .attr 'display', "none"

        root.select '#bucket2'
          .attr 'display', "none"

      when "b_node1"

        @onFragementShow fragment: id: "b_root"

      when "b_node2"

        @onFragementShow fragment: id: "b_node1"


  #-------------------------------------------------------------------------------

  onShow: (e) ->

    svg   = $ '#buckets svg'
    root  = d3.select svg[0]

    i = 0
    root.selectAll '.rule'
      .transition()
        .delay (d) -> ++i * 50
        .attr 'display', 'block'


  #-------------------------------------------------------------------------------

  onFragementShow: (e) ->

    slide = this
    svg   = $ '#buckets svg'
    root  = d3.select svg[0]

    switch e.fragment.id

      when "b_arrange"

        root.selectAll '.rule'
          .transition()
            .duration 1000
            .attr 'transform', (d) ->
              id = this.id.replace "r", ""
              offset = if id > 3 then 90 else 30
              "matrix(1 0 0 1 220 #{ offset + id * 30 })"

        root.selectAll '.label'
          .transition()
            .delay 500
            .duration 500
            .attr 'opacity', 1


      when "b_predicates"

        root.select '#textroot'
          .transition()
            .duration 500
            .attr 'transform', "translate(-75,0)"

        root.selectAll '.pred'
          .transition()
            .delay 250
            .duration 500
            .attr 'opacity', 1

        root.selectAll '.rule'
          .transition()
            .duration 500
            .attr 'transform', (d) ->
              id = this.id.replace "r", ""
              offset = if id > 3 then 120 else 60
              "matrix(1 0 0 1 250 #{ offset + id * 30 })"

      when "b_root"

        @tree.highlight = [1]

        root.select '#tree'
          .attr 'display', "block"

        root.select '#textroot'
          .transition()
            .duration 500
            .attr 'transform', "translate(-50,20)scale(0.7)"

        setTimeout ( -> slide.tree.draw slide.data ), 500


      when "b_node1"

        @tree.highlight = [1,22]
        @tree.draw @data

        root.select '#bucket1'
          .attr 'display', "block"

        root.select '#bucket2'
          .attr 'display', "none"

      when "b_node2"

        @tree.highlight = [1,22,25]
        @tree.draw @data

        root.select '#bucket1'
          .attr 'display', "none"

        root.select '#bucket2'
          .attr 'display', "block"
