import {render} from '../framework/render.js';
// import FormAdd from '../view/form-add-view';
import PointPresenter from './point-presenter.js';
import PointList from '../view/point-list';
import NoPoint from '../view/no-point-view';
import Sort from '../view/sort';
import { SortType } from '../mock/const.js';
import {sortPointDay,sortPointPrice} from '../utils/point-utils';
export default class RoutePresenter {
  #pointList = new PointList ();
  #sort = new Sort ();
  #noPoint = new NoPoint();

  #containerElement = null;
  #pointModel = null;

  #destinations = null;
  #offers = null;

  #pointPresenter = new Map();
  #currentSortType = SortType.DATE;

  constructor (containerElement,pointModel) {
    this.#containerElement = containerElement;
    this.#pointModel = pointModel;
  }

  get points() {
    switch (this.#currentSortType) {
      case SortType.DATE:
        return [...this.#pointModel.points].sort(sortPointDay);
      case SortType.PRICE:
        return [...this.#pointModel.points].sort(sortPointPrice);
    }
    return this.#pointModel.points;
  }

  init = () => {
    this.#destinations = [...this.#pointModel.destinations];
    this.#offers = [...this.#pointModel.offers];
    this.#renderTripPoints();
  };

  #onModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #onPointChange = (updatedPointRoute,destinations,offers) => {
    this.#pointPresenter.get(updatedPointRoute.id).init(updatedPointRoute,destinations,offers);
  };

  #onSortTypeChange = (sortType) => {

    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearPointList();
    this.#renderTripPoints();
  };

  #renderPoint = (pointRoute,destinations,offers) => {
    const pointPresenter = new PointPresenter(this.#pointList.element,this.#onPointChange,this.#onModeChange);
    pointPresenter.init(pointRoute,destinations,offers);
    this.#pointPresenter.set(pointRoute.id,pointPresenter);
  };

  #renderNoPoint = () => {
    render (this.#noPoint, this.#containerElement);
  };

  #renderSort = () => {
    render (this.#sort, this.#containerElement);
    this.#sort.setSortTypeChangeHandler(this.#onSortTypeChange);
  };

  #rednerFormList = () => {
    render (this.#pointList , this.#containerElement);
  };

  #clearPointList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };

  #renderTripPoints = () => {
    if (this.points.length === 0) {
      this.#renderNoPoint();
    } else {
      this.#renderSort();
      this.#rednerFormList();
    }
    this.points.forEach((point) => this.#renderPoint(point, this.#destinations, this.#offers));
  };
}


