import {InfiniteVirtualList} from '../../src';

const ROW_HEIGHT_POSSIBILITIES = [70, 110, 140, 70, 90, 70];
const CONTAINER_STYLE = 'width: 400px; height: 600px; overflow-y: auto; border: 1px solid #DDD; margin: 50px auto;';
const ELEMENT_STYLE = `border-bottom: 1px solid #DDD; box-sizing: border-box; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px; font-family: sans-serif; color: #333;';`;

// Here, we're generating an array of 1000 numbers [0, 1, 2, 3, 4, ...] to use as our dataset
const data = Array.from(Array(1000).keys());

function getRandomHeight() {
  return ROW_HEIGHT_POSSIBILITIES[Math.floor(Math.random()*ROW_HEIGHT_POSSIBILITIES.length)];
}
const rowHeights = data.map(getRandomHeight);

const STATUS_LOADED = 1;

(function() {
  // Make sure you have a container to render into
  const container = document.createElement('div');
  container.setAttribute('style', CONTAINER_STYLE);
  document.body.append(container);

  const loadedRows = {};

  // Initialize our VirtualizedList
  const virtualizedList = new InfiniteVirtualList(container, {
    height: 600,
    rowCount: data.length,
    rowHeight: rowHeights,
    isRowLoaded: index => loadedRows[index] === STATUS_LOADED,
    loadMoreRows: ({startIndex, stopIndex}) => {
      return new Promise(resolve => setTimeout(() => {
        for (let i = startIndex; i <= stopIndex; i++) {
          loadedRows[i] = STATUS_LOADED;
        }

        resolve();
      }, 1000));
    },
    renderRow: (index) => {
      const element = document.createElement('div');
      element.nodeIndex = index;
      element.setAttribute('style', `height: ${rowHeights[index]}px; ${ELEMENT_STYLE}`);
      element.innerHTML = (loadedRows[index] === STATUS_LOADED)
        ? `Row ${index}`
        : 'Loading...';

      return element;
    }
  });
})();
