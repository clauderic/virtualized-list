import VirtualList from '../src/';

const HEIGHT = 100;
const ROW_HEIGHT = 10;

describe('VirtualList', () => {
  let container;
  let instance;

  function render(options = {}) {
    return new Promise(resolve => {
      instance = new VirtualList(container, {
        height: HEIGHT,
        overscanCount: 0,
        rowHeight: ROW_HEIGHT,
        rowCount: 100,
        renderRow: (index) => {
          const element = document.createElement('div');
          element.setAttribute('class', 'item');
          element.setAttribute('style', `height: ${ROW_HEIGHT}px;`);
          element.innerHTML = `Row #${index}`;

          return element;
        },
        onMount: () => {
          resolve(instance);
        },
        ...options
      });
    });
  }

  beforeEach(() => {
    container = document.createElement('div');
  });

  describe('number of rendered children', () => {
    it('renders enough children to fill the view', async () => {
      await render();

      expect(container.querySelectorAll('.item').length).toEqual(
        HEIGHT / ROW_HEIGHT,
      );
    });

    it('does not render more children than available if the list is not filled', async () => {
        await render({rowCount: 5});
        expect(container.querySelectorAll('.item').length).toEqual(5);
      },
    );
  });

  /** Test scrolling via initial props */
  describe('initialIndex', () => {
    it('scrolls to the top', async () => {
      await render({initialIndex: 0});

      expect(container.textContent).toContain('Row #0');
    });

    it('scrolls down to the middle', async () => {
      await render({initialIndex: 49});

      expect(container.textContent).toContain('Row #49');
    });

    it('scrolls to the bottom', async () => {
      await render({initialIndex: 99});

      expect(container.textContent).toContain('Row #99');
    });
  });

  describe('initialScrollTop', () => {
    it('renders correctly when an initial :initialScrollTop property is specified', async () => {
      await render({initialScrollTop: 100});

      const items = container.querySelectorAll('.item');
      const first = items[0];
      const last = items[items.length - 1];

      expect(first.textContent).toContain('Row #10');
      expect(last.textContent).toContain('Row #19');
    });
  });
});
