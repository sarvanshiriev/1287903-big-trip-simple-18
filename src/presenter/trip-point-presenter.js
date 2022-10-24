import {remove,render, RenderPosition} from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import PointListView from '../view/point-list-view';
import NoPointView from '../view/no-point-view';
import SortView from '../view/sort-view';
import AddPointPresenter from './add-point-presenter.js';
import { SortType,UserAction, UpdateType,FilterType } from '../const.js';
import {sortPointDay,sortPointPrice} from '../utils/point-utils';
import { filter } from '../utils/filter-utils.js';
import LoadingMessageView from '../view/loading-message-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};
export default class TripPointPresenter {
  #noPoint = null;
  #sort = null;
  #pointList = new PointListView ();
  #loadingMessageComponent = new LoadingMessageView();
  #containerElement = null;

  #pointModel = null;
  #filterModel = null;
  #destinationsModel = null;
  #offersByTypeModel = null;

  #pointPresenter = new Map();
  #addPointPresenter = null;

  #currentSortType = SortType.DATE;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor (containerElement,pointModel,destinationsModel, offersByTypeModel,filterModel) {
    this.#containerElement = containerElement;
    this.#pointModel = pointModel;
    this.#destinationsModel = destinationsModel;
    this.#offersByTypeModel = offersByTypeModel;
    this.#filterModel = filterModel;

    this.#addPointPresenter = new AddPointPresenter (this.#pointList.element, this.#onViewAction);

    this.#pointModel.addObserver(this.#onModelPoint);
    this.#filterModel.addObserver(this.#onModelPoint);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;

    const points = this.#pointModel.points;
    const filteredPoints = filter[this.#filterType](points);
    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredPoints.sort(sortPointDay);
      case SortType.PRICE:
        return filteredPoints.sort(sortPointPrice);
    }
    return filteredPoints;
  }

  init = () => {
    this.#renderTripPoints();
  };

  createTripPoint = (callback) => {
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#addPointPresenter.init(this.#destinationsModel.destinations, this.#offersByTypeModel.offersByType, callback);
  };

  #onViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenter.get(update.id).setSaving();
        try {
          await this.#pointModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#addPointPresenter.setSaving();
        try {
          await this.#pointModel.addPoint(updateType, update);
        } catch(err) {
          this.#addPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenter.get(update.id).setDeleting();
        try {
          await this.#pointModel.deletePoint(updateType, update);
        } catch(err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #onModelPoint = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data,this.#destinationsModel.destinations, this.#offersByTypeModel.offersByType);
        break;
      case UpdateType.MINOR:
        this.#clearPointList();
        this.#renderTripPoints();
        break;
      case UpdateType.MAJOR:
        this.#clearPointList({resetSortingType: true});
        this.#renderTripPoints();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingMessageComponent);
        this.#renderTripPoints();
        break;
    }
  };

  #onModeChange = () => {
    this.#addPointPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #onSortTypeChange = (sortType) => {
    this.#currentSortType = sortType;
    this.#clearPointList();
    this.#renderTripPoints();
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#pointList.element,this.#onViewAction,this.#onModeChange);
    pointPresenter.init(point,this.#destinationsModel.destinations,this.#offersByTypeModel.offersByType);
    this.#pointPresenter.set(point.id,pointPresenter);
  };

  #renderNoPoint = () => {
    this.#noPoint = new NoPointView (this.#filterType);
    render (this.#noPoint, this.#containerElement);
  };

  #renderLoadingMessage = () => {
    render(this.#loadingMessageComponent, this.#containerElement, RenderPosition.AFTERBEGIN);
  };

  #renderSort = () => {
    this.#sort = new SortView (this.#currentSortType);
    this.#sort.setSortTypeChangeHandler(this.#onSortTypeChange);
    render (this.#sort, this.#containerElement);
  };

  #rednerFormList = () => {
    render (this.#pointList , this.#containerElement);
  };

  #renderTripPoints = () => {
    if (this.#isLoading) {
      this.#renderLoadingMessage();
      return;
    }
    if (this.points.length === 0) {
      this.#renderNoPoint();
    } else {
      this.#renderSort();
      this.#rednerFormList();
    }
    this.points.forEach((point) => this.#renderPoint(point, this.#destinationsModel.destinations, this.#offersByTypeModel.offersByType));
  };

  #clearPointList = ({resetSortType = false} = {}) => {
    this.#addPointPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#sort);
    remove(this.#loadingMessageComponent);

    if (this.#noPoint) {
      remove(this.#noPoint);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  };
}


