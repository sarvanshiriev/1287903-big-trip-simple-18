import FormEdit from '../view/form-edit-view';
// import FormAdd from '../view/form-add-view';
import PointRouteView from '../view/point-route-view';
import PointList from '../view/point-list';
import NoPoint from '../view/no-point-view';
import Sort from '../view/sort';
import {render,replace} from '../framework/render.js';

export default class RoutePresenter {
  #formList = new PointList ();
  #sort = new Sort ();
  #noPoint = new NoPoint();
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
    // render(new FormAdd (this.#routePoints[0],this.#destinations,this.#offers) , this.#formList.element);

    if (this.#routePoints.length === 0) {
      render (this.#noPoint, this.#containerElement);
    } else {
      render(this.#sort, this.#containerElement);
      render(this.#formList , this.#containerElement);
      for (let i = 0;i < this.#routePoints.length; i++) {
        this.#renderPoint(this.#routePoints[i],this.#destinations,this.#offers);
      }
    }
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
}


