/** Virtual list, only renders visible items.
 *  @param {Array<*>} data         List of data items
 *  @param {Function} renderRow    Renders a single row
 *  @param {Number} rowHeight      Static height of a row
 *  @param {Number} overscanCount  Amount of rows to render above and below visible area of the list
 *  @example
 *  new VirtualList(element, {
 *    data: ['a', 'b', 'c'],
 *    renderRow: (row) => { <div>{row}</div> },
 *    rowHeight: 150
 *  )}
 *
 *  TODO:
 *  – Add support for variable heights
 *  – Add a scroll to index method
 *  – Add an initial scroll offset or index option
 */

const STYLE_INNER = 'position:relative; overflow:hidden; width:100%; min-height:100%;';
const STYLE_CONTENT = 'position:absolute; top:0; left:0; height:100%; width:100%; overflow:visible;';

class VirtualList {
  constructor(container, options) {
    this.container = container;
    this.options = options;

    // Initialization
    this.state = {};

    let inner = this.inner = document.createElement('div');
    let content = this.content = document.createElement('div');

    inner.appendChild(content);
    container.appendChild(inner);

    // Binding
    this.render = this.render.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.resize = this.resize.bind(this);

    // Resize
    this.resize();

    // Add event listeners
    this.container.addEventListener('scroll', this.handleScroll);

    window.addEventListener('resize', this.resize);
  }

  setState(state = {}) {
    this.state = Object.assign(this.state, state);

    window.requestAnimationFrame(this.render);
  }

  resize() {
    if (this.state.height !== this.container.offsetHeight) {
      this.setState({
        height: this.container.offsetHeight
      });
    }
  };

  handleScroll() {
    this.setState({
      offset: this.container.scrollTop
    });
  };

  destroy() {
    window.removeEventListener('resize', this.resize);

    // TODO: Destroy everything properly, silly
  }

  render() {
    const {data, rowHeight, renderRow, overscanCount = 3} = this.options;
    const {offset = 0, height = 0} = this.state;

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
    const selection = data.slice(start, end);

    const fragment = document.createDocumentFragment();
    selection.forEach(row => fragment.append(renderRow(row)));

    this.inner.setAttribute('style', `${STYLE_INNER} height:${data.length*rowHeight}px;`);
    this.content.setAttribute('style', `${STYLE_CONTENT} top:${start*rowHeight}px;`);

    this.content.innerHTML = '';
    this.content.appendChild(fragment);
  }
}
