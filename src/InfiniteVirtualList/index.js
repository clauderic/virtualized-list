import VirtualList from '../VirtualList';

export default class InfiniteVirtualList extends VirtualList {
  onRowsRendered({startIndex, stopIndex}) {
    const {
      isRowLoaded,
      loadMoreRows,
      minimumBatchSize = 10,
      rowCount = 0,
      threshold = 15,
    } = this.options;

    const unloadedRanges = getUnloadedRanges({
      isRowLoaded,
      minimumBatchSize,
      rowCount,
      startIndex: Math.max(0, startIndex - threshold),
      stopIndex: Math.min(rowCount - 1, stopIndex + threshold),
    });

    unloadedRanges.forEach(unloadedRange => {
      let promise = loadMoreRows(unloadedRange);

      if (promise) {
        promise.then(() => {
          // Refresh the visible rows if any of them have just been loaded.
          // Otherwise they will remain in their unloaded visual state.
          if (
            isRangeVisible({
              lastRenderedStartIndex: startIndex,
              lastRenderedStopIndex: stopIndex,
              startIndex: unloadedRange.startIndex,
              stopIndex: unloadedRange.stopIndex,
            })
          ) {
            // Force update
            this.render();
          }
        });
      }
    });
  }
}

/**
 * Determines if the specified start/stop range is visible based on the most recently rendered range.
 */
export function isRangeVisible ({
  lastRenderedStartIndex,
  lastRenderedStopIndex,
  startIndex,
  stopIndex
}) {
  return !(startIndex > lastRenderedStopIndex || stopIndex < lastRenderedStartIndex);
}

/**
 * Returns all of the ranges within a larger range that contain unloaded rows.
 */
export function getUnloadedRanges ({
  isRowLoaded,
  minimumBatchSize,
  rowCount,
  startIndex,
  stopIndex
}) {
  const unloadedRanges = [];
  let rangeStartIndex = null;
  let rangeStopIndex = null;

  for (let index = startIndex; index <= stopIndex; index++) {
    let loaded = isRowLoaded(index);

    if (!loaded) {
      rangeStopIndex = index;
      if (rangeStartIndex === null) {
        rangeStartIndex = index;
      }
    } else if (rangeStopIndex !== null) {
      unloadedRanges.push({
        startIndex: rangeStartIndex,
        stopIndex: rangeStopIndex,
      });

      rangeStartIndex = rangeStopIndex = null;
    }
  }

  // If :rangeStopIndex is not null it means we haven't ran out of unloaded rows.
  // Scan forward to try filling our :minimumBatchSize.
  if (rangeStopIndex !== null) {
    const potentialStopIndex = Math.min(
      Math.max(rangeStopIndex, rangeStartIndex + minimumBatchSize - 1),
      rowCount - 1,
    );

    for (let index = rangeStopIndex + 1; index <= potentialStopIndex; index++) {
      if (!isRowLoaded({index})) {
        rangeStopIndex = index;
      } else {
        break;
      }
    }

    unloadedRanges.push({
      startIndex: rangeStartIndex,
      stopIndex: rangeStopIndex,
    });
  }

  // Check to see if our first range ended prematurely.
  // In this case we should scan backwards to try filling our :minimumBatchSize.
  if (unloadedRanges.length) {
    const firstUnloadedRange = unloadedRanges[0];

    while (
      firstUnloadedRange.stopIndex - firstUnloadedRange.startIndex + 1 < minimumBatchSize &&
      firstUnloadedRange.startIndex > 0
    ) {
      let index = firstUnloadedRange.startIndex - 1;

      if (!isRowLoaded({index})) {
        firstUnloadedRange.startIndex = index;
      } else {
        break;
      }
    }
  }


  return unloadedRanges;
}
