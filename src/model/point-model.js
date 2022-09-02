import { generatePointRoute } from '../mock/pointRoute';
import { DESTINATIONS ,OFFERS} from '../mock/const';
export default class PointModel {
  #points = Array.from({length:4},generatePointRoute);
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
