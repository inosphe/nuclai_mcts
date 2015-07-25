var Tree,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Tree = function(cfg) {
  var xtree;
  this.idx = 0;
  this.g = null;
  this.width = 960;
  this.height = 600;
  this.highlight = [1];
  this.depth = 200;
  this.colour = null;
  this.position = null;
  this.diagonal = d3.svg.diagonal.radial().projection(function(d) {
    return [d.y, (d.x + 90) / 180 * Math.PI];
  });
  this.tree = d3.layout.tree().size([360, this.height / 2 - 50]).separation(function(a, b) {
    return (a.parent === b.parent ? 1 : 2) / (a.depth > 0 ? a.depth : 1);
  });
  this.heatmap = d3.scale.linear().domain([0.0, 0.25, 0.5, 0.75, 1.0]).range(["#d7191c", "#fdae61", "#ffffbf", "#a6d96a", "#1a9641"]);
  xtree = this;
  this.translate = function(d) {
    return "rotate( " + d.x + " ) translate( " + d.y + " )";
  };
  this.stroke = function(d) {
    var ref;
    if (ref = d.id, indexOf.call(xtree.highlight, ref) >= 0) {
      return 'black';
    } else {
      return '';
    }
  };
  _.extend(this, cfg);
  this.draw = function(root) {
    var enter, link, links, node, nodes;
    xtree = this;
    root.x0 = 0;
    root.y0 = 0;
    if (this.position != null) {
      this.position(this.g);
    } else {
      this.g.attr('transform', "translate( " + (this.width / 2) + ", " + (this.height / 2) + ")");
    }
    this.g.selectAll('.link').remove();
    this.g.selectAll('.node').remove();
    nodes = this.tree.nodes(root);
    links = this.tree.links(nodes);
    nodes.forEach(function(d) {
      return d.y = d.depth * xtree.depth;
    });
    link = this.g.selectAll('.link').data(links);
    enter = link.enter().append('path').attr('class', 'link').attr('d', this.diagonal).attr('stroke', function(d) {
      var ref, ref1;
      if ((ref = d.source.id, indexOf.call(xtree.highlight, ref) >= 0) && (ref1 = d.target.id, indexOf.call(xtree.highlight, ref1) >= 0)) {
        return "black";
      } else {
        return "#ccc";
      }
    }).attr('stroke-width', function(d) {
      var ref, ref1;
      if ((ref = d.source.id, indexOf.call(xtree.highlight, ref) >= 0) && (ref1 = d.target.id, indexOf.call(xtree.highlight, ref1) >= 0)) {
        return '3px';
      } else {
        return '1.5px';
      }
    });
    node = this.g.selectAll('.node').data(nodes, function(d) {
      return d.id || (d.id = ++xtree.idx);
    });
    enter = node.enter().append('g').attr('class', 'node').attr('transform', xtree.translate).attr('id', function(d) {
      return "node_" + d.id;
    });
    return enter.append('circle').attr('r', 30).attr('stroke', xtree.stroke).attr('stroke-width', function(d) {
      var ref;
      if (ref = d.id, indexOf.call(xtree.highlight, ref) >= 0) {
        return '3px';
      } else {
        return '1.5px';
      }
    }).attr('fill', function(d) {
      if (xtree.colour != null) {
        return xtree.colour(d);
      } else if (d.parent === null || d.visits === 0) {
        return '#ccc';
      } else {
        return xtree.heatmap(d.score / d.visits);
      }
    });
  };
};

//# sourceMappingURL=data:application/json;base64,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LENBQUMsQ0FBQyxNQUFGLEtBQVksSUFBWixJQUFvQixDQUFDLENBQUMsTUFBRixLQUFZLENBQW5DO2VBQ0gsT0FERztPQUFBLE1BQUE7ZUFHSCxLQUFLLENBQUMsT0FBTixDQUFjLENBQUMsQ0FBQyxLQUFGLEdBQVUsQ0FBQyxDQUFDLE1BQTFCLEVBSEc7O0lBSGUsQ0FQMUI7RUF0RE07QUFsQ0giLCJmaWxlIjoibGlicy9UcmVlLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsiIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuVHJlZSA9IChjZmcpIC0+XG5cbiAgQGlkeCAgICAgICAgPSAwXG4gIEBnICAgICAgICAgID0gbnVsbFxuICBAd2lkdGggICAgICA9IDk2MFxuICBAaGVpZ2h0ICAgICA9IDYwMFxuICBAaGlnaGxpZ2h0ICA9IFsxXVxuICBAZGVwdGggICAgICA9IDIwMFxuXG4gIEBjb2xvdXIgICAgID0gbnVsbFxuICBAcG9zaXRpb24gICA9IG51bGxcblxuICBAZGlhZ29uYWwgPSBkMy5zdmcuZGlhZ29uYWwucmFkaWFsKCkucHJvamVjdGlvbiAoZCkgLT4gWyBkLnksICggZC54ICsgOTAgKSAvIDE4MCAqIE1hdGguUEkgXVxuXG4gIEB0cmVlID0gZDMubGF5b3V0LnRyZWUoKVxuICAgIC5zaXplICAgICAgIFsgMzYwLCBAaGVpZ2h0IC8gMiAgLSA1MCBdXG4gICAgLnNlcGFyYXRpb24gKGEsIGIpIC0+IChpZiBhLnBhcmVudCA9PSBiLnBhcmVudCB0aGVuIDEgZWxzZSAyKSAvIGlmIGEuZGVwdGggPiAwIHRoZW4gYS5kZXB0aCBlbHNlIDFcblxuICBAaGVhdG1hcCA9IGQzLnNjYWxlLmxpbmVhcigpXG4gICAgLmRvbWFpbiBbIDAuMCwgMC4yNSwgMC41LCAwLjc1LCAxLjAgXVxuICAgICMucmFuZ2UgIFsgXCIjMmM3YmI2XCIsIFwiI2FiZDllOVwiLCBcIiNmZmZmYmZcIiwgXCIjZmRhZTYxXCIsIFwiI2Q3MTkxY1wiIF1cbiAgICAucmFuZ2UgIFsgXCIjZDcxOTFjXCIsXCIjZmRhZTYxXCIsXCIjZmZmZmJmXCIsXCIjYTZkOTZhXCIsXCIjMWE5NjQxXCIgXVxuXG4gIHh0cmVlID0gdGhpc1xuXG4gIEB0cmFuc2xhdGUgID0gKGQpIC0+IFwicm90YXRlKCAjeyBkLnggfSApIHRyYW5zbGF0ZSggI3sgZC55IH0gKVwiXG4gIEBzdHJva2UgICAgID0gKGQpIC0+IGlmIGQuaWQgaW4geHRyZWUuaGlnaGxpZ2h0IHRoZW4gJ2JsYWNrJyBlbHNlICcnXG5cbiAgXy5leHRlbmQgdGhpcywgY2ZnXG5cblxuXG4gICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgQGRyYXcgPSAocm9vdCkgLT5cblxuICAgIHh0cmVlID0gdGhpc1xuXG4gICAgcm9vdC54MCA9IDBcbiAgICByb290LnkwID0gMFxuXG4gICAgaWYgQHBvc2l0aW9uP1xuICAgICAgQHBvc2l0aW9uIEBnXG4gICAgZWxzZVxuICAgICAgQGcuYXR0ciAndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoICN7IEB3aWR0aCAvIDIgfSwgI3sgQGhlaWdodCAvIDIgfSlcIlxuXG4gICAgQGdcbiAgICAgIC5zZWxlY3RBbGwgJy5saW5rJ1xuICAgICAgLnJlbW92ZSgpXG5cbiAgICBAZ1xuICAgICAgLnNlbGVjdEFsbCAnLm5vZGUnXG4gICAgICAucmVtb3ZlKClcblxuXG4gICAgbm9kZXMgPSBAdHJlZS5ub2RlcyByb290XG4gICAgbGlua3MgPSBAdHJlZS5saW5rcyBub2Rlc1xuXG5cbiAgICAjIGZpeGVkIGRlcHRoXG5cbiAgICBub2Rlcy5mb3JFYWNoIChkKSAtPiBkLnkgPSBkLmRlcHRoICogeHRyZWUuZGVwdGhcblxuICAgIGxpbmsgPSBAZ1xuICAgICAgICAgICAgLnNlbGVjdEFsbCAnLmxpbmsnXG4gICAgICAgICAgICAuZGF0YSBsaW5rc1xuXG4gICAgZW50ZXIgPSBsaW5rXG4gICAgICAgICAgICAuZW50ZXIoKVxuICAgICAgICAgICAgLmFwcGVuZCAncGF0aCdcbiAgICAgICAgICAgICAgLmF0dHIgJ2NsYXNzJywgICAgICAgICdsaW5rJ1xuICAgICAgICAgICAgICAuYXR0ciAnZCcsICAgICAgICAgICAgQGRpYWdvbmFsXG4gICAgICAgICAgICAgIC5hdHRyICdzdHJva2UnLCAgICAgICAoZCkgLT4gaWYgZC5zb3VyY2UuaWQgaW4geHRyZWUuaGlnaGxpZ2h0IGFuZCBkLnRhcmdldC5pZCBpbiB4dHJlZS5oaWdobGlnaHQgdGhlbiBcImJsYWNrXCIgZWxzZSBcIiNjY2NcIlxuICAgICAgICAgICAgICAuYXR0ciAnc3Ryb2tlLXdpZHRoJywgKGQpIC0+IGlmIGQuc291cmNlLmlkIGluIHh0cmVlLmhpZ2hsaWdodCBhbmQgZC50YXJnZXQuaWQgaW4geHRyZWUuaGlnaGxpZ2h0IHRoZW4gJzNweCcgZWxzZSAnMS41cHgnXG5cblxuXG4gICAgbm9kZSA9IEBnXG4gICAgICAgICAgICAuc2VsZWN0QWxsICcubm9kZSdcbiAgICAgICAgICAgIC5kYXRhIG5vZGVzLCAoZCkgLT4gcmV0dXJuIGQuaWQgfHwgKGQuaWQgPSArK3h0cmVlLmlkeClcblxuICAgIGVudGVyID0gbm9kZVxuICAgICAgICAgICAgICAuZW50ZXIoKVxuICAgICAgICAgICAgICAuYXBwZW5kICdnJ1xuICAgICAgICAgICAgICAgIC5hdHRyICdjbGFzcycsICAgICAgJ25vZGUnXG4gICAgICAgICAgICAgICAgLmF0dHIgJ3RyYW5zZm9ybScsICB4dHJlZS50cmFuc2xhdGVcbiAgICAgICAgICAgICAgICAuYXR0ciAnaWQnLCAgICAgICAgIChkKSAtPiBcIm5vZGVfI3tkLmlkfVwiXG5cbiAgICBlbnRlclxuICAgICAgLmFwcGVuZCAnY2lyY2xlJ1xuXG4gICAgICAgIC5hdHRyICdyJywgMzBcblxuICAgICAgICAuYXR0ciAnc3Ryb2tlJywgICAgICAgeHRyZWUuc3Ryb2tlXG4gICAgICAgIC5hdHRyICdzdHJva2Utd2lkdGgnLCAoZCkgLT4gaWYgZC5pZCBpbiB4dHJlZS5oaWdobGlnaHQgdGhlbiAnM3B4JyBlbHNlICcxLjVweCdcbiAgICAgICAgLmF0dHIgJ2ZpbGwnLCAgICAgICAgIChkKSAtPlxuICAgICAgICAgIGlmIHh0cmVlLmNvbG91cj9cbiAgICAgICAgICAgIHJldHVybiB4dHJlZS5jb2xvdXIgZFxuICAgICAgICAgIGVsc2UgaWYgZC5wYXJlbnQgPT0gbnVsbCBvciBkLnZpc2l0cyA9PSAwXG4gICAgICAgICAgICAnI2NjYydcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB4dHJlZS5oZWF0bWFwIGQuc2NvcmUgLyBkLnZpc2l0c1xuXG5cblxuICByZXR1cm5cblxuIl19