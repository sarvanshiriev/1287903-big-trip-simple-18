import Observable from '../framework/observable.js';

export default class OffersByTypeModel extends Observable {
  #offersByType = null;

  constructor (OFFERS) {
    super();
    this.#offersByType = OFFERS;
  }

  get offersByType() {
    return this.#offersByType;
  }
}
