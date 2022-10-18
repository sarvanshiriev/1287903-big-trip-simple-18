import { render,replace,remove } from '../framework/render.js';
import PointRouteView from '../view/point-route-view';
import FormEditView from '../view/point-edit-view';
import {UserAction, UpdateType} from '../mock/const-mock.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};
export default class PointPresenter {
  #pointRoute = null;
  #destinations = null;
  #offers = null;

  #changeData = null;
  #changeMode = null;

  #containerElement = null;
  #pointRouteView = null;
  #formEdit = null;

  #mode = Mode.DEFAULT;

  constructor (containerElement,changeData,changeMode) {
    this.#containerElement = containerElement;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (pointRoute,destinations,offers) => {

    this.#pointRoute = pointRoute;
    this.#destinations = destinations;
    this.#offers = offers;

    const prevPointRouteView = this.#pointRouteView;
    const prevFormEdit = this.#formEdit;

    this.#pointRouteView = new PointRouteView(pointRoute,destinations,offers);
    this.#formEdit = new FormEditView(pointRoute,destinations,offers);

    this.#pointRouteView.setFormOpen(this.#setFormOpen);
    this.#formEdit.setFormCLose(this.#setFormCLose);
    this.#formEdit.setFormSubmit(this.#setFormSubmit);
    this.#formEdit.setFormDelete(this.#setFormDelete);


    if (prevPointRouteView === null || prevFormEdit === null) {
      render(this.#pointRouteView,this.#containerElement);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointRouteView,prevPointRouteView);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#formEdit,prevFormEdit);
    }
    remove(prevPointRouteView);
    remove(prevFormEdit);
  };

  destroy = () => {
    remove(this.#pointRouteView);
    remove(this.#formEdit);
  };

  resetView = () => {
    if(this.#mode !== Mode.DEFAULT) {
      this.#formEdit.reset(this.#pointRoute);
      this.#replaceFormToPoint();
    }
  };

  #replacePointToForm = () => {
    replace(this.#formEdit,this.#pointRouteView);
    document.addEventListener('keydown' , this.#onEscKeyDown);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #replaceFormToPoint = () => {
    replace(this.#pointRouteView,this.#formEdit);
    document.removeEventListener('keydown' , this.#onEscKeyDown);
    this.#mode = Mode.DEFAULT;
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#formEdit.reset(this.#pointRoute);
      this.#replaceFormToPoint();
    }
  };

  #setFormOpen = () => {
    this.#replacePointToForm();
  };

  #setFormCLose = () => {
    this.#formEdit.reset(this.#pointRoute);
    this.#replaceFormToPoint();
  };


  #setFormSubmit = (update, destinations, offersByType) => {
    this.#changeData(UserAction.UPDATE_POINT, UpdateType.MINOR, update, destinations, offersByType);
    this.#replaceFormToPoint();
  };

  #setFormDelete = (point) => {
    this.#changeData(UserAction.DELETE_POINT, UpdateType.MINOR, point);
  };
}
