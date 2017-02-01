import VirtualizedList from '../../src';

const ROW_HEIGHT = 80;
const CONTAINER_STYLE = 'width: 400px; height: 600px; overflow-y: auto; border: 1px solid #DDD; margin: 50px auto;';
const ELEMENT_STYLE = `height: ${ROW_HEIGHT}px; border-bottom: 1px solid #DDD; box-sizing: border-box; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px; font-family: sans-serif; color: #333;';`;

// Here, we're generating an array of 1000 numbers [0, 1, 2, 3, 4, ...] to use as our dataset
const data = Array.from(Array(1000).keys());

(function() {
  // Make sure you have a container to render into
  const container = document.createElement('div');
  container.setAttribute('style', CONTAINER_STYLE);
  document.body.append(container);

  // Initialize our VirtualizedList
  var virtualizedList = new VirtualizedList(container, {
    data,
    rowHeight: ROW_HEIGHT,
    renderRow: (row) => {
      const element = document.createElement('div');
      element.setAttribute('style', ELEMENT_STYLE);
      element.innerHTML = row;

      return element;
    }
  });
})();
