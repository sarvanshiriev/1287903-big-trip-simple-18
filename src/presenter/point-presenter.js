import { render,replace,remove } from '../framework/render.js';
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

    const prevPointRouteView = this.#pointRouteView;
    const prevFormEdit = this.#formEdit;

    this.#pointRouteView = new PointRouteView(pointRoute,destinations,offers);
    this.#formEdit = new FormEdit(pointRoute,destinations,offers);

    this.#pointRouteView.setFormOpen(this.#setFormOpen);
    this.#formEdit.setFormCLose(this.#setFormCLose);
    this.#formEdit.setFormSubmit(this.#setFormSubmit);


    if (prevPointRouteView === null || prevFormEdit === null) {
      render(this.#pointRouteView,this.#containerElement);
      return;
    }

    if (this.#containerElement.contains(prevPointRouteView.element)) {
      replace(this.#pointRouteView,prevPointRouteView);
    }

    if (this.#containerElement.contains(prevFormEdit.element)) {
      replace(this.#formEdit,prevFormEdit);
    }
    remove(prevPointRouteView);
    remove(prevFormEdit);
  };

  destroy = () => {
    remove(this.#pointRouteView);
    remove(this.#formEdit);
  };

  #replacePointToForm = () => {
    replace(this.#formEdit,this.#pointRouteView);
    document.addEventListener('keydown' , this.#onEscKeyDown);
  };

  #replaceFormToPoint = () => {
    replace(this.#pointRouteView,this.#formEdit);
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
