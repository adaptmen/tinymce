define(
  'ephox.phoenix.api.dom.DomGather',

  [
    'ephox.boss.api.DomUniverse',
    'ephox.phoenix.api.general.Gather'
  ],

  /**
   * Documentation is in the actual implementations.
   */
  function (DomUniverse, Gather) {
    var universe = DomUniverse();

    var gather = function (element, prune, transform) {
      return Gather.gather(universe, element, prune, transform);
    };

    var before = function (element, isRoot) {
      return Gather.before(universe, element, isRoot);
    };

    var after = function (element, isRoot) {
      return Gather.after(universe, element, isRoot);
    };

    var seekLeft = function (element, isRoot) {
      return Gather.seekLeft(universe, element, isRoot);
    };

    var seekRight = function (element, isRoot) {
      return Gather.seekRight(universe, element, isRoot);
    };

    var walkers = function () {
      return Gather.walkers();
    };

    var walk = function (item, mode, direction, _rules) {
      return Gather.walk(universe, item, mode, direction, _rules);
    };

    return {
      gather: gather,
      before: before,
      after: after,
      seekLeft: seekLeft,
      seekRight: seekRight,
      walkers: walkers,
      walk: walk
      // Due to exact references being required, these can't go through the DOM layer.
      // backtrack: backtrack,
      // sidestep: sidestep,
      // advance: advance
    };
  }
);
