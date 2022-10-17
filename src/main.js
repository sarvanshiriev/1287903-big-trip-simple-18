import RoutePresenter from './presenter/route-presenter';
import PointModel from './model/point-model';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';

const containerFilterPlace = document.querySelector('.trip-controls__filters');
const containerPlace = document.querySelector('.trip-events');
const pointModel = new PointModel();
const filterModel = new FilterModel();

const routePresenter = new RoutePresenter(containerPlace, pointModel, filterModel);
const filterPresenter = new FilterPresenter(containerFilterPlace, filterModel, pointModel);

filterPresenter.init();
routePresenter.init();

