import Observable from '../framework/observable.js';
// import { UpdateType } from '../mock/const-mock.js';

export default class PointModel extends Observable{
  #tripPointsApiService = null;
  #points = [];

  constructor (tripPointsApiService) {
    super();
    this.#tripPointsApiService = tripPointsApiService;
  }

  get points () {
    return this.#points;
  }


  updatePoint = async (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }


  };

  addPoint = async (updateType, update) => {
    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updateType, update);
  };


  deletePoint = async (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    try {
      await this.#tripPointsApiService.deletePoint(update);
      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1)
      ];

      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete event');
    }
  };

}
