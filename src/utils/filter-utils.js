import { FilterType } from '../const.js';
import { isEventFuture } from './point-utils.js';

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isEventFuture(point.dateFrom)),
};

export { filter };
