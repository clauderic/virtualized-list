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
 *    renderRow: (row) => { <div>{row}</div> },
 *    rowHeight: 150,
 *    overscanCount: 5
 *  )}
 *
 *  TODO:
 *  – Add support for variable heights
 */

const STYLE_INNER = 'position:relative; overflow:hidden; width:100%; min-height:100%;';
const STYLE_CONTENT = 'position:absolute; top:0; left:0; height:100%; width:100%; overflow:visible;';

export default class VirtualizedList {
  constructor(container, options) {
    this.container = container;
    this.options = options;

    // Initialization
    this.state = {};

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

  scrollToIndex(index) {
    const {rowHeight} = this.options;
    const offset = rowHeight * index;

    this.container.scrollTop = offset;
  }

  destroy() {
    window.removeEventListener('resize', this.resize);

    // TODO: Destroy everything properly, silly
  }

  getRowsForOffset(offset) {
    const {data, overscanCount = 3, rowHeight} = this.options;
    const {height} = this.state;

    // first visible row index
    let start = (offset / rowHeight)|0;

    // actual number of visible rows (without overscan)
    let visibleRowCount = (height / rowHeight)|0;

    // Overscan: render blocks of rows modulo an overscan row count
    // This dramatically reduces DOM writes during scrolling
    if (overscanCount) {
      start = Math.max(0, start - (start % overscanCount));
      visibleRowCount += overscanCount;
    }

    // last visible + overscan row index
    const end = start + 1 + visibleRowCount;

    // data slice currently in viewport plus overscan items
    return {
      rows: data.slice(start, end),
      start,
      end
    };
  }

  render() {
    const {data, rowHeight, renderRow} = this.options;
    const {offset = 0} = this.state;
    const {rows, start} = this.getRowsForOffset(offset);
    const fragment = document.createDocumentFragment();

    rows.forEach(row => fragment.append(renderRow(row)));

    this.inner.style.height = `${data.length * rowHeight}px`;
    this.content.style.top = `${start * rowHeight}px`;

    this.content.innerHTML = '';
    this.content.appendChild(fragment);
  }
}
