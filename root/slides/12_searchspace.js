var SSNode, gSSTree;

SSNode = function(p, d) {
  var c, j, len1, ref;
  this.depth = p != null ? p.depth + 1 : 0;
  this.children = [];
  if ((d != null) && (d.children != null)) {
    ref = d.children;
    for (j = 0, len1 = ref.length; j < len1; j++) {
      c = ref[j];
      this.children.push(new SSNode(this, c));
    }
  }
  this.expand = function() {
    var i, k, len, ref1, results;
    if (this.depth > 4) {
      return;
    }
    len = 8 - this.depth * 2;
    this.children = [];
    results = [];
    for (i = k = 1, ref1 = len; 1 <= ref1 ? k <= ref1 : k >= ref1; i = 1 <= ref1 ? ++k : --k) {
      results.push(this.children.push(new SSNode(this)));
    }
    return results;
  };
  this.findPuck = function(b) {
    var db, dt, k, len2, ref1;
    if (this.depth === 5) {
      if (b == null) {
        b = this;
      } else if (this.x / 4 - 45 > -40) {
        db = Math.abs((b.x / 4) - 45);
        dt = Math.abs((this.x / 4) - 45);
        if (db > dt) {
          b = this;
        }
      }
    } else if (this.children != null) {
      ref1 = this.children;
      for (k = 0, len2 = ref1.length; k < len2; k++) {
        c = ref1[k];
        b = c.findPuck(b);
      }
    }
    return b;
  };
};

gSSTree = {
  children: [
    {
      children: [
        {
          children: [
            {}, {}, {
              children: [
                {
                  children: [{}, {}]
                }, {}
              ]
            }, {
              children: [
                {}, {
                  children: [{}, {}]
                }
              ]
            }
          ]
        }, {
          children: [
            {}, {}, {
              children: [
                {
                  children: [{}, {}]
                }, {
                  children: [{}, {}]
                }
              ]
            }, {
              children: [
                {}, {
                  children: [{}, {}]
                }
              ]
            }
          ]
        }, {
          children: [{}, {}, {}, {}]
        }, {}, {
          children: [
            {}, {
              children: [
                {
                  children: [{}, {}]
                }, {
                  children: [{}, {}]
                }
              ]
            }, {
              children: [
                {
                  children: [{}, {}]
                }, {
                  children: [{}, {}]
                }
              ]
            }, {
              children: [{}, {}]
            }
          ]
        }, {
          children: [
            {
              children: [{}, {}]
            }, {
              children: [
                {
                  children: [{}, {}]
                }, {}
              ]
            }, {}, {
              children: [{}, {}]
            }
          ]
        }
      ]
    }, {}, {
      children: [
        {}, {
          children: [
            {}, {}, {
              children: [
                {}, {
                  children: [{}, {}]
                }
              ]
            }, {
              children: [
                {
                  children: [{}, {}]
                }, {
                  children: [{}, {}]
                }
              ]
            }
          ]
        }, {
          children: [
            {
              children: [
                {
                  children: [{}, {}]
                }, {
                  children: [{}, {}]
                }
              ]
            }, {}, {}, {}
          ]
        }, {}, {}, {}
      ]
    }, {}, {}, {}, {
      children: [
        {
          children: [
            {
              children: [
                {}, {
                  children: [{}, {}]
                }
              ]
            }, {}, {}, {
              children: [
                {}, {
                  children: [{}, {}]
                }
              ]
            }
          ]
        }, {}, {}, {}, {
          children: [
            {}, {}, {
              children: [
                {
                  children: [{}, {}]
                }, {
                  children: [{}, {}]
                }
              ]
            }, {}
          ]
        }, {}
      ]
    }, {}
  ]
};

new Slide({
  id: "searchspace",
  cur_node: null,
  ratio: 120 / 360,
  turn: 15,
  createTree: function() {
    return this.data = new SSNode(null, gSSTree);
  },
  doCollapse: function() {
    var node, parent, slide;
    slide = this;
    node = this.cur_node;
    parent = this.cur_node.parent;
    this.root.select(".link_" + node.id).remove();
    this.root.select("#np_" + parent.id + " > circle").transition().delay(100).duration(200).attr('r', '50').each("end", function() {
      return slide.root.select("#np_" + parent.id + " > circle").transition().delay(0).duration(100).attr('r', '0');
    });
    return this.root.select('.node_action').transition().duration(500).attr('transform', "rotate( " + (slide.ratio * parent.x - 90 - slide.turn) + " ) translate( " + parent.y + " )").each("end", function() {
      slide.cur_node = slide.cur_node.parent;
      if ((slide.cur_node != null) && (slide.cur_node.parent != null) && (slide.cur_node.parent.parent != null)) {
        return setTimeout((function() {
          return slide.doCollapse();
        }), 100);
      } else {
        Reveal.nextFragment();
        return slide.root.select('.node_action > circle').transition().duration(2000).attr('fill', '#93C572').attr('stroke', '#568203');
      }
    });
  },
  doExpand: function() {
    var c, e, j, k, len1, len2, nodes, ref, ref1, slide;
    if (this.expand.length === 0) {
      return;
    }
    slide = this;
    nodes = [];
    ref = this.expand;
    for (j = 0, len1 = ref.length; j < len1; j++) {
      e = ref[j];
      if (Math.random() < 0.5) {
        e.expand();
      }
      if (e.children != null) {
        ref1 = e.children;
        for (k = 0, len2 = ref1.length; k < len2; k++) {
          c = ref1[k];
          nodes.push(c);
        }
      }
    }
    setTimeout((function() {
      return slide.doExpand();
    }), 500);
    this.tree.draw(this.data);
    return this.expand = nodes;
  },
  doSetup: function() {
    var slide, svg;
    slide = this;
    svg = $('#searchspace svg');
    this.root = d3.select(svg[0]);
    return this.tree = new Tree({
      g: this.root.select('g'),
      width: svg.width(),
      height: svg.height(),
      highlight: [],
      depth: 200,
      colour: function(d) {
        return "lightsteelblue";
      },
      stroke: function(d) {
        return "steelblue";
      },
      position: function() {},
      diagonal: d3.svg.diagonal.radial().projection(function(d) {
        return [d.y, (slide.ratio * d.x - slide.turn) / 180 * Math.PI];
      }),
      tree: d3.layout.tree().size([360, svg.height() / 2 - 50]).separation(function(a, b) {
        return (a.parent === b.parent ? 1 : 2) / (a.depth > 0 ? a.depth : 1);
      }),
      translate: function(d) {
        return "rotate( " + (slide.ratio * d.x - 90 - slide.turn) + " ) translate( " + d.y + " )";
      }
    });
  },
  onFragementHide: function(e) {
    switch (false) {
      case !(e.fragment.id === "ss_run" || e.fragment.id === "ss_action"):
        this.root.select('g').selectAll('path').remove();
        return this.root.select('g').selectAll('g').remove();
    }
  },
  onReady: function(e) {
    this.doSetup();
    this.createTree();
    return this.tree.draw(this.data);
  },
  onFragementShow: function(e) {
    var d, diagonal, r, results, slide;
    slide = this;
    switch (e.fragment.id) {
      case "ss_action":
        d = this.data.findPuck(null);
        r = d;
        this.cur_node = d;
        diagonal = d3.svg.diagonal.radial().source(function(d) {
          return {
            x: d.parent.x,
            y: d.parent.y
          };
        }).target(function(d) {
          return {
            x: d.x,
            y: d.y
          };
        }).projection(function(d) {
          return [d.y, (slide.ratio * d.x - slide.turn) / 180 * Math.PI];
        });
        while (d) {
          if (d.parent != null) {
            this.root.select('g').append('path').attr('class', "link link_" + d.id).attr('d', diagonal(d)).attr('stroke', function(d) {
              return "red";
            }).attr('stroke-width', function(d) {
              return "5px";
            }).attr('stroke-opacity', 0).transition().delay(1200 + 200 * (4 - d.depth)).duration(10).attr('stroke-opacity', 1);
          }
          d = d.parent;
        }
        d = r;
        this.root.select('g').append('g').attr('class', 'node_action').attr('transform', "rotate( " + (slide.ratio * d.x - 90 - slide.turn) + " ) translate( " + d.y + " )").append('circle').attr('r', '30').attr('stroke', 'red').attr('stroke-width', '3px').attr('fill', 'coral').transition().attr('r', '60').duration(1000).ease('elastic');
        d = r;
        d = d.parent;
        results = [];
        while (d) {
          this.root.select('g').append('g').attr('id', "np_" + d.id).attr('transform', "rotate( " + (slide.ratio * d.x - 90 - slide.turn) + " ) translate( " + d.y + " ) scale(1)").append('circle').attr('r', '30').attr('stroke', 'red').attr('stroke-width', '3px').attr('fill', '#FF8080').attr('stroke-opacity', 0).attr('fill-opacity', 0).transition().delay(1000 + 200 * (4 - d.depth)).duration(200).attr('stroke-opacity', 1).attr('fill-opacity', 1);
          results.push(d = d.parent);
        }
        return results;
        break;
      case "ss_collapse":
        return this.doCollapse();
    }
  }
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNsaWRlcy8xMl9zZWFyY2hzcGFjZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR0EsSUFBQTs7QUFBQSxNQUFBLEdBQVMsU0FBQyxDQUFELEVBQUcsQ0FBSDtBQUVQLE1BQUE7RUFBQSxJQUFDLENBQUEsS0FBRCxHQUFlLFNBQUgsR0FBVyxDQUFDLENBQUMsS0FBRixHQUFVLENBQXJCLEdBQTRCO0VBQ3hDLElBQUMsQ0FBQSxRQUFELEdBQVk7RUFFWixJQUFHLFdBQUEsSUFBTyxvQkFBVjtBQUNFO0FBQUEsU0FBQSx1Q0FBQTs7TUFDRSxJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsQ0FBbUIsSUFBQSxNQUFBLENBQU8sSUFBUCxFQUFhLENBQWIsQ0FBbkI7QUFERixLQURGOztFQUlBLElBQUMsQ0FBQSxNQUFELEdBQVUsU0FBQTtBQUVSLFFBQUE7SUFBQSxJQUFVLElBQUMsQ0FBQSxLQUFELEdBQVMsQ0FBbkI7QUFBQSxhQUFBOztJQUNBLEdBQUEsR0FBTSxDQUFBLEdBQUksSUFBQyxDQUFBLEtBQUQsR0FBUztJQUVuQixJQUFDLENBQUEsUUFBRCxHQUFZO0FBRVo7U0FBUyxtRkFBVDttQkFDRSxJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsQ0FBbUIsSUFBQSxNQUFBLENBQU8sSUFBUCxDQUFuQjtBQURGOztFQVBRO0VBVVYsSUFBQyxDQUFBLFFBQUQsR0FBWSxTQUFDLENBQUQ7QUFFVixRQUFBO0lBQUEsSUFBRyxJQUFDLENBQUEsS0FBRCxLQUFVLENBQWI7TUFFRSxJQUFPLFNBQVA7UUFFRSxDQUFBLEdBQUksS0FGTjtPQUFBLE1BSUssSUFBRyxJQUFDLENBQUEsQ0FBRCxHQUFLLENBQUwsR0FBUyxFQUFULEdBQWMsQ0FBQyxFQUFsQjtRQUVILEVBQUEsR0FBSyxJQUFJLENBQUMsR0FBTCxDQUFTLENBQUUsQ0FBQyxDQUFDLENBQUYsR0FBTSxDQUFSLENBQUEsR0FBYyxFQUF2QjtRQUNMLEVBQUEsR0FBSyxJQUFJLENBQUMsR0FBTCxD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ZGVzLzEyX3NlYXJjaHNwYWNlLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsiXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5TU05vZGUgPSAocCxkKSAtPlxuXG4gIEBkZXB0aCAgICA9IGlmIHA/IHRoZW4gcC5kZXB0aCArIDEgZWxzZSAwXG4gIEBjaGlsZHJlbiA9IFtdXG5cbiAgaWYgZD8gYW5kIGQuY2hpbGRyZW4/XG4gICAgZm9yIGMgaW4gZC5jaGlsZHJlblxuICAgICAgQGNoaWxkcmVuLnB1c2ggbmV3IFNTTm9kZSB0aGlzLCBjXG5cbiAgQGV4cGFuZCA9IC0+XG5cbiAgICByZXR1cm4gaWYgQGRlcHRoID4gNFxuICAgIGxlbiA9IDggLSBAZGVwdGggKiAyXG5cbiAgICBAY2hpbGRyZW4gPSBbXVxuXG4gICAgZm9yIGkgaW4gWyAxLi5sZW4gXVxuICAgICAgQGNoaWxkcmVuLnB1c2ggbmV3IFNTTm9kZSB0aGlzXG5cbiAgQGZpbmRQdWNrID0gKGIpIC0+XG5cbiAgICBpZiBAZGVwdGggPT0gNVxuXG4gICAgICBpZiBub3QgYj9cblxuICAgICAgICBiID0gdGhpc1xuXG4gICAgICBlbHNlIGlmIEB4IC8gNCAtIDQ1ID4gLTQwXG5cbiAgICAgICAgZGIgPSBNYXRoLmFicyAoIGIueCAvIDQgKSAtIDQ1XG4gICAgICAgIGR0ID0gTWF0aC5hYnMgKCBAeCAvIDQgKSAtIDQ1XG4gICAgICAgIGIgPSB0aGlzIGlmIGRiID4gZHRcblxuICAgIGVsc2UgaWYgQGNoaWxkcmVuP1xuICAgICAgYiA9IGMuZmluZFB1Y2sgYiBmb3IgYyBpbiBAY2hpbGRyZW5cblxuICAgIHJldHVybiBiXG5cblxuICByZXR1cm5cblxuXG5nU1NUcmVlID0ge2NoaWxkcmVuOlt7Y2hpbGRyZW46W3tjaGlsZHJlbjpbe30se30se2NoaWxkcmVuOlt7Y2hpbGRyZW46W3t9LHt9XX0se31dfSx7Y2hpbGRyZW46W3t9LHtjaGlsZHJlbjpbe30se31dfV19XX0se2NoaWxkcmVuOlt7fSx7fSx7Y2hpbGRyZW46W3tjaGlsZHJlbjpbe30se31dfSx7Y2hpbGRyZW46W3t9LHt9XX1dfSx7Y2hpbGRyZW46W3t9LHtjaGlsZHJlbjpbe30se31dfV19XX0se2NoaWxkcmVuOlt7fSx7fSx7fSx7fV19LHt9LHtjaGlsZHJlbjpbe30se2NoaWxkcmVuOlt7Y2hpbGRyZW46W3t9LHt9XX0se2NoaWxkcmVuOlt7fSx7fV19XX0se2NoaWxkcmVuOlt7Y2hpbGRyZW46W3t9LHt9XX0se2NoaWxkcmVuOlt7fSx7fV19XX0se2NoaWxkcmVuOlt7fSx7fV19XX0se2NoaWxkcmVuOlt7Y2hpbGRyZW46W3t9LHt9XX0se2NoaWxkcmVuOlt7Y2hpbGRyZW46W3t9LHt9XX0se31dfSx7fSx7Y2hpbGRyZW46W3t9LHt9XX1dfV19LHt9LHtjaGlsZHJlbjpbe30se2NoaWxkcmVuOlt7fSx7fSx7Y2hpbGRyZW46W3t9LHtjaGlsZHJlbjpbe30se31dfV19LHtjaGlsZHJlbjpbe2NoaWxkcmVuOlt7fSx7fV19LHtjaGlsZHJlbjpbe30se31dfV19XX0se2NoaWxkcmVuOlt7Y2hpbGRyZW46W3tjaGlsZHJlbjpbe30se31dfSx7Y2hpbGRyZW46W3t9LHt9XX1dfSx7fSx7fSx7fV19LHt9LHt9LHt9XX0se30se30se30se2NoaWxkcmVuOlt7Y2hpbGRyZW46W3tjaGlsZHJlbjpbe30se2NoaWxkcmVuOlt7fSx7fV19XX0se30se30se2NoaWxkcmVuOlt7fSx7Y2hpbGRyZW46W3t9LHt9XX1dfV19LHt9LHt9LHt9LHtjaGlsZHJlbjpbe30se30se2NoaWxkcmVuOlt7Y2hpbGRyZW46W3t9LHt9XX0se2NoaWxkcmVuOlt7fSx7fV19XX0se31dfSx7fV19LHt9XX1cblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXG5uZXcgU2xpZGVcblxuICBpZCAgICAgICAgOiBcInNlYXJjaHNwYWNlXCJcbiAgY3VyX25vZGUgIDogbnVsbFxuICByYXRpbyAgICAgOiAxMjAgLyAzNjBcbiAgdHVybiAgICAgIDogMTVcblxuICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIGNyZWF0ZVRyZWU6IC0+XG5cbiAgICBAZGF0YSA9IG5ldyBTU05vZGUgbnVsbCwgZ1NTVHJlZVxuXG5cbiAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBkb0NvbGxhcHNlOiAtPlxuXG4gICAgc2xpZGUgICA9IHRoaXNcbiAgICBub2RlICAgID0gQGN1cl9ub2RlXG4gICAgcGFyZW50ICA9IEBjdXJfbm9kZS5wYXJlbnRcblxuICAgIEByb290XG4gICAgICAuc2VsZWN0IFwiLmxpbmtfI3sgbm9kZS5pZCB9XCJcbiAgICAgIC5yZW1vdmUoKVxuXG4gICAgQHJvb3Quc2VsZWN0IFwiI25wXyN7IHBhcmVudC5pZCB9ID4gY2lyY2xlXCJcbiAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgLmRlbGF5IDEwMFxuICAgICAgICAuZHVyYXRpb24gMjAwXG4gICAgICAgIC5hdHRyICdyJywgJzUwJ1xuICAgICAgICAuZWFjaCBcImVuZFwiLCAtPlxuXG4gICAgICAgICAgc2xpZGUucm9vdC5zZWxlY3QgXCIjbnBfI3sgcGFyZW50LmlkIH0gPiBjaXJjbGVcIlxuICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAuZGVsYXkgMFxuICAgICAgICAgICAgICAuZHVyYXRpb24gMTAwXG4gICAgICAgICAgICAgIC5hdHRyICdyJywgJzAnXG5cbiAgICBAcm9vdC5zZWxlY3QgJy5ub2RlX2FjdGlvbidcbiAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgLmR1cmF0aW9uIDUwMFxuICAgICAgICAuYXR0ciAndHJhbnNmb3JtJywgXCJyb3RhdGUoICN7IHNsaWRlLnJhdGlvICogcGFyZW50LnggLSA5MCAtIHNsaWRlLnR1cm4gfSApIHRyYW5zbGF0ZSggI3sgcGFyZW50LnkgfSApXCJcbiAgICAgICAgLmVhY2ggXCJlbmRcIiwgLT5cblxuICAgICAgICAgIHNsaWRlLmN1cl9ub2RlID0gc2xpZGUuY3VyX25vZGUucGFyZW50XG5cbiAgICAgICAgICBpZiBzbGlkZS5jdXJfbm9kZT8gYW5kIHNsaWRlLmN1cl9ub2RlLnBhcmVudD8gYW5kIHNsaWRlLmN1cl9ub2RlLnBhcmVudC5wYXJlbnQ/XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQgKCAtPiBzbGlkZS5kb0NvbGxhcHNlKCkgKSwgMTAwXG5cbiAgICAgICAgICBlbHNlXG5cbiAgICAgICAgICAgIFJldmVhbC5uZXh0RnJhZ21lbnQoKVxuXG4gICAgICAgICAgICBzbGlkZS5yb290LnNlbGVjdCAnLm5vZGVfYWN0aW9uID4gY2lyY2xlJ1xuICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgICAgLmR1cmF0aW9uIDIwMDBcbiAgICAgICAgICAgICAgICAuYXR0ciAnZmlsbCcsICcjOTNDNTcyJ1xuICAgICAgICAgICAgICAgIC5hdHRyICdzdHJva2UnLCAnIzU2ODIwMydcblxuICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIGRvRXhwYW5kOiAtPlxuXG4gICAgcmV0dXJuIGlmIEBleHBhbmQubGVuZ3RoIGlzIDBcblxuICAgIHNsaWRlID0gdGhpc1xuICAgIG5vZGVzID0gW11cblxuICAgIGZvciBlIGluIEBleHBhbmRcbiAgICAgIGUuZXhwYW5kKCkgaWYgTWF0aC5yYW5kb20oKSA8IDAuNVxuICAgICAgaWYgZS5jaGlsZHJlbj9cbiAgICAgICAgbm9kZXMucHVzaCBjIGZvciBjIGluIGUuY2hpbGRyZW5cblxuICAgIHNldFRpbWVvdXQgKCAtPiBzbGlkZS5kb0V4cGFuZCgpICksIDUwMFxuICAgIEB0cmVlLmRyYXcgQGRhdGFcblxuICAgICMgVE9ETzogdHJhbnNpdGlvblxuXG4gICAgQGV4cGFuZCA9IG5vZGVzXG5cblxuICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIGRvU2V0dXA6IC0+XG5cbiAgICBzbGlkZSAgID0gdGhpc1xuXG4gICAgc3ZnICAgPSAkICcjc2VhcmNoc3BhY2Ugc3ZnJ1xuICAgIEByb290ID0gZDMuc2VsZWN0IHN2Z1swXVxuXG4gICAgQHRyZWUgPSBuZXcgVHJlZVxuICAgICAgZyAgICAgICAgIDogQHJvb3Quc2VsZWN0ICdnJ1xuICAgICAgd2lkdGggICAgIDogc3ZnLndpZHRoKClcbiAgICAgIGhlaWdodCAgICA6IHN2Zy5oZWlnaHQoKVxuICAgICAgaGlnaGxpZ2h0IDogW11cbiAgICAgIGRlcHRoICAgICA6IDIwMFxuICAgICAgY29sb3VyICAgIDogKGQpIC0+IFwibGlnaHRzdGVlbGJsdWVcIlxuICAgICAgc3Ryb2tlICAgIDogKGQpIC0+IFwic3RlZWxibHVlXCJcbiAgICAgIHBvc2l0aW9uICA6IC0+XG4gICAgICBkaWFnb25hbCAgOiBkMy5zdmcuZGlhZ29uYWwucmFkaWFsKCkucHJvamVjdGlvbiAoZCkgLT4gWyBkLnksICggc2xpZGUucmF0aW8gKiBkLnggLSBzbGlkZS50dXJuICkgLyAxODAgKiBNYXRoLlBJIF1cbiAgICAgIHRyZWUgICAgICA6IGQzLmxheW91dC50cmVlKClcbiAgICAgICAgICAgICAgICAgICAgLnNpemUgICAgICAgWyAzNjAsIHN2Zy5oZWlnaHQoKSAvIDIgIC0gNTAgXVxuICAgICAgICAgICAgICAgICAgICAuc2VwYXJhdGlvbiAoYSwgYikgLT4gKGlmIGEucGFyZW50ID09IGIucGFyZW50IHRoZW4gMSBlbHNlIDIpIC8gaWYgYS5kZXB0aCA+IDAgdGhlbiBhLmRlcHRoIGVsc2UgMVxuICAgICAgdHJhbnNsYXRlIDogKGQpIC0+IFwicm90YXRlKCAjeyBzbGlkZS5yYXRpbyAqIGQueCAtIDkwIC0gc2xpZGUudHVybiB9ICkgdHJhbnNsYXRlKCAjeyBkLnkgfSApXCJcblxuXG4gICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgb25GcmFnZW1lbnRIaWRlOiAoZSkgLT5cblxuICAgIHN3aXRjaFxuXG4gICAgICB3aGVuIGUuZnJhZ21lbnQuaWQgaXMgXCJzc19ydW5cIiBvciBlLmZyYWdtZW50LmlkIGlzIFwic3NfYWN0aW9uXCJcblxuICAgICAgICBAcm9vdFxuICAgICAgICAgIC5zZWxlY3QgJ2cnXG4gICAgICAgICAgLnNlbGVjdEFsbCAncGF0aCdcbiAgICAgICAgICAucmVtb3ZlKClcblxuICAgICAgICBAcm9vdFxuICAgICAgICAgIC5zZWxlY3QgJ2cnXG4gICAgICAgICAgLnNlbGVjdEFsbCAnZydcbiAgICAgICAgICAucmVtb3ZlKClcblxuXG4gICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgb25SZWFkeTogKGUpIC0+XG5cbiAgICBAZG9TZXR1cCgpXG4gICAgQGNyZWF0ZVRyZWUoKVxuICAgIEB0cmVlLmRyYXcgQGRhdGFcblxuXG4gICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgb25GcmFnZW1lbnRTaG93OiAoZSkgLT5cblxuICAgIHNsaWRlID0gdGhpc1xuXG4gICAgc3dpdGNoIGUuZnJhZ21lbnQuaWRcblxuICAgICAgIyB3aGVuIFwic3NfcnVuXCJcblxuICAgICAgICAjIHNldFRpbWVvdXQgKCAtPlxuXG4gICAgICAgICMgICBzbGlkZS5kYXRhLmV4cGFuZCgpXG5cbiAgICAgICAgIyAgIHNsaWRlLmV4cGFuZCA9IFtdXG4gICAgICAgICMgICBzbGlkZS5leHBhbmQucHVzaCBjIGZvciBjIGluIHNsaWRlLmRhdGEuY2hpbGRyZW5cblxuICAgICAgICAjICAgc2xpZGUudHJlZS5kcmF3IHNsaWRlLmRhdGFcbiAgICAgICAgIyAgIHNldFRpbWVvdXQgKCAtPiBzbGlkZS5kb0V4cGFuZCgpICksIDUwMFxuXG4gICAgICAgICMgKSwgNTAwXG5cblxuICAgICAgd2hlbiBcInNzX2FjdGlvblwiXG5cbiAgICAgICAgZCA9IEBkYXRhLmZpbmRQdWNrIG51bGxcbiAgICAgICAgciA9IGRcblxuICAgICAgICBAY3VyX25vZGUgPSBkXG5cblxuICAgICAgICAjIGxpbmtzXG5cbiAgICAgICAgZGlhZ29uYWwgPSBkMy5zdmcuZGlhZ29uYWwucmFkaWFsKClcbiAgICAgICAgICAuc291cmNlIChkKSAtPiByZXR1cm4geDogZC5wYXJlbnQueCwgeTogZC5wYXJlbnQueVxuICAgICAgICAgIC50YXJnZXQgKGQpIC0+IHJldHVybiB4OiBkLngsIHk6IGQueVxuICAgICAgICAgIC5wcm9qZWN0aW9uIChkKSAtPiBbIGQueSwgKCBzbGlkZS5yYXRpbyAqIGQueCAtIHNsaWRlLnR1cm4gKSAvIDE4MCAqIE1hdGguUEkgXVxuXG5cbiAgICAgICAgd2hpbGUgZFxuXG4gICAgICAgICAgaWYgZC5wYXJlbnQ/XG5cbiAgICAgICAgICAgIEByb290LnNlbGVjdCAnZydcbiAgICAgICAgICAgICAgLmFwcGVuZCAncGF0aCdcbiAgICAgICAgICAgICAgICAuYXR0ciAnY2xhc3MnLCAgICAgICAgXCJsaW5rIGxpbmtfI3sgZC5pZCB9XCJcbiAgICAgICAgICAgICAgICAuYXR0ciAnZCcsICAgICAgICAgICAgZGlhZ29uYWwgZFxuICAgICAgICAgICAgICAgIC5hdHRyICdzdHJva2UnLCAgICAgICAoZCkgLT4gXCJyZWRcIlxuICAgICAgICAgICAgICAgIC5hdHRyICdzdHJva2Utd2lkdGgnLCAoZCkgLT4gXCI1cHhcIlxuICAgICAgICAgICAgICAgIC5hdHRyICdzdHJva2Utb3BhY2l0eScsIDBcbiAgICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgICAgICAuZGVsYXkgMTIwMCArIDIwMCAqICggNCAtIGQuZGVwdGggKVxuICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uIDEwXG4gICAgICAgICAgICAgICAgICAuYXR0ciAnc3Ryb2tlLW9wYWNpdHknLCAxXG5cbiAgICAgICAgICBkID0gZC5wYXJlbnRcblxuICAgICAgICAjIGFjdGlvblxuXG4gICAgICAgIGQgPSByXG5cbiAgICAgICAgQHJvb3Quc2VsZWN0ICdnJ1xuICAgICAgICAgIC5hcHBlbmQgJ2cnXG4gICAgICAgICAgICAuYXR0ciAnY2xhc3MnLCAgICAnbm9kZV9hY3Rpb24nXG4gICAgICAgICAgICAuYXR0ciAndHJhbnNmb3JtJywgXCJyb3RhdGUoICN7IHNsaWRlLnJhdGlvICogZC54IC0gOTAgLSBzbGlkZS50dXJuIH0gKSB0cmFuc2xhdGUoICN7IGQueSB9IClcIlxuICAgICAgICAgICAgLmFwcGVuZCAnY2lyY2xlJ1xuICAgICAgICAgICAgICAuYXR0ciAncicsICczMCdcbiAgICAgICAgICAgICAgLmF0dHIgJ3N0cm9rZScsICdyZWQnXG4gICAgICAgICAgICAgIC5hdHRyICdzdHJva2Utd2lkdGgnLCAnM3B4J1xuICAgICAgICAgICAgICAuYXR0ciAnZmlsbCcsICdjb3JhbCdcbiAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAgIC5hdHRyICdyJywgJzYwJ1xuICAgICAgICAgICAgICAgIC5kdXJhdGlvbiAxMDAwXG4gICAgICAgICAgICAgICAgLmVhc2UgJ2VsYXN0aWMnXG5cblxuICAgICAgICAjICMgbm9kZXNcblxuICAgICAgICBkID0gclxuICAgICAgICBkID0gZC5wYXJlbnRcblxuICAgICAgICB3aGlsZSBkXG5cbiAgICAgICAgICBAcm9vdC5zZWxlY3QgJ2cnXG4gICAgICAgICAgICAuYXBwZW5kICdnJ1xuICAgICAgICAgICAgICAuYXR0ciAnaWQnLCAgICAgICBcIm5wXyN7IGQuaWQgfVwiXG4gICAgICAgICAgICAgIC5hdHRyICd0cmFuc2Zvcm0nLCBcInJvdGF0ZSggI3sgc2xpZGUucmF0aW8gKiBkLnggLSA5MCAtIHNsaWRlLnR1cm4gfSApIHRyYW5zbGF0ZSggI3sgZC55IH0gKSBzY2FsZSgxKVwiXG4gICAgICAgICAgICAgIC5hcHBlbmQgJ2NpcmNsZSdcbiAgICAgICAgICAgICAgICAuYXR0ciAncicsICczMCdcbiAgICAgICAgICAgICAgICAuYXR0ciAnc3Ryb2tlJywgJ3JlZCdcbiAgICAgICAgICAgICAgICAuYXR0ciAnc3Ryb2tlLXdpZHRoJywgJzNweCdcbiAgICAgICAgICAgICAgICAuYXR0ciAnZmlsbCcsICcjRkY4MDgwJ1xuICAgICAgICAgICAgICAgIC5hdHRyICdzdHJva2Utb3BhY2l0eScsIDBcbiAgICAgICAgICAgICAgICAuYXR0ciAnZmlsbC1vcGFjaXR5JywgMFxuICAgICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgICAgIC5kZWxheSAxMDAwICsgMjAwICogKCA0IC0gZC5kZXB0aCApXG4gICAgICAgICAgICAgICAgICAuZHVyYXRpb24gMjAwXG4gICAgICAgICAgICAgICAgICAuYXR0ciAnc3Ryb2tlLW9wYWNpdHknLCAxXG4gICAgICAgICAgICAgICAgICAuYXR0ciAnZmlsbC1vcGFjaXR5JywgMVxuXG5cbiAgICAgICAgICBkID0gZC5wYXJlbnRcblxuXG4gICAgICB3aGVuIFwic3NfY29sbGFwc2VcIlxuXG4gICAgICAgIEBkb0NvbGxhcHNlKClcblxuIl19