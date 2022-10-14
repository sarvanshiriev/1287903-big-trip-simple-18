import { generatePointRoute } from '../mock/pointRoute.js';
import Observable from '../framework/observable.js';
import { DESTINATIONS ,OFFERS} from '../mock/const.js';
export default class PointModel extends Observable{
  #points = Array.from({length:10},generatePointRoute);
  #destinations = DESTINATIONS;
  #offers = OFFERS;

  get points () {
    return this.#points;
  }

  get destinations () {
    return this.#destinations;
  }

  get offers () {
    return this.#offers;
  }
}
