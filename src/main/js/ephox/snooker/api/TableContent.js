define(
  'ephox.snooker.api.TableContent',

  [
    'ephox.compass.Arr',
    'ephox.oath.navigation.Descend',
    'ephox.robin.api.dom.DomStructure',
    'ephox.sugar.api.Compare',
    'ephox.sugar.api.Element',
    'ephox.sugar.api.InsertAll',
    'ephox.sugar.api.Node',
    'ephox.sugar.api.PredicateFind',
    'ephox.sugar.api.Remove',
    'ephox.sugar.api.TextContent',
    'ephox.sugar.api.Traverse'
  ],

  function (Arr, Descend, DomStructure, Compare, Element, InsertAll, Node, PredicateFind, Remove, TextContent, Traverse) {
    var merge = function (cells) {
      var isBr = function (el) {
        return Node.name(el) === 'br';
      };

      var advancedBr = function (cell) {
        return TextContent.get(cell).trim() === 0;
      };

      var isListItem = function (el) {
        return Node.name(el) === 'li' || PredicateFind.ancestor(el, DomStructure.isList).isSome();
      };

      var siblingIsBlock = function (el) {
        return Traverse.nextSibling(el).each(function (rightSibling) {
          if (DomStructure.isBlock(rightSibling)) return true;
          if (DomStructure.isEmptyTag(rightSibling)) {
            return Node.name(rightSibling) === 'img' ? false : true;
          }
        }).getOr(false);
      };

      var markCell = function (cell) {
        return Descend.lastCursor(cell).bind(function (rightEdge) {
          var rightSiblingIsBlock = siblingIsBlock(rightEdge);
          return Traverse.parent(rightEdge).map(function (parent) {
            return rightSiblingIsBlock === true || isListItem(parent) || isBr(rightEdge) || (DomStructure.isBlock(parent) && !Compare.eq(cell, parent)) ? [] :  [ Element.fromTag('br') ];
          });
        }).getOr([]);
      };

      var markContent = function () {
        var content = Arr.bind(cells, function (cell, i) {
          var children = Traverse.children(cell);
          // When the last element within the cell is an inline element, we mark it by adding a <br> to the end of its children.
          return children.length > 1 || advancedBr(cell) ? children.concat(markCell(cell)) : [];
        });

        return content.length === 0 ? [ Element.fromTag('br') ] : content;

      };

      var contents = markContent();
      Remove.empty(cells[0]);
      InsertAll.append(cells[0], contents);
    };

    return {
      merge: merge
    };
  }
);