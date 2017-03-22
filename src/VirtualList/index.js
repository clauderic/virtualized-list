import morphdom from 'morphdom';
import SizeAndPositionManager from './SizeAndPositionManager';

const STYLE_INNER = 'position:relative; overflow:hidden; width:100%; min-height:100%; will-change: transform;';
const STYLE_CONTENT = 'position:absolute; top:0; left:0; height:100%; width:100%; overflow:visible;';

export default class VirtualizedList {
  constructor(container, options) {
    this.container = container;
    this.options = options;

    // Initialization
    this.state = {};
    this._sizeAndPositionManager = new SizeAndPositionManager({
      itemCount: options.rowCount,
      itemSizeGetter: this.getRowHeight,
      estimatedItemSize: options.estimatedRowHeight || 100
    });

    // Binding
    this.render = this.render.bind(this);
    this.handleScroll = this.handleScroll.bind(this);

    // Lifecycle Methods
    this.componentDidMount();
  }

  componentDidMount() {
    const {onMount, initialScrollTop, initialIndex, height} = this.options;
    const offset = (
      initialScrollTop ||
      initialIndex != null && this.getRowOffset(initialIndex) ||
      0
    );
    const inner = this.inner = document.createElement('div');
    const content = this.content = document.createElement('div');

    inner.setAttribute('style', STYLE_INNER);
    content.setAttribute('style', STYLE_CONTENT);
    inner.appendChild(content);
    this.container.appendChild(inner);

    this.setState({
      offset,
      height,
    }, () => {
      if (offset) {
        this.container.scrollTop = offset;
      }

      // Add event listeners
      this.container.addEventListener('scroll', this.handleScroll);

      if (typeof onMount === 'function') {
        onMount();
      }
    });
  }

  setState(state = {}, callback) {
    this.state = Object.assign(this.state, state);

    requestAnimationFrame(() => {
      this.render();

      if (typeof callback === 'function') {
        callback();
      }
    });
  }

  resize(height, callback) {
    this.setState({
      height,
    }, callback);
  }

  handleScroll(e) {
    const {onScroll} = this.options;
    const offset = this.container.scrollTop;

    this.setState({offset});

    if (typeof onScroll === 'function') {
      onScroll(offset, e);
    }
  }

  getRowHeight = ({index}) => {
    const {rowHeight} = this.options;

    if (typeof rowHeight === 'function') {
      return rowHeight(index);
    }

    return (Array.isArray(rowHeight)) ? rowHeight[index] : rowHeight;
  }

  getRowOffset(index) {
    const {offset} = this._sizeAndPositionManager.getSizeAndPositionForIndex(index);

    return offset;
  }

  scrollToIndex(index, alignment) {
    const {height} = this.state;
    const offset = this._sizeAndPositionManager.getUpdatedOffsetForIndex({
      align: alignment,
      containerSize: height,
      targetIndex: index,
    });

    this.container.scrollTop = offset;
  }

  onRowsRendered(renderedRows) {
    const {onRowsRendered} = this.options;

    if (typeof onRowsRendered === 'function') {
      onRowsRendered(renderedRows);
    }
  }

  destroy() {
    this.container.removeEventListener('scroll', this.handleScroll);
    this.container.innerHTML = '';
  }

  render() {
    const {overscanCount, renderRow} = this.options;
    const {height, offset = 0} = this.state;
    const {start, stop} = this._sizeAndPositionManager.getVisibleRange({
      containerSize: height,
      offset,
      overscanCount,
    });
    const fragment = document.createDocumentFragment();

    for (let index = start; index <= stop; index++) {
      fragment.appendChild(renderRow(index));
    }

    this.inner.style.height = `${this._sizeAndPositionManager.getTotalSize()}px`;
    this.content.style.top = `${this.getRowOffset(start)}px`;

    morphdom(this.content, fragment, {
      childrenOnly: true,
      getNodeKey: node => node.nodeIndex,
    });

    this.onRowsRendered({
      startIndex: start,
      stopIndex: stop,
    });
  }
}
