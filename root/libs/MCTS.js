var MCTS, MCTSNode, gNextID;

gNextID = 0;

MCTSNode = function(d) {
  this.id = gNextID++;
  this.visits = 0;
  this.score = 0;
  this.player = 'X';
  this.action = null;
  this.parent = null;
  this.untried = [];
  _.extend(this, d);
};

MCTS = function(state) {
  this.uctk = 0.1;
  this.iteration = 0;
  this.state = {
    player: 1,
    clone: function() {
      return this;
    },
    apply: function(action) {},
    actions: function() {
      return [];
    },
    score: function(player) {
      return 0;
    }
  };
  this.root = new MCTSNode;
  this.mostPromising = function() {
    if ((this.root == null) || (this.root.children == null) || this.root.children.length === 0) {
      return null;
    }
    return _.max(this.root.children, function(c) {
      return c.score / c.visits;
    });
  };
  this.init = function(state) {
    this.state = state;
    this.root = new MCTSNode;
    this.root.untried = state.actions();
    this.curNode = null;
    this.curState = null;
    return this.defaultPolicy = false;
  };
  this.defaultPolicy = false;
  this.curNode = null;
  this.curState = null;
  this.step = function() {
    var actions, child, children, idx, move, newnode, node, player;
    if (this.defaultPolicy) {
      actions = this.curState.actions();
      if (actions.length > 0) {
        this.curState.apply(actions[Math.floor(Math.random() * actions.length)]);
        return false;
      }
      while (this.curNode !== null) {
        this.curNode.visits = this.curNode.visits + 1;
        this.curNode.score += this.curState.score(this.curNode.player);
        this.curNode = this.curNode.parent;
      }
      this.defaultPolicy = false;
      return true;
    }
    if (this.curNode == null) {
      this.iteration++;
      this.curState = this.state.clone();
      this.curNode = this.root;
      this.defaultPolicy = false;
    }
    if (this.curNode.untried.length === 0 && (this.curNode.children != null) && this.curNode.children.length > 0) {
      node = this.curNode;
      children = _.map(this.curNode.children, function(c) {
        return {
          node: c,
          score: c.score / c.visits + 0.5 * Math.sqrt(2 * Math.log(node.visits / c.visits))
        };
      });
      child = _.last(_.sortBy(children, 'score'));
      this.curState.apply(child.node.action);
      this.curNode = child.node;
      return false;
    }
    if (this.curNode.untried.length > 0) {
      idx = Math.floor(Math.random() * this.curNode.untried.length);
      move = this.curNode.untried.splice(idx, 1)[0];
      player = this.curState.player;
      this.curState.apply(move);
      newnode = new MCTSNode({
        visits: 0,
        score: 0,
        player: player,
        action: move,
        parent: this.curNode,
        untried: this.curState.actions()
      });
      if (this.curNode.children == null) {
        this.curNode.children = [];
      }
      this.curNode.children.push(newnode);
      this.curNode = newnode;
      this.defaultPolicy = true;
      return false;
    }
  };
  this.tick = function() {
    var results, tick;
    tick = 0;
    results = [];
    while (!this.step()) {
      results.push(tick += 1);
    }
    return results;
  };
};

//# sourceMappingURL=data:application/json;base64,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QyxDQUFBLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBNUM7TUFDUCxJQUFBLEdBQU8sSUFBQyxDQUFBLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBakIsQ0FBeUIsR0FBekIsRUFBOEIsQ0FBOUIsQ0FBa0MsQ0FBQSxDQUFBO01BS3pDLE1BQUEsR0FBUyxJQUFDLENBQUEsUUFBUSxDQUFDO01BQ25CLElBQUMsQ0FBQSxRQUFRLENBQUMsS0FBVixDQUFnQixJQUFoQjtNQUtBLE9BQUEsR0FBYyxJQUFBLFFBQUEsQ0FDWjtRQUFBLE1BQUEsRUFBWSxDQUFaO1FBQ0EsS0FBQSxFQUFZLENBRFo7UUFFQSxNQUFBLEVBQVksTUFGWjtRQUdBLE1BQUEsRUFBWSxJQUhaO1FBSUEsTUFBQSxFQUFZLElBQUMsQ0FBQSxPQUpiO1FBS0EsT0FBQSxFQUFZLElBQUMsQ0FBQSxRQUFRLENBQUMsT0FBVixDQUFBLENBTFo7T0FEWTtNQVFkLElBQThCLDZCQUE5QjtRQUFBLElBQUMsQ0FBQSxPQUFPLENBQUMsUUFBVCxHQUFvQixHQUFwQjs7TUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFsQixDQUF1QixPQUF2QjtNQUNBLElBQUMsQ0FBQSxPQUFELEdBQVc7TUFFWCxJQUFDLENBQUEsYUFBRCxHQUFpQjtBQUVqQixhQUFPLE1BOUJUOztFQXZETTtFQXVGUixJQUFDLENBQUEsSUFBRCxHQUFRLFNBQUE7QUFDTixRQUFBO0lBQUEsSUFBQSxHQUFPO0FBQ0c7V0FBTSxDQUFJLElBQUMsQ0FBQSxJQUFELENBQUEsQ0FBVjttQkFBVixJQUFBLElBQVE7SUFBRSxDQUFBOztFQUZKO0FBNUhIIiwiZmlsZSI6ImxpYnMvTUNUUy5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbIiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmdOZXh0SUQgPSAwO1xuXG5NQ1RTTm9kZSA9IChkKSAtPlxuXG4gIEBpZCAgICAgICAgID0gZ05leHRJRCsrXG4gIEB2aXNpdHMgICAgID0gMFxuICBAc2NvcmUgICAgICA9IDBcbiAgQHBsYXllciAgICAgPSAnWCdcbiAgQGFjdGlvbiAgICAgPSBudWxsXG4gIEBwYXJlbnQgICAgID0gbnVsbFxuICBAdW50cmllZCAgICA9IFtdXG5cbiAgXy5leHRlbmQgdGhpcywgZFxuXG4gIHJldHVyblxuXG5cbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbk1DVFMgPSAoc3RhdGUpIC0+XG5cbiAgQHVjdGsgID0gMC4xXG4gIEBpdGVyYXRpb24gPSAwXG5cbiAgQHN0YXRlID1cbiAgICBwbGF5ZXIgICAgOiAxXG4gICAgY2xvbmUgICAgIDogLT4gcmV0dXJuIHRoaXNcbiAgICBhcHBseSAgICAgOiAoYWN0aW9uKSAtPlxuICAgIGFjdGlvbnMgICA6IC0+IHJldHVybiBbXVxuICAgIHNjb3JlICAgICA6IChwbGF5ZXIpIC0+IHJldHVybiAwXG5cbiAgQHJvb3QgPSBuZXcgTUNUU05vZGVcblxuXG4gICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgQG1vc3RQcm9taXNpbmcgPSAtPlxuICAgIHJldHVybiBudWxsIGlmIG5vdCBAcm9vdD8gb3Igbm90IEByb290LmNoaWxkcmVuPyBvciBAcm9vdC5jaGlsZHJlbi5sZW5ndGggPT0gMFxuICAgIF8ubWF4IEByb290LmNoaWxkcmVuLCAoYykgLT4gYy5zY29yZSAvIGMudmlzaXRzXG5cbiAgQGluaXQgPSAoc3RhdGUpIC0+XG5cbiAgICBAc3RhdGUgPSBzdGF0ZVxuICAgIEByb290ID0gbmV3IE1DVFNOb2RlXG4gICAgQHJvb3QudW50cmllZCA9IHN0YXRlLmFjdGlvbnMoKVxuXG4gICAgQGN1ck5vZGUgID0gbnVsbFxuICAgIEBjdXJTdGF0ZSA9IG51bGxcbiAgICBAZGVmYXVsdFBvbGljeSA9IGZhbHNlXG5cblxuXG4gIEBkZWZhdWx0UG9saWN5ID0gZmFsc2VcbiAgQGN1ck5vZGUgID0gbnVsbFxuICBAY3VyU3RhdGUgPSBudWxsXG5cbiAgQHN0ZXAgPSAtPlxuXG4gICAgIyBkZWZhdWx0IHBvbGljeVxuXG4gICAgaWYgQGRlZmF1bHRQb2xpY3lcblxuICAgICAgYWN0aW9ucyA9IEBjdXJTdGF0ZS5hY3Rpb25zKClcblxuICAgICAgaWYgYWN0aW9ucy5sZW5ndGggPiAwXG4gICAgICAgIEBjdXJTdGF0ZS5hcHBseSBhY3Rpb25zWyBNYXRoLmZsb29yIE1hdGgucmFuZG9tKCkgKiBhY3Rpb25zLmxlbmd0aCBdXG4gICAgICAgIHJldHVybiBmYWxzZVxuXG5cbiAgICAgICMgcHJvcGFnYXRlIHNjb3JlXG5cbiAgICAgIHdoaWxlIEBjdXJOb2RlICE9IG51bGxcbiAgICAgICAgQGN1ck5vZGUudmlzaXRzID0gQGN1ck5vZGUudmlzaXRzICsgMVxuICAgICAgICBAY3VyTm9kZS5zY29yZSArPSBAY3VyU3RhdGUuc2NvcmUgQGN1ck5vZGUucGxheWVyXG4gICAgICAgIEBjdXJOb2RlID0gQGN1ck5vZGUucGFyZW50XG5cbiAgICAgIEBkZWZhdWx0UG9saWN5ID0gZmFsc2VcblxuXG4gICAgICByZXR1cm4gdHJ1ZVxuXG5cblxuICAgICMgYmVnaW5cblxuICAgIGlmIG5vdCBAY3VyTm9kZT9cblxuICAgICAgQGl0ZXJhdGlvbisrXG5cbiAgICAgIEBjdXJTdGF0ZSAgICAgICA9IEBzdGF0ZS5jbG9uZSgpXG4gICAgICBAY3VyTm9kZSAgICAgICAgPSBAcm9vdFxuICAgICAgQGRlZmF1bHRQb2xpY3kgID0gZmFsc2VcblxuXG4gICAgIyBzZWxlY3RcblxuICAgIGlmIEBjdXJOb2RlLnVudHJpZWQubGVuZ3RoID09IDAgYW5kIEBjdXJOb2RlLmNoaWxkcmVuPyBhbmQgQGN1ck5vZGUuY2hpbGRyZW4ubGVuZ3RoID4gMFxuXG4gICAgICBub2RlID0gQGN1ck5vZGVcblxuICAgICAgY2hpbGRyZW4gPSBfLm1hcCBAY3VyTm9kZS5jaGlsZHJlbiwgKGMpIC0+IHsgbm9kZTogYywgc2NvcmU6IGMuc2NvcmUgLyBjLnZpc2l0cyArIDAuNSAqIE1hdGguc3FydCggMiAqIE1hdGgubG9nKCBub2RlLnZpc2l0cyAvIGMudmlzaXRzICkgKSB9XG4gICAgICBjaGlsZCA9IF8ubGFzdCBfLnNvcnRCeSBjaGlsZHJlbiwgJ3Njb3JlJ1xuXG4gICAgICBAY3VyU3RhdGUuYXBwbHkgY2hpbGQubm9kZS5hY3Rpb25cbiAgICAgIEBjdXJOb2RlICA9IGNoaWxkLm5vZGVcblxuICAgICAgcmV0dXJuIGZhbHNlXG5cblxuICAgICMgZXhwYW5kXG5cbiAgICBpZiBAY3VyTm9kZS51bnRyaWVkLmxlbmd0aCA+IDBcblxuICAgICAgIyByZW1vdmUgcmFuZG9tIGFjdGlvbiBmcm9tIGxpc3RcblxuICAgICAgaWR4ICA9IE1hdGguZmxvb3IgTWF0aC5yYW5kb20oKSAqIEBjdXJOb2RlLnVudHJpZWQubGVuZ3RoXG4gICAgICBtb3ZlID0gQGN1ck5vZGUudW50cmllZC5zcGxpY2UoIGlkeCwgMSApWzBdXG5cblxuICAgICAgIyBhcHBseVxuXG4gICAgICBwbGF5ZXIgPSBAY3VyU3RhdGUucGxheWVyXG4gICAgICBAY3VyU3RhdGUuYXBwbHkgbW92ZVxuXG5cbiAgICAgICMgYWRkIG5ldyBub2RlIHRvIHRyZWVcblxuICAgICAgbmV3bm9kZSA9IG5ldyBNQ1RTTm9kZVxuICAgICAgICB2aXNpdHMgICAgOiAwXG4gICAgICAgIHNjb3JlICAgICA6IDBcbiAgICAgICAgcGxheWVyICAgIDogcGxheWVyXG4gICAgICAgIGFjdGlvbiAgICA6IG1vdmVcbiAgICAgICAgcGFyZW50ICAgIDogQGN1ck5vZGVcbiAgICAgICAgdW50cmllZCAgIDogQGN1clN0YXRlLmFjdGlvbnMoKVxuXG4gICAgICBAY3VyTm9kZS5jaGlsZHJlbiA9IFtdIHVubGVzcyBAY3VyTm9kZS5jaGlsZHJlbj9cbiAgICAgIEBjdXJOb2RlLmNoaWxkcmVuLnB1c2ggbmV3bm9kZVxuICAgICAgQGN1ck5vZGUgPSBuZXdub2RlXG5cbiAgICAgIEBkZWZhdWx0UG9saWN5ID0gdHJ1ZVxuXG4gICAgICByZXR1cm4gZmFsc2VcblxuICBAdGljayA9IC0+XG4gICAgdGljayA9IDBcbiAgICB0aWNrICs9IDEgd2hpbGUgbm90IEBzdGVwKClcblxuICByZXR1cm5cblxuXG4iXX0=