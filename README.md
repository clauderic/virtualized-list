# virtualized-list
> A tiny vanilla, dependency free, virtualization library

[![npm package][npm-badge]][npm]

Installation
------------

Using [npm](https://www.npmjs.com/package/virtualized-list):

	$ npm install virtualized-list --save
	
Usage
------------
### Basic example
```js
const virtualizedList = new VirtualizedList(element, {
  data: ['a', 'b', 'c', 'd'],
  renderRow: (row, index) => {
  	const element = document.createElement('div');
  	element.innerHTML = row;
  	
  	return element;
  },
  rowHeight: 150
)}
```

### Advanced example
```js
const virtualizedList = new VirtualizedList(element, {
  data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  renderRow: (row, index) => {
  	const element = document.createElement('div');
  	element.innerHTML = row;
  	
  	return element;
  },
  rowHeight: [150, 120, 100, 80, 50, 35, 200, 500, 50, 300],
  overscanCount: 5, // Number of rows to render above/below the visible rows.
  onMount: () => {
  	// Once the component has mounted, we set an initial index to scrollTo
  	virtualizedList.scrollToIndex(10);
  }
)}
```

[npm-badge]: https://img.shields.io/npm/v/virtualized-list.svg
[npm]: https://www.npmjs.org/package/virtualized-list
