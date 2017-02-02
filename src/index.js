/** Virtualized list, only renders visible items.
 *  @param  {Array<*>} data           List of data items
 *  @param  {Function} renderRow      Renders a single row
 *  @param  {Number}   rowHeight      Static height of a row
 *  @param  {Number}   overscanCount  Amount of rows to render above and below visible area of the list
 *  @param  {Function} onMount        Callback that is invoked after the list has mounted
 *  @method {Function} scrollToIndex  Method used to scroll to any given index
 *
 *  @example
 *  new VirtualizedList(element, {
 *    data: ['a', 'b', 'c'],
 *    renderRow: (row, index) => { <div>{row}</div> },
 *    rowHeight: 150,
 *    overscanCount: 5
 *  )}
 *
 */

import CellSizeAndPositionManager from './CellSizeAndPositionManager';

const STYLE_INNER = 'position:relative; overflow:hidden; width:100%; min-height:100%;';
const STYLE_CONTENT = 'position:absolute; top:0; left:0; height:100%; width:100%; overflow:visible;';

export default class VirtualizedList {
  constructor(container, options) {
    this.container = container;
    this.options = options;

    // Initialization
    this.state = {};
    this._rowSizeAndPositionManager = new CellSizeAndPositionManager({
      cellCount: options.data.length,
      cellSizeGetter: ({index}) => this.getRowHeight(index),
      estimatedCellSize: options.estimatedRowHeight || 100
    });

    // Binding
    this.render = this.render.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.resize = this.resize.bind(this);

    // Lifecycle Methods
    this.componentWillMount();
    this.componentDidMount();
  }

  componentWillMount() {
    let inner = this.inner = document.createElement('div');
    let content = this.content = document.createElement('div');

    inner.setAttribute('style', STYLE_INNER);
    content.setAttribute('style', STYLE_CONTENT);
    inner.appendChild(content);
    this.container.appendChild(inner);
  }

  componentDidMount() {
    const {onMount} = this.options;

    // Resize
    this.resize(onMount);

    // Add event listeners
    this.container.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.resize);
  }

  setState(state = {}, callback) {
    this.state = Object.assign(this.state, state);

    window.requestAnimationFrame(() => {
      this.render();

      if (typeof callback === 'function') {
        callback();
      }
    });
  }

  resize(callback) {
    if (this.state.height !== this.container.offsetHeight) {
      this.setState({
        height: this.container.offsetHeight
      }, callback);
    }
  }

  handleScroll() {
    this.setState({
      offset: this.container.scrollTop
    });
  }

  getRowHeight(index) {
    const {rowHeight} = this.options;

    return (Array.isArray(rowHeight)) ? rowHeight[index] : rowHeight;
  }

  getRowOffset(index) {
    const {offset} = this._rowSizeAndPositionManager.getSizeAndPositionOfCell(index);

    return offset;
  }

  scrollToIndex(index) {
    const offset = this.getRowOffset(index);

    this.container.scrollTop = offset;
  }

  destroy() {
    window.removeEventListener('resize', this.resize);

    // TODO: Destroy everything properly, silly
  }

  getRowsForOffset(offset) {
    const {overscanCount = 3} = this.options;
    const {height} = this.state;
    let {start, stop} = this._rowSizeAndPositionManager.getVisibleCellRange({
      containerSize: height,
      offset
    });

    if (overscanCount) {
      start = Math.max(0, start - (start % overscanCount));
      stop += overscanCount;
    }

    return {start, stop};
  }

  getTotalHeight() {
    return this._rowSizeAndPositionManager.getTotalSize();
  }

  render() {
    const {data, renderRow} = this.options;
    const {offset = 0} = this.state;
    const {start, stop} = this.getRowsForOffset(offset);
    const rows = data.slice(start, stop);
    const fragment = document.createDocumentFragment();

    rows.forEach((row, index) => fragment.append(renderRow(row, start + index)));

    this.inner.style.height = `${this.getTotalHeight()}px`;
    this.content.style.top = `${this.getRowOffset(start)}px`;

    this.content.innerHTML = '';
    this.content.appendChild(fragment);
  }
}
