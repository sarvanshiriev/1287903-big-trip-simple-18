import Filter from './view/filter';
import Sort from './view/sort';
import { render} from './render';
import RoutePresenter from './presenter/route-presenter';

const containerFilterPlace = document.querySelector('.trip-controls__filters');
const containerPlace = document.querySelector('.trip-events');
const routePresenter = new RoutePresenter();

render (new Filter () , containerFilterPlace );
render (new Sort () , containerPlace );

routePresenter.init(containerPlace);
