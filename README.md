# virtualized-list
> A tiny vanilla virtualization library, with DOM diffing

[![npm package][npm-badge]][npm]
[![Build Status](https://travis-ci.org/clauderic/virtualized-list.svg?branch=master)](https://travis-ci.org/clauderic/virtualized-list)
[![codecov](https://codecov.io/gh/clauderic/virtualized-list/branch/master/graph/badge.svg)](https://codecov.io/gh/clauderic/virtualized-list)

<a target='_blank' rel='nofollow' href='https://app.codesponsor.io/link/oN9PDWZz8fQcbh9sxpDEUvD5/clauderic/virtualized-list'>
  <img alt='Sponsor' width='888' height='68' src='https://app.codesponsor.io/embed/oN9PDWZz8fQcbh9sxpDEUvD5/clauderic/virtualized-list.svg' />
</a>

Getting Started
------------

Using [npm](https://www.npmjs.com/):
```
npm install virtualized-list --save
```


ES6, CommonJS, and UMD builds are available with each distribution. For example:
```js
import VirtualizedList from 'virtualized-list';
```

You can also use a global-friendly UMD build:
```html
<script src="virtualized-list/umd/virtualized-list.js"></script>
<script>
var VirtualizedList = window.VirtualizedList.default;
...
</script>
```

Usage
------------
### Basic example
```js
const rows = ['a', 'b', 'c', 'd'];

const virtualizedList = new VirtualizedList(container, {
  height: 500, // The height of the container
  rowCount: rows.length,
  renderRow: index => {
  	const element = document.createElement('div');
  	element.innerHTML = rows[index];

  	return element;
  },
  rowHeight: 150,
});
```
[Demo](https://jsfiddle.net/wq3b9k8b/2/)

### Advanced example
```js
const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const rowHeights = [150, 120, 100, 80, 50, 35, 200, 500, 50, 300];

const virtualizedList = new VirtualizedList(container, {
  height: 400,
  rowCount: rows.length,
  renderRow: (index) => {
  	const element = document.createElement('div');
  	element.innerHTML = row;

  	return element;
  },
  rowHeight: index => rowHeights[index],
  estimatedRowHeight: 155,
  overscanCount: 5, // Number of rows to render above/below the visible rows.
  initialScrollIndex: 8,
  onMount: () => {
    // Programatically scroll to item index #3 after 2 seconds
    setTimeout(() =>
      virtualizedList.scrollToIndex(3)
    , 2000);
  }
})
```


Options
------------

| Property           | Type                      | Required? | Description                                                                                                                                                                       |
|:-------------------|:--------------------------|:----------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| height             | Number                    | ✓         | Height of List. This property will determine the number of rendered vs virtualized items                                                                                          |
| rowCount           | Number                    | ✓         | The number of rows you want to render                                                                                                                                             |
| renderRow          | Function                  | ✓         | Responsible for rendering an item given it's index: `({index: number, style: Object}): HTMLElement`. The returned element must handle key and style.                     |
| rowHeight          | Number, Array or Function | ✓         | Either a fixed height, an array containing the heights of all the items in your list, or a function that returns the height of an item given its index: `(index: number): number` |
| initialScrollTop   | Number                    |           | The initial scrollTop value (optional)                                                                                                                                            |
| initialIndex       | Number                    |           | Initial item index to scroll to (by forcefully scrolling if necessary)                                                                                                            |
| overscanCount      | Number                    |           | Number of extra buffer items to render above/below the visible items. Tweaking this can help reduce scroll flickering on certain browsers/devices. Defaults to `3`                |
| estimatedRowHeight | Number                    |           | Used to estimate the total size of the list before all of its items have actually been measured. The estimated total height is progressively adjusted as items are rendered.      |
| onMount            | Function                  |           | Callback invoked once the virtual list has mounted.                                                                                                                               |
| onScroll           | Function                  |           | Callback invoked onScroll. `function (scrollTop, event)`                                                                                                                          |
| onRowsRendered     | Function                  |           | Callback invoked with information about the range of rows just rendered                                                                                                           |

Public Instance Methods
------------

#### `scrollToIndex (index: number, alignment: 'start' | 'center' | 'end')`
This method scrolls to the specified index. The `alignment` param controls the alignment scrolled-to-rows. Use "start" to always align rows to the top of the list and "end" to align them bottom. Use "center" to align them in the middle of container.

#### `setRowCount (count: number)`
This method updates the total number of rows (`rowCount`) and will force the list to re-render.

## Reporting Issues
Found an issue? Please [report it](https://github.com/clauderic/virtualized-list/issues) along with any relevant details to reproduce it.

## Contributions
Feature requests / pull requests are welcome, though please take a moment to make sure your contributions fits within the scope of the project.

## License
virtualized-list is available under the MIT License.

[npm-badge]: https://img.shields.io/npm/v/virtualized-list.svg
[npm]: https://www.npmjs.org/package/virtualized-list
