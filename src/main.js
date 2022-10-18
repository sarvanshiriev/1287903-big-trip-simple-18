import { render } from './framework/render.js';
import { generatePoint, destinations, offersByType} from './mock/point-route-mock.js';

import DestinationsModel from './model/destinations-model.js';
import OffersByTypeModel from './model/offers-by-type-model.js';
import PointModel from './model/point-model';
import FilterModel from './model/filter-model.js';

import FilterPresenter from './presenter/filter-presenter.js';
import RoutePresenter from './presenter/trip-point-presenter.js';

import FormAddButtonView from './view/form-add-button-view';

const formAddButton = new FormAddButtonView();
const formAddButtonContainer = document.querySelector('.trip-main');

const containerFilterPlace = document.querySelector('.trip-controls__filters');
const containerPlace = document.querySelector('.trip-events');

const pointModel = new PointModel(Array.from({ length: 10 }, generatePoint));
const destinationsModel = new DestinationsModel(destinations);
const offersByTypeModel = new OffersByTypeModel(offersByType);
const filterModel = new FilterModel();


const routePresenter = new RoutePresenter(containerPlace, pointModel,destinationsModel, offersByTypeModel, filterModel);
const filterPresenter = new FilterPresenter(containerFilterPlace, filterModel, pointModel);

const onAddEventFormClose = () => {
  formAddButton.element.disabled = false;
};

const onAddEventButtonClick = () => {
  routePresenter.createTripEvent(onAddEventFormClose);
  formAddButton.element.disabled = true;
};

render(formAddButton, formAddButtonContainer);
formAddButton.setOnAddEventButtonClick(onAddEventButtonClick);

filterPresenter.init();
routePresenter.init();

