#-------------------------------------------------------------------------------

new Slide

  id: 'implementation'

  onShow: (e) ->

    # @drawMap()

  onFragementHide: (e) ->

    svg   = $ "#implementation #arch"
    root  = d3.select svg[0]

    exec   = $ "#planexec"
    execr  = d3.select exec[0]

    execr.select '#arrow'
      .style 'display', 'none'

    root.select '#highlights'
      .selectAll 'path'
        .attr 'stroke', '#666666'
        .attr 'fill', '#666666'

    order = [
      "imp_snapshot"
      "imp_simulate"
      "imp_exec"
      "imp_delay"
    ]

    for frag in order
      break if frag is e.fragment.id
      @onFragementShow fragment: id: frag


  onFragementShow: (e) ->

    svg   = $ "#implementation #arch"
    root  = d3.select svg[0]

    exec   = $ "#planexec"
    execr  = d3.select exec[0]

    switch e.fragment.id

      when "imp_snapshot"

        setTimeout ( -> exec.css 'display', 'block' ), 1000

        root.selectAll '.sim'
          .attr 'stroke', 'red'
          .attr 'fill', 'red'

        root.select '#tree'
          .transition()
            .duration 250
            .attr 'opacity', '0'

      when "imp_simulate"

        execr.select '#red'
          .style 'display', 'block'
          .attr 'transform', 'matrix(1 0 0 1 100 70)'
          .transition()
            .duration 2000
            .ease 'linear'
            .attr 'transform', 'matrix(1 0 0 1 520 70)'

        root.selectAll '.run'
          .attr 'stroke', 'red'
          .attr 'fill', 'red'


      when "imp_exec"

        root.selectAll '.exec'
          .attr 'stroke', 'red'
          .attr 'fill', 'red'

      when "imp_delay"

        $( '#pegap' ).css 'display', 'block'

        execr.select '#arrow'
          .style 'display', 'block'


