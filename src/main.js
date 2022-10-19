import { render } from './framework/render.js';
import { generatePoint, destinations, offersByType} from './mock/point-route-mock.js';

import DestinationsModel from './model/destinations-model.js';
import OffersByTypeModel from './model/offers-by-type-model.js';
import PointModel from './model/point-model';
import FilterModel from './model/filter-model.js';

import FilterPresenter from './presenter/filter-presenter.js';
import TripPointPresenter from './presenter/trip-point-presenter.js';

import FormAddButtonView from './view/form-add-button-view';

const formAddButtonComponent = new FormAddButtonView();
const formAddButtonContainer = document.querySelector('.trip-main');

const containerFilterPlace = document.querySelector('.trip-controls__filters');
const containerPlace = document.querySelector('.trip-events');

const pointModel = new PointModel(Array.from({ length: 10 }, generatePoint));
const destinationsModel = new DestinationsModel(destinations);
const offersByTypeModel = new OffersByTypeModel(offersByType);
const filterModel = new FilterModel();


const tripPointPresenter = new TripPointPresenter(containerPlace, pointModel,destinationsModel, offersByTypeModel, filterModel);
const filterPresenter = new FilterPresenter(containerFilterPlace, filterModel, pointModel);

const onAddPointFormClose = () => {
  formAddButtonComponent.element.disabled = false;
};

const onAddPointButtonClick = () => {
  tripPointPresenter.createTripPoint(onAddPointFormClose);
  formAddButtonComponent.element.disabled = true;
};

render(formAddButtonComponent, formAddButtonContainer);
formAddButtonComponent.setOnAddPointButtonClick(onAddPointButtonClick);

filterPresenter.init();
tripPointPresenter.init();

