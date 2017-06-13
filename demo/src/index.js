import VirtualizedList from '../../src';

const ROW_HEIGHT_POSSIBILITIES = [70, 110, 140, 70, 90, 70];
const CONTAINER_HEIGHT = 600;
const CONTAINER_STYLE = `width: 400px; height: ${CONTAINER_HEIGHT}px; overflow-y: auto; border: 1px solid #DDD; margin: 50px auto;`;
const ELEMENT_STYLE = `border-bottom: 1px solid #DDD; box-sizing: border-box; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px; font-family: sans-serif; color: #333;';`;
const INPUT_STYLE = `display: block; margin: 0 auto; width: 400px; padding: 10px; box-sizing: border-box; font-size: 20px; border-radius: 3px; border: 1px solid #ddd; -webkit-appearance: none;`;
const LABEL_STYLE = `display: block; width: 400px; margin: 10px auto; font-size: 17px; font-family: sans-serif;`;

// Here, we're generating an array of 1000 numbers [0, 1, 2, 3, 4, ...] to use as our dataset
const data = Array.from(Array(1000).keys());

function getRandomHeight() {
  return ROW_HEIGHT_POSSIBILITIES[Math.floor(Math.random()*ROW_HEIGHT_POSSIBILITIES.length)];
}
const rowHeights = data.map(getRandomHeight);

(function() {
  // Make sure you have a container to render into
  const container = document.createElement('div');
  const input = document.createElement('input');
  const label = document.createElement('label');

  label.innerHTML = 'Row count:'
  label.setAttribute('style', LABEL_STYLE);

  container.setAttribute('style', CONTAINER_STYLE);

  input.setAttribute('style', INPUT_STYLE);
  input.setAttribute('type', 'number');
  input.value = data.length;
  input.addEventListener('input', (event) => {
    virtualizedList.setRowCount(parseInt(event.target.value, 10));
  });

  document.body.append(label);
  document.body.append(input);
  document.body.append(container);

  // Initialize our VirtualizedList
  var virtualizedList = new VirtualizedList(container, {
    height: CONTAINER_HEIGHT,
    rowCount: data.length,
    rowHeight: rowHeights,
    estimatedRowHeight: 100,
    renderRow: (index) => {
      const element = document.createElement('div');
      element.setAttribute('style', `height: ${rowHeights[index]}px; ${ELEMENT_STYLE}`);
      element.innerHTML = `Row #${index}`;

      return element;
    },
    initialIndex: 50,
  });
})();
