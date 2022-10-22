import Observable from '../framework/observable.js';
import { UpdateType } from '../mock/const-mock.js';

export default class DestinationsModel extends Observable {
  #tripPointsApiService = null;
  #destinations = [];

  constructor (tripPointsApiService) {
    super();
    this.#tripPointsApiService = tripPointsApiService;
  }

  get destinations() {
    return this.#destinations;
  }

  init = async () => {
    try {
      this.#destinations = await this.#tripPointsApiService.destinations;
    } catch(err) {
      this.#destinations = [];
    }

    this._notify(UpdateType.INIT);
  };
}
