import { generatePointRoute } from '../mock/pointRoute';
import { DESTINATIONS } from '../mock/const';
export default class PointModel {
  points = Array.from({length:4},generatePointRoute);
  getPoints = () => this.points;
  destinations = DESTINATIONS;
  getDestinationsData = () => this.destinations;
}
