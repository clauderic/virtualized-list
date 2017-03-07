# virtualized-list
> A tiny vanilla virtualization library, with DOM diffing

[![npm package][npm-badge]][npm]

Installation
------------

Using [npm](https://www.npmjs.com/package/virtualized-list):

	$ npm install virtualized-list --save

Usage
------------
### Basic example
```js
const rows = ['a', 'b', 'c', 'd'];

const virtualizedList = new VirtualizedList(element, {
  height: 500,
  rowCount: rows.length,
  renderRow: index => {
  	const element = document.createElement('div');
  	element.innerHTML = rows[index];

  	return element;
  },
  rowHeight: 150,
)};
```

### Advanced example
```js
const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const rowHeights = [150, 120, 100, 80, 50, 35, 200, 500, 50, 300];

const virtualizedList = new VirtualizedList(element, {
  rowCount: rows.length,
  renderRow: (row, index) => {
  	const element = document.createElement('div');
  	element.innerHTML = row;

  	return element;
  },
  rowHeight: index => rowHeights[index],
  estimatedRowHeight: 155,
  overscanCount: 5, // Number of rows to render above/below the visible rows.
  initialScrollIndex: 8,
  onMount: () => {
  	console.log('Virtual list has mounted');
  }
)}
```

[npm-badge]: https://img.shields.io/npm/v/virtualized-list.svg
[npm]: https://www.npmjs.org/package/virtualized-list
