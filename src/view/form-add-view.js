import { humanizePointDate,isOfferChecked } from '../utils/point-utils.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import dayjs from 'dayjs';

const POINT_BLANK = {
  basePrice: 0,
  dateFrom: dayjs(),
  dateTo: dayjs(),
  destination: 1,
  id: null,
  type: 'taxi',
  offers: [],
};

const createPictureTemplate = (pictures) => {
  const picturesTemplate = pictures.map(
    ({src,description}) => `
    <img class='event__photo' src='${src}' alt='${description}'>`
  );
  return picturesTemplate.join('');
};

const createTypeTemplate = (type, offers, offersByType) => {
  const eventByType = offersByType.map((element) => element.type === type).offers;

  return eventByType.map(( id, title, price) =>
    `<div class="event__offer-selector">
  <input class="event__offer-checkbox  visually-hidden" id="event-offer-${title}-1" type="checkbox" name="event-offer-${title}" data-offer-id="${id}" ${isOfferChecked(offers, id) ? 'checked' : ''}>
  <label class="event__offer-label" for="event-offer-${title}-1">
    <span class="event__offer-title">${title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${price}</span>
  </label>
</div>`
  ).join('');
};

const createNameTemplate = (destinations) => {
  const nameByType = destinations.map((element) => element.name );
  return nameByType.map((name) =>
    `<option value="${name}"></option>
  `).join('');
};

const createOffersTemplate = (offersByType,type) => {
  const eventTypes = offersByType.map((element) => element.type);

  return eventTypes.map((eventType) =>
    `<div class="event__type-item">
      <input id="event-type-${eventType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}" ${eventType === type ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-1">${eventType}</label>
    </div>`
  ).join('');
};

// const createFormEditTemplate = (pointRoute,destinations,offers) => {
//   const {basePrice,destination,type} = pointRoute;

//   const destinationName = destinations.find((element) => element.id === destination).name;
//   const destinationPictures = destinations.find((element) => element.id === destination).pictures;
//   const destinationDescription = destinations.find((element) => element.id === destination).description;

//   const dataFromDisplay = humanizePointDate(undefined, 'DD/MM/YY HH:mm');
//   const dataToDisplay = humanizePointDate(undefined, 'DD/MM/YY HH:mm');

const createFormEditTemplate = (event, destinations, offersByType) => {
  const { basePrice, dateFrom, dateTo, destination, type, offers } = event;
  const currentDestination = destinations.find((element) => element.id === destination);
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
          ${createOffersTemplate (offersByType, type)}
          </fieldset>
        </div>
      </div>
      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
        ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${currentDestination.name}" list="destination-list-1">
        <datalist id="destination-list-1">
        ${createNameTemplate(destinations)}
        </datalist>
      </div>
      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizePointDate(dateFrom, 'DD/MM/YY HH:mm')}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizePointDate(dateTo, 'DD/MM/YY HH:mm')}">
      </div>
      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
      </div>
      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Cancel</button>
      <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
        ${createTypeTemplate(type, offers, offersByType)}
        </div>
      </section>
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${currentDestination.description}</p>
        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${createPictureTemplate(currentDestination.pictures)}
          </div>
        </div>
      </section>
    </section>
  </form>
</li> `
  );
};

export default class FormAddView extends AbstractStatefulView {
  #dateFromPicker = null;
  #dateToPicker = null;

  #destinations = null;
  #offersByType = null;

  constructor (pointRoute,destinations,offersByType) {
    super();
    this._state = POINT_BLANK;
    this.#destinations = destinations;
    this.#offersByType = offersByType;

    this.#setInnerHandlers();
    this.#setDatePickers();
  }

  get template() {
    return createFormEditTemplate(this._state,this.#destinations,this.#offersByType);
  }

  setOnSubmitPointForm = (callback) => {
    this._callback.submitPointForm = callback;
    this.element.querySelector('form').addPointListener('submit', this.#onSubmitPointForm);
  };

  #onSubmitPointForm = (evt) => {
    evt.preventDefault();
    this._callback.submitPointForm(FormAddView.parseStateToPoint(this._state), this.#destinations, this.#offersByType);
  };

  setOnCancelPointButtonClick = (callback) => {
    this._callback.cancelClick = callback;
    this.element.querySelector('.event__reset-btn').addPointListener('click', this.#onCancelPointButtonClick);
  };

  #onCancelPointButtonClick = (evt) => {
    evt.preventDefault();
    this._callback.cancelClick();
  };

  static parseStateToPoint = (state) => {
    const point = {...state};
    return point;
  };

  #setInnerHandlers = () => {
    this.element.addPointListener('change', this.#onOfferChange);
    this.element.addPointListener('change', this.#onPointTypeChange);
    this.element.addPointListener('change', this.#onDestinationChange);
  };

  #onOfferChange = (evt) => {
    if (!evt.target.closest('input[type="checkbox"].event__offer-checkbox')) {
      return;
    }

    evt.preventDefault();
    const checkedOffers = [...this._state.offers];
    if (evt.target.checked) {
      checkedOffers.push(Number(evt.target.dataset.offerId));
    } else {
      const idIndex = checkedOffers.indexOf(Number(evt.target.dataset.offerId));
      checkedOffers.splice(idIndex, 1);
    }

    this.updateElement({
      offers: checkedOffers
    });
  };

  #onPointTypeChange = (evt) => {
    if (!evt.target.closest('input[type="radio"].event__type-input')) {
      return;
    }

    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
      offers: []
    });
  };

  #onDestinationChange = (evt) => {
    if (!evt.target.closest('input[type="text"].event__input--destination')) {
      return;
    }

    evt.preventDefault();
    const newDestination = this.#destinations.find((destination) => destination.name === evt.target.value).id;
    this.updateElement({
      destination: newDestination
    });
  };

  #onDateFromChange = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate
    });
  };

  #onDateToChange = ([userDate]) => {
    this.updateElement({
      dateTo: userDate
    });
  };

  #setDatePickers = () => {
    this.#dateFromPicker = flatpickr(this.element.querySelector('input[name="event-start-time"].event__input--time'), {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      defaultDate: this._state.dateFrom,
      onChange: this.#onDateFromChange
    });
    this.#dateToPicker = flatpickr(this.element.querySelector('input[name="event-end-time"].event__input--time'), {
      enableTime: true,
      dateFormat: 'd/m/y  H:i',
      defaultDate: this._state.dateTo,
      onChange: this.#onDateToChange
    });
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();

    this.setOnSubmitEventForm(this._callback.submitEventForm);
    this.setOnCancelEventButtonClick(this._callback.cancelClick);

    this.#setDatePickers();
  };

  removeElement = () => {
    super.removeElement();

    if (this.#dateFromPicker || this.#dateToPicker) {
      this.#dateFromPicker.destroy();
      this.#dateToPicker.destroy();
      this.#dateFromPicker = null;
      this.#dateToPicker = null;
    }
  };
}
