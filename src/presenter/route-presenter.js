import FormEdit from '../view/form-edit-view';
import FormAdd from '../view/form-add-view';
import PointRouteView from '../view/point-route-view';
import PointList from '../view/point-list';
import { render } from '../render';

export default class RoutePresenter {
  #formList = new PointList ();
  #containerElement = null;
  #pointModel = null;
  #routePoints = null;
  #destinations = null;
  #offers = null;
  init = (containerElement,pointModel) => {
    this.#containerElement = containerElement;
    this.#pointModel = pointModel;
    this.#routePoints = [...this.#pointModel.points];
    this.#destinations = [...this.#pointModel.destinations];
    this.#offers = [...this.#pointModel.offers];
    render(new FormAdd (this.#routePoints[0],this.#destinations,this.#offers) , this.#formList.element);
    render(new FormEdit (this.#routePoints[0],this.#destinations,this.#offers) , this.#formList.element);
    for (let i = 0;i < this.#routePoints.length; i++) {
      render(new PointRouteView(this.#routePoints[i],this.#destinations,this.#offers), this.#formList.element);
    }
    render(this.#formList , this.#containerElement);
  };
}
