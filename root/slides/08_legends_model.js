var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

new Slide({
  id: 'legends_model',
  sim: 1,
  data: {
    children: [
      {
        children: []
      }, {
        children: []
      }, {
        children: []
      }, {
        children: []
      }, {
        children: []
      }, {
        children: []
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
        children: []
      }
    ]
  },
  create: function() {
    var root, slide, svg;
    svg = $("#legends_model svg");
    root = d3.select(svg[0]);
    slide = this;
    this.map = new Map({
      g: root.select('#map'),
      zoom: false,
      text: false,
      transform: function(d) {
        return "rotate(0) translate(" + d.center.x + "," + d.center.y + ") scale(0)";
      },
      opacity: function(d) {
        return 0;
      },
      stroke: function(d) {
        return "none";
      }
    });
    this.map.draw(gMapData);
    return this.tree = new Tree({
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
        return g.attr('transform', "translate( 1500, 800 )");
      }
    });
  },
  animatedIn: function() {
    var areas, i;
    areas = this.map.g.selectAll(".area");
    i = 0;
    return areas.transition().delay(function(d) {
      return ++i * 16;
    }).duration(500).ease("elastic").attr('transform', function(d) {
      return "translate(" + d.center.x + "," + d.center.y + ") scale(1.0)";
    }).style('fill-opacity', '0.2').style('stroke', 'blue');
  },
  zoomToAction: function() {
    var root, svg;
    svg = $("#legends_model svg > g");
    root = d3.select(svg[0]);
    return root.transition().duration(1000).ease("cubic-in-out").attr('transform', function(d) {
      return "translate(600,550) rotate(-50) scale(3)";
    }).each("end", function() {
      return Reveal.nextFragment();
    });
  },
  zoomOut: function() {
    var root, svg;
    svg = $("#legends_model svg > g");
    root = d3.select(svg[0]);
    return root.transition().duration(1000).ease("cubic-in-out").attr('transform', function(d) {
      return "translate(1100,450) rotate(0) scale(1.2)";
    });
  },
  showActors: function() {
    var i;
    this.map.drawActors(gSim[this.sim].steps[0]);
    i = 0;
    return this.map.g.selectAll('.actor > circle').attr('r', '0.0').transition().delay(function(d) {
      return ++i * (500 / 14);
    }).duration(500).ease("elastic", 3, 0.8).attr('r', '50.0');
  },
  hideActors: function() {
    this.map.g.selectAll(".actors").remove();
    return this.map.g.selectAll(".orders").remove();
  },
  step: function(id) {
    return this.map.drawActors(gSim[this.sim].steps[id]);
  },
  onReady: function(e) {
    return this.create();
  },
  onFragementHide: function(e) {
    var id;
    if (e.fragment.id.startsWith("lm_step")) {
      id = e.fragment.id.replace("lm_step", "");
      if (--id <= 0) {
        this.hideActors();
      } else {
        this.step(id);
      }
    }
    switch (e.fragment.id) {
      case "lm_zoom":
        return this.zoomOut();
      case "lm_show":
        return this.hideActors();
      case "lm_showtree":
        return this.tree.g.selectAll('*').remove();
    }
  },
  onFragementShow: function(e) {
    if (e.fragment.id.startsWith("lm_step")) {
      this.step(e.fragment.id.replace("lm_step", ""));
    }
    switch (e.fragment.id) {
      case "lm_start":
        return this.animatedIn();
      case "lm_zoom":
        return this.zoomToAction();
      case "lm_show":
        return this.showActors();
      case "lm_showtree":
        this.tree.highlight = [1];
        return this.tree.draw(this.data);
      case "lm_step2":
        this.tree.highlight = [1, 8];
        return this.tree.draw(this.data);
      case "lm_step3":
        this.tree.highlight = [1, 8, 10];
        return this.tree.draw(this.data);
      case "lm_step4":
        return setTimeout((function() {
          return Reveal.nextFragment();
        }), 250);
      case "lm_step5":
        return setTimeout((function() {
          return Reveal.nextFragment();
        }), 250);
      case "lm_score":
        return this.tree.g.selectAll('*').remove();
    }
  }
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNsaWRlcy8wOF9sZWdlbmRzX21vZGVsLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxJQUFBOztBQUFJLElBQUEsS0FBQSxDQUVGO0VBQUEsRUFBQSxFQUFJLGVBQUo7RUFDQSxHQUFBLEVBQUssQ0FETDtFQUlBLElBQUEsRUFBTTtJQUNKLFFBQUEsRUFBUztNQUNQO1FBQUUsUUFBQSxFQUFTLEVBQVg7T0FETyxFQUVQO1FBQUUsUUFBQSxFQUFTLEVBQVg7T0FGTyxFQUdQO1FBQUUsUUFBQSxFQUFTLEVBQVg7T0FITyxFQUlQO1FBQUUsUUFBQSxFQUFTLEVBQVg7T0FKTyxFQUtQO1FBQUUsUUFBQSxFQUFTLEVBQVg7T0FMTyxFQU1QO1FBQUUsUUFBQSxFQUFTLEVBQVg7T0FOTyxFQU9QO1FBQUUsUUFBQSxFQUFTO1VBRVQ7WUFBRSxRQUFBLEVBQVMsRUFBWDtXQUZTLEVBR1Q7WUFBRSxRQUFBLEVBQVMsRUFBWDtXQUhTLEVBSVQ7WUFBRSxRQUFBLEVBQVMsRUFBWDtXQUpTO1NBQVg7T0FQTyxFQWFQO1FBQUUsUUFBQSxFQUFTLEVBQVg7T0FiTztLQURMO0dBSk47RUF5QkEsTUFBQSxFQUFRLFNBQUE7QUFFTixRQUFBO0lBQUEsR0FBQSxHQUFRLENBQUEsQ0FBRSxvQkFBRjtJQUNSLElBQUEsR0FBUSxFQUFFLENBQUMsTUFBSCxDQUFVLEdBQUksQ0FBQSxDQUFBLENBQWQ7SUFDUixLQUFBLEdBQVE7SUFJUixJQUFDLENBQUEsR0FBRCxHQUFXLElBQUEsR0FBQSxDQUVUO01BQUEsQ0FBQSxFQUFZLElBQUksQ0FBQyxNQUFMLENBQVksTUFBWixDQUFaO01BQ0EsSUFBQSxFQUFZLEtBRFo7TUFFQSxJQUFBLEVBQVksS0FGWjtNQUlBLFNBQUEsRUFBWSxTQUFDLENBQUQ7ZUFBTyxzQkFBQSxHQUF1QixDQUFDLENBQUMsTUFBTSxDQUFDLENBQWhDLEdBQWtDLEdBQWxDLEdBQXFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBOUMsR0FBZ0Q7TUFB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QVo7QUFSSixXQVVPLFVBVlA7UUFXSSxJQUFDLENBQUEsSUFBSSxDQUFDLFNBQU4sR0FBa0IsQ0FBQyxDQUFELEVBQUcsQ0FBSDtlQUNsQixJQUFDLENBQUEsSUFBSSxDQUFDLElBQU4sQ0FBVyxJQUFDLENBQUEsSUFBWjtBQVpKLFdBYU8sVUFiUDtRQWNJLElBQUMsQ0FBQSxJQUFJLENBQUMsU0FBTixHQUFrQixDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssRUFBTDtlQUNsQixJQUFDLENBQUEsSUFBSSxDQUFDLElBQU4sQ0FBVyxJQUFDLENBQUEsSUFBWjtBQWZKLFdBaUJPLFVBakJQO2VBa0JNLFVBQUEsQ0FBVyxDQUFFLFNBQUE7aUJBQUcsTUFBTSxDQUFDLFlBQVAsQ0FBQTtRQUFILENBQUYsQ0FBWCxFQUF5QyxHQUF6QztBQWxCTixXQW9CTyxVQXBCUDtlQXFCTSxVQUFBLENBQVcsQ0FBRSxTQUFBO2lCQUFHLE1BQU0sQ0FBQyxZQUFQLENBQUE7UUFBSCxDQUFGLENBQVgsRUFBeUMsR0FBekM7QUFyQk4sV0F1Qk8sVUF2QlA7ZUF3Qk0sSUFBQyxDQUFBLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUixDQUFrQixHQUFsQixDQUFzQixDQUFDLE1BQXZCLENBQUE7QUF4Qk47RUFOZSxDQS9LakI7Q0FGRSIsImZpbGUiOiJzbGlkZXMvMDhfbGVnZW5kc19tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbIiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5uZXcgU2xpZGVcclxuXHJcbiAgaWQ6ICdsZWdlbmRzX21vZGVsJ1xyXG4gIHNpbTogMVxyXG5cclxuXHJcbiAgZGF0YToge1xyXG4gICAgY2hpbGRyZW46W1xyXG4gICAgICB7IGNoaWxkcmVuOltdIH1cclxuICAgICAgeyBjaGlsZHJlbjpbXSB9XHJcbiAgICAgIHsgY2hpbGRyZW46W10gfVxyXG4gICAgICB7IGNoaWxkcmVuOltdIH1cclxuICAgICAgeyBjaGlsZHJlbjpbXSB9XHJcbiAgICAgIHsgY2hpbGRyZW46W10gfVxyXG4gICAgICB7IGNoaWxkcmVuOltcclxuICAgICAgICAjXHJcbiAgICAgICAgeyBjaGlsZHJlbjpbXSB9XHJcbiAgICAgICAgeyBjaGlsZHJlbjpbXSB9XHJcbiAgICAgICAgeyBjaGlsZHJlbjpbXSB9XHJcbiAgICAgIF0gfVxyXG4gICAgICB7IGNoaWxkcmVuOltdIH1cclxuICAgIF1cclxuICB9XHJcblxyXG5cclxuICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICBjcmVhdGU6IC0+XHJcblxyXG4gICAgc3ZnICAgPSAkIFwiI2xlZ2VuZHNfbW9kZWwgc3ZnXCJcclxuICAgIHJvb3QgID0gZDMuc2VsZWN0IHN2Z1swXVxyXG4gICAgc2xpZGUgPSB0aGlzXHJcblxyXG4gICAgIyBtYXBcclxuXHJcbiAgICBAbWFwID0gbmV3IE1hcFxyXG5cclxuICAgICAgZyAgICAgICAgIDogcm9vdC5zZWxlY3QgJyNtYXAnXHJcbiAgICAgIHpvb20gICAgICA6IGZhbHNlXHJcbiAgICAgIHRleHQgICAgICA6IGZhbHNlXHJcblxyXG4gICAgICB0cmFuc2Zvcm0gOiAoZCkgLT4gXCJyb3RhdGUoMCkgdHJhbnNsYXRlKCN7ZC5jZW50ZXIueH0sI3tkLmNlbnRlci55fSkgc2NhbGUoMClcIlxyXG4gICAgICBvcGFjaXR5ICAgOiAoZCkgLT4gMFxyXG4gICAgICBzdHJva2UgICAgOiAoZCkgLT4gXCJub25lXCJcclxuXHJcbiAgICBAbWFwLmRyYXcgZ01hcERhdGFcclxuXHJcblxyXG4gICAgIyB0cmVlXHJcblxyXG4gICAgQHRyZWUgPSBuZXcgVHJlZVxyXG4gICAgICBnICAgICAgICAgOiByb290LnNlbGVjdCAnI3RyZWUnXHJcbiAgICAgIHdpZHRoICAgICA6IHN2Zy53aWR0aCgpXHJcbiAgICAgIGhlaWdodCAgICA6IHN2Zy5oZWlnaHQoKVxyXG4gICAgICBoaWdobGlnaHQgOiBbMV0gIyw0LDcsMTBdXHJcbiAgICAgIGRlcHRoICAgICA6IDE1MFxyXG5cclxuICAgICAgY29sb3VyICAgIDogKGQpIC0+XHJcbiAgICAgICAgICBpZiBkLmlkIGluIHNsaWRlLnRyZWUuaGlnaGxpZ2h0IHRoZW4gXCJjb3JhbFwiIGVsc2UgXCJsaWdodHN0ZWVsYmx1ZVwiXHJcbiAgICAgIHN0cm9rZSAgICA6IChkKSAtPlxyXG4gICAgICAgICAgaWYgZC5pZCBpbiBzbGlkZS50cmVlLmhpZ2hsaWdodCB0aGVuIFwicmVkXCIgZWxzZSBcInN0ZWVsYmx1ZVwiXHJcblxyXG4gICAgICBwb3NpdGlvbiAgOiAoZykgLT4gZy5hdHRyICd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSggMTUwMCwgODAwIClcIlxyXG5cclxuXHJcblxyXG4gICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gIGFuaW1hdGVkSW46IC0+XHJcblxyXG4gICAgYXJlYXMgPSBAbWFwLmcuc2VsZWN0QWxsIFwiLmFyZWFcIlxyXG5cclxuICAgIGkgPSAwXHJcblxyXG4gICAgYXJlYXNcclxuICAgICAgLnRyYW5zaXRpb24oKVxyXG4gICAgICAgIC5kZWxheSAoZCkgLT4gKytpICogMTZcclxuICAgICAgICAuZHVyYXRpb24gNTAwXHJcbiAgICAgICAgLmVhc2UgXCJlbGFzdGljXCJcclxuICAgICAgICAuYXR0ciAndHJhbnNmb3JtJywgKGQpIC0+IFwidHJhbnNsYXRlKCN7ZC5jZW50ZXIueH0sI3tkLmNlbnRlci55fSkgc2NhbGUoMS4wKVwiXHJcbiAgICAgICAgLnN0eWxlICdmaWxsLW9wYWNpdHknLCAnMC4yJ1xyXG4gICAgICAgIC5zdHlsZSAnc3Ryb2tlJywgJ2JsdWUnXHJcblxyXG5cclxuICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICB6b29tVG9BY3Rpb246IC0+XHJcblxyXG4gICAgc3ZnICAgPSAkIFwiI2xlZ2VuZHNfbW9kZWwgc3ZnID4gZ1wiXHJcbiAgICByb290ICA9IGQzLnNlbGVjdCBzdmdbMF1cclxuXHJcbiAgICByb290XHJcbiAgICAgIC50cmFuc2l0aW9uKClcclxuICAgICAgICAuZHVyYXRpb24gMTAwMFxyXG4gICAgICAgIC5lYXNlIFwiY3ViaWMtaW4tb3V0XCJcclxuICAgICAgICAuYXR0ciAndHJhbnNmb3JtJywgKGQpIC0+IFwidHJhbnNsYXRlKDYwMCw1NTApIHJvdGF0ZSgtNTApIHNjYWxlKDMpXCJcclxuICAgICAgICAuZWFjaCBcImVuZFwiLCAtPiBSZXZlYWwubmV4dEZyYWdtZW50KClcclxuXHJcbiAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgem9vbU91dDogLT5cclxuXHJcbiAgICBzdmcgICA9ICQgXCIjbGVnZW5kc19tb2RlbCBzdmcgPiBnXCJcclxuICAgIHJvb3QgID0gZDMuc2VsZWN0IHN2Z1swXVxyXG5cclxuICAgIHJvb3RcclxuICAgICAgLnRyYW5zaXRpb24oKVxyXG4gICAgICAgIC5kdXJhdGlvbiAxMDAwXHJcbiAgICAgICAgLmVhc2UgXCJjdWJpYy1pbi1vdXRcIlxyXG4gICAgICAgIC5hdHRyICd0cmFuc2Zvcm0nLCAoZCkgLT4gXCJ0cmFuc2xhdGUoMTEwMCw0NTApIHJvdGF0ZSgwKSBzY2FsZSgxLjIpXCJcclxuXHJcblxyXG4gICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gIHNob3dBY3RvcnM6IC0+XHJcblxyXG4gICAgQG1hcC5kcmF3QWN0b3JzIGdTaW1bIEBzaW0gXS5zdGVwc1swXVxyXG5cclxuICAgICMgYW5pbWF0ZVxyXG5cclxuICAgIGkgPSAwXHJcblxyXG4gICAgQG1hcC5nLnNlbGVjdEFsbCAnLmFjdG9yID4gY2lyY2xlJ1xyXG4gICAgICAuYXR0ciAncicsICcwLjAnXHJcbiAgICAgIC50cmFuc2l0aW9uKClcclxuICAgICAgICAuZGVsYXkgKGQpIC0+ICsraSAqICggNTAwIC8gMTQgKVxyXG4gICAgICAgIC5kdXJhdGlvbiA1MDBcclxuICAgICAgICAuZWFzZSBcImVsYXN0aWNcIiwgMywgMC44XHJcbiAgICAgICAgLmF0dHIgJ3InLCAnNTAuMCdcclxuXHJcbiAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgaGlkZUFjdG9yczogLT5cclxuXHJcbiAgICBAbWFwLmdcclxuICAgICAgLnNlbGVjdEFsbCBcIi5hY3RvcnNcIlxyXG4gICAgICAucmVtb3ZlKClcclxuICAgIEBtYXAuZ1xyXG4gICAgICAuc2VsZWN0QWxsIFwiLm9yZGVyc1wiXHJcbiAgICAgIC5yZW1vdmUoKVxyXG5cclxuICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICBzdGVwOiAoaWQpIC0+XHJcblxyXG4gICAgI2NvbnNvbGUubG9nIGdTaW1bIEBzaW0gXS5zdGVwc1sgaWQgXS5zdGVwY291bnRcclxuICAgIEBtYXAuZHJhd0FjdG9ycyBnU2ltWyBAc2ltIF0uc3RlcHNbIGlkIF1cclxuXHJcblxyXG5cclxuICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICBvblJlYWR5OiAoZSkgLT5cclxuXHJcbiAgICBAY3JlYXRlKClcclxuXHJcblxyXG4gICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gIG9uRnJhZ2VtZW50SGlkZTogKGUpIC0+XHJcblxyXG4gICAgaWYgZS5mcmFnbWVudC5pZC5zdGFydHNXaXRoIFwibG1fc3RlcFwiXHJcbiAgICAgIGlkID0gZS5mcmFnbWVudC5pZC5yZXBsYWNlIFwibG1fc3RlcFwiLCBcIlwiXHJcbiAgICAgIGlmIC0taWQgPD0gMFxyXG4gICAgICAgIEBoaWRlQWN0b3JzKClcclxuICAgICAgZWxzZVxyXG4gICAgICAgIEBzdGVwIGlkXHJcblxyXG4gICAgc3dpdGNoIGUuZnJhZ21lbnQuaWRcclxuXHJcbiAgICAgIHdoZW4gXCJsbV96b29tXCIgICAgICB0aGVuIEB6b29tT3V0KClcclxuICAgICAgd2hlbiBcImxtX3Nob3dcIiAgICAgIHRoZW4gQGhpZGVBY3RvcnMoKVxyXG4gICAgICB3aGVuIFwibG1fc2hvd3RyZWVcIiAgdGhlbiBAdHJlZS5nLnNlbGVjdEFsbCgnKicpLnJlbW92ZSgpXHJcblxyXG5cclxuICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICBvbkZyYWdlbWVudFNob3c6IChlKSAtPlxyXG5cclxuICAgIGlmIGUuZnJhZ21lbnQuaWQuc3RhcnRzV2l0aCBcImxtX3N0ZXBcIlxyXG4gICAgICBAc3RlcCBlLmZyYWdtZW50LmlkLnJlcGxhY2UgXCJsbV9zdGVwXCIsIFwiXCJcclxuXHJcblxyXG4gICAgc3dpdGNoIGUuZnJhZ21lbnQuaWRcclxuXHJcbiAgICAgIHdoZW4gXCJsbV9zdGFydFwiICAgICB0aGVuIEBhbmltYXRlZEluKClcclxuICAgICAgd2hlbiBcImxtX3pvb21cIiAgICAgIHRoZW4gQHpvb21Ub0FjdGlvbigpXHJcbiAgICAgIHdoZW4gXCJsbV9zaG93XCIgICAgICB0aGVuIEBzaG93QWN0b3JzKClcclxuXHJcbiAgICAgIHdoZW4gXCJsbV9zaG93dHJlZVwiXHJcbiAgICAgICAgQHRyZWUuaGlnaGxpZ2h0ID0gWzFdXHJcbiAgICAgICAgQHRyZWUuZHJhdyBAZGF0YVxyXG5cclxuICAgICAgd2hlbiBcImxtX3N0ZXAyXCJcclxuICAgICAgICBAdHJlZS5oaWdobGlnaHQgPSBbMSw4XVxyXG4gICAgICAgIEB0cmVlLmRyYXcgQGRhdGFcclxuICAgICAgd2hlbiBcImxtX3N0ZXAzXCJcclxuICAgICAgICBAdHJlZS5oaWdobGlnaHQgPSBbMSw4LDEwXVxyXG4gICAgICAgIEB0cmVlLmRyYXcgQGRhdGFcclxuXHJcbiAgICAgIHdoZW4gXCJsbV9zdGVwNFwiXHJcbiAgICAgICAgICBzZXRUaW1lb3V0ICggLT4gUmV2ZWFsLm5leHRGcmFnbWVudCgpICksIDI1MFxyXG5cclxuICAgICAgd2hlbiBcImxtX3N0ZXA1XCJcclxuICAgICAgICAgIHNldFRpbWVvdXQgKCAtPiBSZXZlYWwubmV4dEZyYWdtZW50KCkgKSwgMjUwXHJcblxyXG4gICAgICB3aGVuIFwibG1fc2NvcmVcIlxyXG4gICAgICAgICAgQHRyZWUuZy5zZWxlY3RBbGwoJyonKS5yZW1vdmUoKVxyXG5cclxuIl19