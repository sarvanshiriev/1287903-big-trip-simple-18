import { FilterType } from '../mock/const-mock';
import { isEventFuture } from './point-utils.js';

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isEventFuture(point.dateFrom)),
};

export { filter };
