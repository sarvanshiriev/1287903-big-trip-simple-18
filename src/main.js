import Filter from './view/filter';
import { render,RenderPosition } from './render';
import RoutePresenter from './presenter/route-presenter';
import PointModel from './model/point-model';

const containerFilterPlace = document.querySelector('.trip-controls__filters');
const containerPlace = document.querySelector('.trip-events');
const pointModel = new PointModel();
const routePresenter = new RoutePresenter();

render (new Filter () , containerFilterPlace , RenderPosition.BEFOREEND);
routePresenter.init(containerPlace,pointModel);

