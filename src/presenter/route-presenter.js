import {remove,render} from '../framework/render.js';
// import FormAdd from '../view/form-add-view';
import PointPresenter from './point-presenter.js';
import PointList from '../view/point-list';
import NoPoint from '../view/no-point-view';
import Sort from '../view/sort';
import { SortType,UserAction, UpdateType } from '../mock/const.js';
import {sortPointDay,sortPointPrice} from '../utils/point-utils';
export default class RoutePresenter {
  #pointList = new PointList ();
  #sort = null;
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
    this.#pointModel.addObserver(this.#onModelPoint);
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

  #onViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointModel.deletePoint(updateType, update);
        break;
    }
  };

  #onModelPoint = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearPointList();
        this.#renderTripPoints();
        break;
      case UpdateType.MAJOR:
        this.#clearPointList({resetSortingType: true});
        this.#renderTripPoints();
        break;
    }
  };

  #onModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
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
    const pointPresenter = new PointPresenter(this.#pointList.element,this.#onViewAction,this.#onModeChange);
    pointPresenter.init(pointRoute,destinations,offers);
    this.#pointPresenter.set(pointRoute.id,pointPresenter);
  };

  #renderNoPoint = () => {
    render (this.#noPoint, this.#containerElement);
  };

  #renderSort = () => {
    this.#sort = new Sort(this.#currentSortType);
    this.#sort.setSortTypeChangeHandler(this.#onSortTypeChange);
    render (this.#sort, this.#containerElement);
  };

  #rednerFormList = () => {
    render (this.#pointList , this.#containerElement);
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

  #clearPointList = ({resetSortType = false} = {}) => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#sort);
    remove(this.#noPoint);

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  };
}


