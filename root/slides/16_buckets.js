var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

new Slide({
  id: "buckets",
  data: {
    children: [
      {
        children: [
          {
            children: []
          }, {
            children: []
          }, {
            children: []
          }
        ]
      }, {
        children: [
          {
            children: []
          }, {
            children: []
          }, {
            children: []
          }
        ]
      }, {
        children: [
          {
            children: []
          }, {
            children: []
          }, {
            children: []
          }
        ]
      }, {
        children: [
          {
            children: []
          }, {
            children: []
          }, {
            children: []
          }
        ]
      }, {
        children: [
          {
            children: []
          }, {
            children: []
          }, {
            children: []
          }
        ]
      }, {
        children: [
          {
            children: []
          }, {
            children: []
          }, {
            children: []
          }
        ]
      }, {
        children: [
          {
            children: []
          }, {
            children: []
          }, {
            children: []
          }
        ]
      }, {
        children: [
          {
            children: []
          }, {
            children: []
          }, {
            children: []
          }
        ]
      }
    ]
  },
  onReady: function(e) {
    var root, slide, svg;
    slide = this;
    svg = $('#buckets svg');
    root = d3.select(svg[0]);
    this.tree = new Tree({
      g: root.select('#tree'),
      width: svg.width(),
      height: svg.height(),
      highlight: [1],
      depth: 150,
      colour: function(d) {
        var ref;
        if (ref = d.id, indexOf.call(slide.tree.highlight, ref) >= 0) {
          return "coral";
        } else {
          return "lightsteelblue";
        }
      },
      stroke: function(d) {
        var ref;
        if (ref = d.id, indexOf.call(slide.tree.highlight, ref) >= 0) {
          return "red";
        } else {
          return "steelblue";
        }
      },
      position: function(g) {
        return g.attr('transform', "translate( 440, 280 ) scale(0.4)");
      }
    });
    root.selectAll('.rule').each(function() {
      if (this.__transition__ != null) {
        return this.__transition__.active = 0;
      }
    }).attr('display', 'none');
    return root.selectAll('.label').each(function() {
      if (this.__transition__ != null) {
        return this.__transition__.active = 0;
      }
    }).attr('opacity', 0);
  },
  onFragementHide: function(e) {
    var pos, root, slide, svg;
    slide = this;
    svg = $('#buckets svg');
    root = d3.select(svg[0]);
    switch (e.fragment.id) {
      case "b_arrange":
        pos = ["matrix(1 0 0 1 97.63546798029554 156.65024630541944)", "matrix(1 0 0 1 49.753694581281934 40.34482758620838)", "matrix(1 0 0 1 56.403940886700184 216.226600985224)", "matrix(1 0 0 1 216.8965517241381 112.1674876847293)", "matrix(1 0 0 1 138.42364532019704 262.6108374384248)", "matrix(1 0 0 1 260.34482758620743 210.44334975369745)", "matrix(1 0 0 1 310 64.2857142857149)"];
        root.selectAll('.rule').each(function() {
          if (this.__transition__ != null) {
            return this.__transition__.active = 0;
          }
        }).attr('transform', function(d) {
          var id;
          id = this.id.replace("r", "");
          return pos[id - 1];
        });
        return root.selectAll('.label').each(function() {
          if (this.__transition__ != null) {
            return this.__transition__.active = 0;
          }
        }).attr('opacity', 0);
      case "b_predicates":
        root.select('#textroot').each(function() {
          if (this.__transition__ != null) {
            return this.__transition__.active = 0;
          }
        }).attr('transform', "translate(0,0)");
        root.selectAll('.pred').each(function() {
          if (this.__transition__ != null) {
            return this.__transition__.active = 0;
          }
        }).attr('opacity', 0);
        return this.onFragementShow({
          fragment: {
            id: "b_arrange"
          }
        });
      case "b_root":
        root.select('#tree').attr('display', "none");
        root.select('#bucket1').attr('display', "none");
        return root.select('#bucket2').attr('display', "none");
      case "b_node1":
        return this.onFragementShow({
          fragment: {
            id: "b_root"
          }
        });
      case "b_node2":
        return this.onFragementShow({
          fragment: {
            id: "b_node1"
          }
        });
    }
  },
  onShow: function(e) {
    var i, root, svg;
    svg = $('#buckets svg');
    root = d3.select(svg[0]);
    i = 0;
    return root.selectAll('.rule').transition().delay(function(d) {
      return ++i * 50;
    }).attr('display', 'block');
  },
  onFragementShow: function(e) {
    var root, slide, svg;
    slide = this;
    svg = $('#buckets svg');
    root = d3.select(svg[0]);
    switch (e.fragment.id) {
      case "b_arrange":
        root.selectAll('.rule').transition().duration(1000).attr('transform', function(d) {
          var id, offset;
          id = this.id.replace("r", "");
          offset = id > 3 ? 90 : 30;
          return "matrix(1 0 0 1 220 " + (offset + id * 30) + ")";
        });
        return root.selectAll('.label').transition().delay(500).duration(500).attr('opacity', 1);
      case "b_predicates":
        root.select('#textroot').transition().duration(500).attr('transform', "translate(-75,0)");
        root.selectAll('.pred').transition().delay(250).duration(500).attr('opacity', 1);
        return root.selectAll('.rule').transition().duration(500).attr('transform', function(d) {
          var id, offset;
          id = this.id.replace("r", "");
          offset = id > 3 ? 120 : 60;
          return "matrix(1 0 0 1 250 " + (offset + id * 30) + ")";
        });
      case "b_root":
        this.tree.highlight = [1];
        root.select('#tree').attr('display', "block");
        root.select('#textroot').transition().duration(500).attr('transform', "translate(-50,20)scale(0.7)");
        return setTimeout((function() {
          return slide.tree.draw(slide.data);
        }), 500);
      case "b_node1":
        this.tree.highlight = [1, 22];
        this.tree.draw(this.data);
        root.select('#bucket1').attr('display', "block");
        return root.select('#bucket2').attr('display', "none");
      case "b_node2":
        this.tree.highlight = [1, 22, 25];
        this.tree.draw(this.data);
        root.select('#bucket1').attr('display', "none");
        return root.select('#bucket2').attr('display', "block");
    }
  }
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNsaWRlcy8xNl9idWNrZXRzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxJQUFBOztBQUFJLElBQUEsS0FBQSxDQUVGO0VBQUEsRUFBQSxFQUFJLFNBQUo7RUFFQSxJQUFBLEVBQU07SUFDSixRQUFBLEVBQVM7TUFDUDtRQUFFLFFBQUEsRUFBUztVQUNUO1lBQUUsUUFBQSxFQUFTLEVBQVg7V0FEUyxFQUVUO1lBQUUsUUFBQSxFQUFTLEVBQVg7V0FGUyxFQUdUO1lBQUUsUUFBQSxFQUFTLEVBQVg7V0FIUztTQUFYO09BRE8sRUFNUDtRQUFFLFFBQUEsRUFBUztVQUNUO1lBQUUsUUFBQSxFQUFTLEVBQVg7V0FEUyxFQUVUO1lBQUUsUUFBQSxFQUFTLEVBQVg7V0FGUyxFQUdUO1lBQUUsUUFBQSxFQUFTLEVBQVg7V0FIUztTQUFYO09BTk8sRUFXUDtRQUFFLFFBQUEsRUFBUztVQUNUO1lBQUUsUUFBQSxFQUFTLEVBQVg7V0FEUyxFQUVUO1lBQUUsUUFBQSxFQUFTLEVBQVg7V0FGUyxFQUdUO1lBQUUsUUFBQSxFQUFTLEVBQVg7V0FIUztTQUFYO09BWE8sRUFnQlA7UUFBRSxRQUFBLEVBQVM7VUFDVDtZQUFFLFFBQUEsRUFBUyxFQUFYO1dBRFMsRUFFVDtZQUFFLFFBQUEsRUFBUyxFQUFYO1dBRlMsRUFHVDtZQUFFLFFBQUEsRUFBUyxFQUFYO1dBSFM7U0FBWDtPQWhCTyxFQXFCUDtRQUFFLFFBQUEsRUFBUztVQUNUO1lBQUUsUUFBQSxFQUFTLEVBQVg7V0FEUyxFQUVUO1lBQUUsUUFBQSxFQUFTLEVBQVg7V0FGUyxFQUdUO1lBQUUsUUFBQSxFQUFTLEVBQVg7V0FIUztTQUFYO09BckJPLEVBMEJQO1FBQUUsUUFBQSxFQUFTO1VBQ1Q7WUFBRSxRQUFBLEVBQVMsRUFBWDtXQURTLEVBRVQ7WUFBRSxRQUFBLEVBQVMsRUFBWDtXQUZTLEVBR1Q7WUFBRSxRQUFBLEVBQVMsRUFBWDtXQUhTO1NBQVg7T0ExQk8sRUErQlA7UUFBRSxRQUFBLEVB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LE9BQVosQ0FDRSxDQUFDLElBREgsQ0FDUSxTQURSLEVBQ21CLE9BRG5CO1FBR0EsSUFBSSxDQUFDLE1BQUwsQ0FBWSxXQUFaLENBQ0UsQ0FBQyxVQURILENBQUEsQ0FFSSxDQUFDLFFBRkwsQ0FFYyxHQUZkLENBR0ksQ0FBQyxJQUhMLENBR1UsV0FIVixFQUd1Qiw2QkFIdkI7ZUFLQSxVQUFBLENBQVcsQ0FBRSxTQUFBO2lCQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBWCxDQUFnQixLQUFLLENBQUMsSUFBdEI7UUFBSCxDQUFGLENBQVgsRUFBOEMsR0FBOUM7QUFwREosV0F1RE8sU0F2RFA7UUF5REksSUFBQyxDQUFBLElBQUksQ0FBQyxTQUFOLEdBQWtCLENBQUMsQ0FBRCxFQUFHLEVBQUg7UUFDbEIsSUFBQyxDQUFBLElBQUksQ0FBQyxJQUFOLENBQVcsSUFBQyxDQUFBLElBQVo7UUFFQSxJQUFJLENBQUMsTUFBTCxDQUFZLFVBQVosQ0FDRSxDQUFDLElBREgsQ0FDUSxTQURSLEVBQ21CLE9BRG5CO2VBR0EsSUFBSSxDQUFDLE1BQUwsQ0FBWSxVQUFaLENBQ0UsQ0FBQyxJQURILENBQ1EsU0FEUixFQUNtQixNQURuQjtBQS9ESixXQWtFTyxTQWxFUDtRQW9FSSxJQUFDLENBQUEsSUFBSSxDQUFDLFNBQU4sR0FBa0IsQ0FBQyxDQUFELEVBQUcsRUFBSCxFQUFNLEVBQU47UUFDbEIsSUFBQyxDQUFBLElBQUksQ0FBQyxJQUFOLENBQVcsSUFBQyxDQUFBLElBQVo7UUFFQSxJQUFJLENBQUMsTUFBTCxDQUFZLFVBQVosQ0FDRSxDQUFDLElBREgsQ0FDUSxTQURSLEVBQ21CLE1BRG5CO2VBR0EsSUFBSSxDQUFDLE1BQUwsQ0FBWSxVQUFaLENBQ0UsQ0FBQyxJQURILENBQ1EsU0FEUixFQUNtQixPQURuQjtBQTFFSjtFQU5lLENBMUpqQjtDQUZFIiwiZmlsZSI6InNsaWRlcy8xNl9idWNrZXRzLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsiIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxubmV3IFNsaWRlXG5cbiAgaWQ6IFwiYnVja2V0c1wiXG5cbiAgZGF0YToge1xuICAgIGNoaWxkcmVuOltcbiAgICAgIHsgY2hpbGRyZW46W1xuICAgICAgICB7IGNoaWxkcmVuOltdIH1cbiAgICAgICAgeyBjaGlsZHJlbjpbXSB9XG4gICAgICAgIHsgY2hpbGRyZW46W10gfVxuICAgICAgXSB9XG4gICAgICB7IGNoaWxkcmVuOltcbiAgICAgICAgeyBjaGlsZHJlbjpbXSB9XG4gICAgICAgIHsgY2hpbGRyZW46W10gfVxuICAgICAgICB7IGNoaWxkcmVuOltdIH1cbiAgICAgIF0gfVxuICAgICAgeyBjaGlsZHJlbjpbXG4gICAgICAgIHsgY2hpbGRyZW46W10gfVxuICAgICAgICB7IGNoaWxkcmVuOltdIH1cbiAgICAgICAgeyBjaGlsZHJlbjpbXSB9XG4gICAgICBdIH1cbiAgICAgIHsgY2hpbGRyZW46W1xuICAgICAgICB7IGNoaWxkcmVuOltdIH1cbiAgICAgICAgeyBjaGlsZHJlbjpbXSB9XG4gICAgICAgIHsgY2hpbGRyZW46W10gfVxuICAgICAgXSB9XG4gICAgICB7IGNoaWxkcmVuOltcbiAgICAgICAgeyBjaGlsZHJlbjpbXSB9XG4gICAgICAgIHsgY2hpbGRyZW46W10gfVxuICAgICAgICB7IGNoaWxkcmVuOltdIH1cbiAgICAgIF0gfVxuICAgICAgeyBjaGlsZHJlbjpbXG4gICAgICAgIHsgY2hpbGRyZW46W10gfVxuICAgICAgICB7IGNoaWxkcmVuOltdIH1cbiAgICAgICAgeyBjaGlsZHJlbjpbXSB9XG4gICAgICBdIH1cbiAgICAgIHsgY2hpbGRyZW46W1xuICAgICAgICB7IGNoaWxkcmVuOltdIH1cbiAgICAgICAgeyBjaGlsZHJlbjpbXSB9XG4gICAgICAgIHsgY2hpbGRyZW46W10gfVxuICAgICAgXSB9XG4gICAgICB7IGNoaWxkcmVuOltcbiAgICAgICAgeyBjaGlsZHJlbjpbXSB9XG4gICAgICAgIHsgY2hpbGRyZW46W10gfVxuICAgICAgICB7IGNoaWxkcmVuOltdIH1cbiAgICAgIF0gfVxuICAgIF1cbiAgfVxuXG5cbiAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBvblJlYWR5OiAoZSkgLT5cblxuICAgIHNsaWRlID0gdGhpc1xuICAgIHN2ZyAgID0gJCAnI2J1Y2tldHMgc3ZnJ1xuICAgIHJvb3QgID0gZDMuc2VsZWN0IHN2Z1swXVxuXG4gICAgQHRyZWUgPSBuZXcgVHJlZVxuICAgICAgZyAgICAgICAgIDogcm9vdC5zZWxlY3QgJyN0cmVlJ1xuICAgICAgd2lkdGggICAgIDogc3ZnLndpZHRoKClcbiAgICAgIGhlaWdodCAgICA6IHN2Zy5oZWlnaHQoKVxuICAgICAgaGlnaGxpZ2h0IDogWzFdICMsNCw3LDEwXVxuICAgICAgZGVwdGggICAgIDogMTUwXG5cbiAgICAgIGNvbG91ciAgICA6IChkKSAtPiBpZiBkLmlkIGluIHNsaWRlLnRyZWUuaGlnaGxpZ2h0IHRoZW4gXCJjb3JhbFwiIGVsc2UgXCJsaWdodHN0ZWVsYmx1ZVwiXG4gICAgICBzdHJva2UgICAgOiAoZCkgLT4gaWYgZC5pZCBpbiBzbGlkZS50cmVlLmhpZ2hsaWdodCB0aGVuIFwicmVkXCIgZWxzZSBcInN0ZWVsYmx1ZVwiXG4gICAgICBwb3NpdGlvbiAgOiAoZykgLT4gZy5hdHRyICd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSggNDQwLCAyODAgKSBzY2FsZSgwLjQpXCJcblxuXG4gICAgcm9vdC5zZWxlY3RBbGwgJy5ydWxlJ1xuICAgICAgLmVhY2ggLT4gdGhpcy5fX3RyYW5zaXRpb25fXy5hY3RpdmUgPSAwIGlmIHRoaXMuX190cmFuc2l0aW9uX18/XG4gICAgICAuYXR0ciAnZGlzcGxheScsICdub25lJ1xuXG4gICAgcm9vdC5zZWxlY3RBbGwgJy5sYWJlbCdcbiAgICAgIC5lYWNoIC0+IHRoaXMuX190cmFuc2l0aW9uX18uYWN0aXZlID0gMCBpZiB0aGlzLl9fdHJhbnNpdGlvbl9fP1xuICAgICAgLmF0dHIgJ29wYWNpdHknLCAwXG5cbiAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBvbkZyYWdlbWVudEhpZGU6IChlKSAtPlxuXG4gICAgc2xpZGUgPSB0aGlzXG4gICAgc3ZnICAgPSAkICcjYnVja2V0cyBzdmcnXG4gICAgcm9vdCAgPSBkMy5zZWxlY3Qgc3ZnWzBdXG5cbiAgICBzd2l0Y2ggZS5mcmFnbWVudC5pZFxuXG4gICAgICB3aGVuIFwiYl9hcnJhbmdlXCJcblxuICAgICAgICBwb3MgPSBbXG4gICAgICAgICAgXCJtYXRyaXgoMSAwIDAgMSA5Ny42MzU0Njc5ODAyOTU1NCAxNTYuNjUwMjQ2MzA1NDE5NDQpXCJcbiAgICAgICAgICBcIm1hdHJpeCgxIDAgMCAxIDQ5Ljc1MzY5NDU4MTI4MTkzNCA0MC4zNDQ4Mjc1ODYyMDgzOClcIlxuICAgICAgICAgIFwibWF0cml4KDEgMCAwIDEgNTYuNDAzOTQwODg2NzAwMTg0IDIxNi4yMjY2MDA5ODUyMjQpXCJcbiAgICAgICAgICBcIm1hdHJpeCgxIDAgMCAxIDIxNi44OTY1NTE3MjQxMzgxIDExMi4xNjc0ODc2ODQ3MjkzKVwiXG4gICAgICAgICAgXCJtYXRyaXgoMSAwIDAgMSAxMzguNDIzNjQ1MzIwMTk3MDQgMjYyLjYxMDgzNzQzODQyNDgpXCJcbiAgICAgICAgICBcIm1hdHJpeCgxIDAgMCAxIDI2MC4zNDQ4Mjc1ODYyMDc0MyAyMTAuNDQzMzQ5NzUzNjk3NDUpXCJcbiAgICAgICAgICBcIm1hdHJpeCgxIDAgMCAxIDMxMCA2NC4yODU3MTQyODU3MTQ5KVwiXG4gICAgICAgIF1cblxuICAgICAgICByb290LnNlbGVjdEFsbCAnLnJ1bGUnXG4gICAgICAgICAgLmVhY2ggLT4gdGhpcy5fX3RyYW5zaXRpb25fXy5hY3RpdmUgPSAwIGlmIHRoaXMuX190cmFuc2l0aW9uX18/XG4gICAgICAgICAgLmF0dHIgJ3RyYW5zZm9ybScsIChkKSAtPiBpZCA9IHRoaXMuaWQucmVwbGFjZSBcInJcIiwgXCJcIjsgcG9zWyBpZCAtIDEgXVxuXG4gICAgICAgIHJvb3Quc2VsZWN0QWxsICcubGFiZWwnXG4gICAgICAgICAgLmVhY2ggLT4gdGhpcy5fX3RyYW5zaXRpb25fXy5hY3RpdmUgPSAwIGlmIHRoaXMuX190cmFuc2l0aW9uX18/XG4gICAgICAgICAgLmF0dHIgJ29wYWNpdHknLCAwXG5cbiAgICAgIHdoZW4gXCJiX3ByZWRpY2F0ZXNcIlxuXG4gICAgICAgIHJvb3Quc2VsZWN0ICcjdGV4dHJvb3QnXG4gICAgICAgICAgLmVhY2ggLT4gdGhpcy5fX3RyYW5zaXRpb25fXy5hY3RpdmUgPSAwIGlmIHRoaXMuX190cmFuc2l0aW9uX18/XG4gICAgICAgICAgLmF0dHIgJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKDAsMClcIlxuXG4gICAgICAgIHJvb3Quc2VsZWN0QWxsICcucHJlZCdcbiAgICAgICAgICAuZWFjaCAtPiB0aGlzLl9fdHJhbnNpdGlvbl9fLmFjdGl2ZSA9IDAgaWYgdGhpcy5fX3RyYW5zaXRpb25fXz9cbiAgICAgICAgICAuYXR0ciAnb3BhY2l0eScsIDBcblxuICAgICAgICBAb25GcmFnZW1lbnRTaG93IGZyYWdtZW50OiBpZDogXCJiX2FycmFuZ2VcIlxuXG4gICAgICB3aGVuIFwiYl9yb290XCJcblxuICAgICAgICByb290LnNlbGVjdCAnI3RyZWUnXG4gICAgICAgICAgLmF0dHIgJ2Rpc3BsYXknLCBcIm5vbmVcIlxuXG4gICAgICAgIHJvb3Quc2VsZWN0ICcjYnVja2V0MSdcbiAgICAgICAgICAuYXR0ciAnZGlzcGxheScsIFwibm9uZVwiXG5cbiAgICAgICAgcm9vdC5zZWxlY3QgJyNidWNrZXQyJ1xuICAgICAgICAgIC5hdHRyICdkaXNwbGF5JywgXCJub25lXCJcblxuICAgICAgd2hlbiBcImJfbm9kZTFcIlxuXG4gICAgICAgIEBvbkZyYWdlbWVudFNob3cgZnJhZ21lbnQ6IGlkOiBcImJfcm9vdFwiXG5cbiAgICAgIHdoZW4gXCJiX25vZGUyXCJcblxuICAgICAgICBAb25GcmFnZW1lbnRTaG93IGZyYWdtZW50OiBpZDogXCJiX25vZGUxXCJcblxuXG4gICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgb25TaG93OiAoZSkgLT5cblxuICAgIHN2ZyAgID0gJCAnI2J1Y2tldHMgc3ZnJ1xuICAgIHJvb3QgID0gZDMuc2VsZWN0IHN2Z1swXVxuXG4gICAgaSA9IDBcbiAgICByb290LnNlbGVjdEFsbCAnLnJ1bGUnXG4gICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgIC5kZWxheSAoZCkgLT4gKytpICogNTBcbiAgICAgICAgLmF0dHIgJ2Rpc3BsYXknLCAnYmxvY2snXG5cblxuICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIG9uRnJhZ2VtZW50U2hvdzogKGUpIC0+XG5cbiAgICBzbGlkZSA9IHRoaXNcbiAgICBzdmcgICA9ICQgJyNidWNrZXRzIHN2ZydcbiAgICByb290ICA9IGQzLnNlbGVjdCBzdmdbMF1cblxuICAgIHN3aXRjaCBlLmZyYWdtZW50LmlkXG5cbiAgICAgIHdoZW4gXCJiX2FycmFuZ2VcIlxuXG4gICAgICAgIHJvb3Quc2VsZWN0QWxsICcucnVsZSdcbiAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAuZHVyYXRpb24gMTAwMFxuICAgICAgICAgICAgLmF0dHIgJ3RyYW5zZm9ybScsIChkKSAtPlxuICAgICAgICAgICAgICBpZCA9IHRoaXMuaWQucmVwbGFjZSBcInJcIiwgXCJcIlxuICAgICAgICAgICAgICBvZmZzZXQgPSBpZiBpZCA+IDMgdGhlbiA5MCBlbHNlIDMwXG4gICAgICAgICAgICAgIFwibWF0cml4KDEgMCAwIDEgMjIwICN7IG9mZnNldCArIGlkICogMzAgfSlcIlxuXG4gICAgICAgIHJvb3Quc2VsZWN0QWxsICcubGFiZWwnXG4gICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgLmRlbGF5IDUwMFxuICAgICAgICAgICAgLmR1cmF0aW9uIDUwMFxuICAgICAgICAgICAgLmF0dHIgJ29wYWNpdHknLCAxXG5cblxuICAgICAgd2hlbiBcImJfcHJlZGljYXRlc1wiXG5cbiAgICAgICAgcm9vdC5zZWxlY3QgJyN0ZXh0cm9vdCdcbiAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAuZHVyYXRpb24gNTAwXG4gICAgICAgICAgICAuYXR0ciAndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoLTc1LDApXCJcblxuICAgICAgICByb290LnNlbGVjdEFsbCAnLnByZWQnXG4gICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgLmRlbGF5IDI1MFxuICAgICAgICAgICAgLmR1cmF0aW9uIDUwMFxuICAgICAgICAgICAgLmF0dHIgJ29wYWNpdHknLCAxXG5cbiAgICAgICAgcm9vdC5zZWxlY3RBbGwgJy5ydWxlJ1xuICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgIC5kdXJhdGlvbiA1MDBcbiAgICAgICAgICAgIC5hdHRyICd0cmFuc2Zvcm0nLCAoZCkgLT5cbiAgICAgICAgICAgICAgaWQgPSB0aGlzLmlkLnJlcGxhY2UgXCJyXCIsIFwiXCJcbiAgICAgICAgICAgICAgb2Zmc2V0ID0gaWYgaWQgPiAzIHRoZW4gMTIwIGVsc2UgNjBcbiAgICAgICAgICAgICAgXCJtYXRyaXgoMSAwIDAgMSAyNTAgI3sgb2Zmc2V0ICsgaWQgKiAzMCB9KVwiXG5cbiAgICAgIHdoZW4gXCJiX3Jvb3RcIlxuXG4gICAgICAgIEB0cmVlLmhpZ2hsaWdodCA9IFsxXVxuXG4gICAgICAgIHJvb3Quc2VsZWN0ICcjdHJlZSdcbiAgICAgICAgICAuYXR0ciAnZGlzcGxheScsIFwiYmxvY2tcIlxuXG4gICAgICAgIHJvb3Quc2VsZWN0ICcjdGV4dHJvb3QnXG4gICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgLmR1cmF0aW9uIDUwMFxuICAgICAgICAgICAgLmF0dHIgJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKC01MCwyMClzY2FsZSgwLjcpXCJcblxuICAgICAgICBzZXRUaW1lb3V0ICggLT4gc2xpZGUudHJlZS5kcmF3IHNsaWRlLmRhdGEgKSwgNTAwXG5cblxuICAgICAgd2hlbiBcImJfbm9kZTFcIlxuXG4gICAgICAgIEB0cmVlLmhpZ2hsaWdodCA9IFsxLDIyXVxuICAgICAgICBAdHJlZS5kcmF3IEBkYXRhXG5cbiAgICAgICAgcm9vdC5zZWxlY3QgJyNidWNrZXQxJ1xuICAgICAgICAgIC5hdHRyICdkaXNwbGF5JywgXCJibG9ja1wiXG5cbiAgICAgICAgcm9vdC5zZWxlY3QgJyNidWNrZXQyJ1xuICAgICAgICAgIC5hdHRyICdkaXNwbGF5JywgXCJub25lXCJcblxuICAgICAgd2hlbiBcImJfbm9kZTJcIlxuXG4gICAgICAgIEB0cmVlLmhpZ2hsaWdodCA9IFsxLDIyLDI1XVxuICAgICAgICBAdHJlZS5kcmF3IEBkYXRhXG5cbiAgICAgICAgcm9vdC5zZWxlY3QgJyNidWNrZXQxJ1xuICAgICAgICAgIC5hdHRyICdkaXNwbGF5JywgXCJub25lXCJcblxuICAgICAgICByb290LnNlbGVjdCAnI2J1Y2tldDInXG4gICAgICAgICAgLmF0dHIgJ2Rpc3BsYXknLCBcImJsb2NrXCJcbiJdfQ==