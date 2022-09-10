import { render,replace } from '../framework/render.js';
import PointRouteView from '../view/point-route-view';
import FormEdit from '../view/form-edit-view';

export default class PointPresenter {
  #pointRoute = null;
  #destinations = null;
  #offers = null;

  #containerElement = null;
  #pointRouteView = null;
  #formEdit = null;

  constructor (containerElement) {
    this.#containerElement = containerElement;
  }

  init = (pointRoute,destinations,offers) => {

    this.#pointRoute = pointRoute;
    this.#destinations = destinations;
    this.#offers = offers;

    this.#pointRouteView = new PointRouteView(pointRoute,destinations,offers);
    this.#formEdit = new FormEdit(pointRoute,destinations,offers);

    this.#pointRouteView.setFormOpen(this.#setFormOpen);
    this.#formEdit.setFormCLose(this.#setFormCLose);
    this.#formEdit.setFormSubmit(this.#setFormSubmit);

    render(this.#pointRouteView,this.#formEdit);
  };


  #replacePointToForm = () => {
    replace( this.#pointRouteView, this.#formEdit);
    document.addEventListener('keydown' , this.#onEscKeyDown);
  };

  #replaceFormToPoint = () => {
    replace(this.#formEdit,this.#pointRouteView );
    document.addEventListener('keydown' , this.#onEscKeyDown);
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };

  #setFormOpen = () => {
    this.#replacePointToForm();
  };

  #setFormCLose = () => {
    this.#replaceFormToPoint();
  };

  #setFormSubmit = () => {
    this.#replaceFormToPoint();
  };
}
