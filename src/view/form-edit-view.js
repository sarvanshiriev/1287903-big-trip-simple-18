import AbstractView from '../framework/view/abstract-view.js';
import { humanizePointDate } from '../utils/point-utils.js';

const createTypeTemplate = (offers) => {
  const eventByType = offers.map((element) => element.type );

  return eventByType.map((type) =>
    `<div class="event__type-item">
    <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
  </div>`
  ).join('');
};

const createNameTemplate = (destinations) => {
  const nameByType = destinations.map((element) => element.name );
  return nameByType.map((name) =>
    `<option value="${name}"></option>
`).join('');
};

const createOffersTemplate = (offers,offersAll,type) => {
  const offersByType = offers.find((element) => element.type === type).offers;
  const offerTemplate = offersByType.map(({id,title,price}) =>{
    const isChecked = () => {
      if(offersAll.includes(id)) {
        return 'checked';
      }
      return '';
    };
    return (
      `  <div class='event__offer-selector'>
    <input class='event__offer-checkbox  visually-hidden' id='event-offer-${title}-1' type='checkbox' name='event-offer-${title}' ${isChecked()}>
    <label class='event__offer-label' for='event-offer-${title}-1'>
      <span class='event__offer-title'>${title}</span>
      &plus;&euro;&nbsp;
      <span class='event__offer-price'>${price}</span>
    </label>
  </div>
  `
    );
  }
  );
  return offerTemplate.join('');
};
const createFormEditTemplate = (pointRoute,destinations,offers) => {
  const {basePrice,dateFrom,dateTo,destination,type,offersAll} = pointRoute;

  const destinationName = destinations.find((element) => element.id === destination).name;
  const destinationDescription = destinations.find((element) => element.id === destination).description;

  const dataFromDisplay = humanizePointDate(dateFrom, 'DD/MM/YY HH:mm');
  const dataToDisplay = humanizePointDate(dateTo, 'DD/MM/YY HH:mm');
  return (
    ` <li class="trip-events__item ">
<form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
        <div class="event__type-list">
          <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>
          ${createTypeTemplate(offers)}
          </fieldset>
        </div>
      </div>
      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
        ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationName}" list="destination-list-1">
        <datalist id="destination-list-1">
        ${createNameTemplate(destinations)}
        </datalist>
      </div>
      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dataFromDisplay}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dataToDisplay}">
      </div>
      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
      </div>
      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
      </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
        ${createOffersTemplate(offers,offersAll,type)}
        </div>
      </section>
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destinationDescription}</p>
      </section>
    </section>
  </form>
</li> `
  );
};

export default class FormEdit extends AbstractView {
  #pointRoute = null;
  #destinations = null;
  #offers = null;

  constructor (pointRoute,destinations,offers) {
    super();
    this.#pointRoute = pointRoute;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  get template() {
    return createFormEditTemplate(this.#pointRoute,this.#destinations,this.#offers);
  }

  setFormCLose = (callback) => {
    this._callback.formClose = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#formCloseHandler);
  };

  #formCloseHandler = (evt) => {
    evt.preventDefault();
    this._callback.formClose();
  };

  setFormSubmit = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit();
  };
}
