import { generatePointRoute } from '../mock/pointRoute.js';
import { DESTINATIONS ,OFFERS} from '../mock/const.js';
export default class PointModel {
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
