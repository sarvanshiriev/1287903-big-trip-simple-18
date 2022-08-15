import Filter from './view/filter';
import Sort from './view/sort';
import { render,RenderPosition } from './render';
import RoutePresenter from './presenter/route-presenter';

const containerFilterPlace = document.querySelector('.trip-controls__filters');
const containerPlace = document.querySelector('.trip-events');
const routePresenter = new RoutePresenter();

render (new Filter,containerFilterPlace,RenderPosition.BEFOREEND);
render (new Sort,containerPlace,RenderPosition.BEFOREEND);

routePresenter.itin(containerPlace);
