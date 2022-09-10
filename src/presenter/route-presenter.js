import {render,replace} from '../framework/render.js';
import FormEdit from '../view/form-edit-view';
// import FormAdd from '../view/form-add-view';
import PointRouteView from '../view/point-route-view';
import PointList from '../view/point-list';
import NoPoint from '../view/no-point-view';
import Sort from '../view/sort';

export default class RoutePresenter {
  #formList = new PointList ();
  #sort = new Sort ();
  #noPoint = new NoPoint();
  #containerElement = null;
  #pointModel = null;
  #points = null;
  #destinations = null;
  #offers = null;

  constructor (containerElement,pointModel) {
    this.#containerElement = containerElement;
    this.#pointModel = pointModel;
  }

  init = () => {
    this.#points = [...this.#pointModel.points];
    this.#destinations = [...this.#pointModel.destinations];
    this.#offers = [...this.#pointModel.offers];
    // render(new FormAdd (this.#routePoints[0],this.#destinations,this.#offers) , this.#formList.element);
    this.#renderTripPoints();
  };

  #renderPoint = (pointRoute,destinations,offers) => {
    const pointComponent = new PointRouteView(pointRoute,destinations,offers);
    const pointEditComponent = new FormEdit(pointRoute,destinations,offers);
    const replacePointToForm = () => {
      replace( pointEditComponent,pointComponent);
    };
    const replaceFormToPoint = () => {
      replace(pointComponent,pointEditComponent );
    };
    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown' , onEscKeyDown );
      }
    };
    pointComponent.setFormOpen(() => {
      replacePointToForm();
      document.addEventListener('keydown' , onEscKeyDown);
    });
    pointEditComponent.setFormCLose(() => {
      replaceFormToPoint();
      document.addEventListener('keydown' , onEscKeyDown);
    });
    pointEditComponent.setFormSubmit(() => {
      replaceFormToPoint();
      document.removeEventListener('keydown' , onEscKeyDown);
    });
    render (pointComponent,this.#formList.element);
  };

  #renderNoPoint = () => {
    render (this.#noPoint, this.#containerElement);
  };

  #renderSort = () => {
    render (this.#sort, this.#containerElement);
  };

  #rednedFormList = () => {
    render (this.#formList , this.#containerElement);
  };

  #renderTripPoints = () => {
    if (this.#points.length === 0) {
      this.#renderNoPoint();
    } else {
      this.#renderSort();
      this.#rednedFormList();
      for (let i = 0;i < this.#points.length; i++) {
        this.#renderPoint(this.#points[i],this.#destinations,this.#offers);
      }
    }
  };
}


