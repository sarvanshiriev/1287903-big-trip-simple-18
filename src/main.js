import Filter from './view/filter';
import { render,RenderPosition } from './render';

const containerPlace = document.querySelector('.trip-controls__filters');
render (new Filter,containerPlace,RenderPosition.BEFOREEND);
