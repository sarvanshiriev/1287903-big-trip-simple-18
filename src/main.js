import Filter from './view/filter';
import {render} from './framework/render.js';
import RoutePresenter from './presenter/route-presenter';
import PointModel from './model/point-model';
import FilterModel from './model/filter-model.js';

const containerFilterPlace = document.querySelector('.trip-controls__filters');
const containerPlace = document.querySelector('.trip-events');
const pointModel = new PointModel();
const routePresenter = new RoutePresenter(containerPlace,pointModel);
const filterModel = new FilterModel();

render (new Filter () , containerFilterPlace);
routePresenter.init();

