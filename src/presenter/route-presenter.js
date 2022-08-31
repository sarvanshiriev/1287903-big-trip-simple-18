import FormEdit from '../view/form-edit-view';
import PointRouteView from '../view/point-route-view';
import PointList from '../view/point-list';
import { render } from '../render';

export default class RoutePresenter {
  formList = new PointList ();

  init = (containerElement,pointModel) => {
    this.containerElement = containerElement;
    this.pointModel = pointModel;
    this.routePoints = [...this.pointModel.getPoints()];
    this.destinations = [...this.pointModel.getDestinationsData()];
    this.offers = [...this.pointModel.getOffers()];
    render(new FormEdit (this.routePoints[0],this.destinations,this.offers) , this.formList.getElement());
    for (let i = 0;i < this.routePoints.length; i++) {
      render(new PointRouteView(this.routePoints[i],this.destinations,this.offers), this.formList.getElement());
    }
    render(this.formList , containerElement);
  };
}
