import FormEdit from '../view/form-edit-view';
// import FormAdd from '../view/form-add-view';
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
    // render(new FormAdd (this.#routePoints[0],this.#destinations,this.#offers) , this.#formList.element);
    for (let i = 0;i < this.#routePoints.length; i++) {
      this.#renderPoint(this.#routePoints[i],this.#destinations,this.#offers);
    }
    render(this.#formList , this.#containerElement);
  };

  #renderPoint = (pointRoute,destinations,offers) => {
    const pointComponent = new PointRouteView(pointRoute,destinations,offers);
    const pointEditComponent = new FormEdit(pointRoute,destinations,offers);
    const replacePointToForm = () => {
      this.#formList.element.replaceChild( pointEditComponent.element,pointComponent.element);
    };
    const replaceFormToPoint = () => {
      this.#formList.element.replaceChild(pointComponent.element,pointEditComponent.element );
    };
    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown' , onEscKeyDown );
      }
    };
    pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replacePointToForm();
      document.addEventListener('keydown' , onEscKeyDown);
    });
    pointEditComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceFormToPoint();
      document.addEventListener('keydown' , onEscKeyDown);
    });
    pointEditComponent.element.querySelector('form').addEventListener('submit', () => {
      replaceFormToPoint();
      document.removeEventListener('keydown' , onEscKeyDown);
    });
    render (pointComponent,this.#formList.element);

  };
}


