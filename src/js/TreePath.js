'use strict';

var ContextMenu = require('./ContextMenu');

/**
 * Creates a component that visualize path selection in tree based editors
 * @param {HTMLElement} container 
 * @constructor
 */
function TreePath(container) {
  if (container) {
    this.path = document.createElement('div');
    this.path.className = 'jsoneditor-treepath';
    container.appendChild(this.path);
    this.reset();
  }
};

/**
 * Reset component to initial status
 */
TreePath.prototype.reset = function () {
  this.path.innerHTML = '';
}

/**
 * Renders the component UI according to a given path objects
 * @param {Array<name: String, childs: Array>} pathObjs a list of path objects
 * 
 */
TreePath.prototype.setPath = function (pathObjs) {
  var me = this;
  this.reset();
  if (pathObjs && pathObjs.length) {
    pathObjs.forEach(function (pathObj, idx) {
      var pathEl = document.createElement('span');
      pathEl.className = 'jsoneditor-treepath-element';
      pathEl.innerText = pathObj.name;
      pathEl.onclick = _onSegmentClick.bind(me, pathObj);
  
      me.path.appendChild(pathEl);

      if (pathObj.children.length) {
        var sepEl = document.createElement('span');
        sepEl.className = 'jsoneditor-treepath-seperator';
        sepEl.innerHTML = '&#8811;';

        sepEl.onclick = function () {
          var items = [];
          pathObj.children.forEach(function (child) {
            items.push({
              'text': child.name,
              'className': 'jsoneditor-type-modes' + (pathObjs[idx + 1] + 1 && pathObjs[idx + 1].name === child.name ? ' jsoneditor-selected' : ''),
              'click': _onContextMenuItemClick.bind(me, pathObj, child.name)
            });
          });
          var menu = new ContextMenu(items);
          menu.show(sepEl);
        };

        me.path.appendChild(sepEl, me.container);
      }
    });
  }

  function _onSegmentClick(pathObj) {
    if (this.selectionCallback) {
      this.selectionCallback(pathObj);
    }
  };

  function _onContextMenuItemClick(pathObj, selection) {
    if (this.contextMenuCallback) {
      this.contextMenuCallback(pathObj, selection);
    }
  };
};

/**
 * set a callback function for selection of path section
 * @param {Function} callback function to invoke when section is selected
 */
TreePath.prototype.onSectionSelected = function (callback) {
  if (typeof callback === 'function') {
    this.selectionCallback = callback;      
  }
};

/**
 * set a callback function for selection of path section
 * @param {Function} callback function to invoke when section is selected
 */
TreePath.prototype.onContextMenuItemSelected = function (callback) {
  if (typeof callback === 'function') {
    this.contextMenuCallback = callback;
  }
};

module.exports = TreePath;