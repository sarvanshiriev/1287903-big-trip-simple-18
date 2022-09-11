import Filter from './view/filter';
import {render} from './framework/render.js';
import RoutePresenter from './presenter/route-presenter';
import PointModel from './model/point-model';

const containerFilterPlace = document.querySelector('.trip-controls__filters');
const containerPlace = document.querySelector('.trip-events');
const pointModel = new PointModel();
const routePresenter = new RoutePresenter(containerPlace,pointModel);

render (new Filter () , containerFilterPlace);
routePresenter.init();

