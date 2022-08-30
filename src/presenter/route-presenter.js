import FormAdd from '../view/form-add';
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
    render(new FormAdd () , this.formList.getElement());
    for (let i = 0;i < this.routePoints.length; i++) {
      render(new PointRouteView(this.routePoints[i],this.destinations), this.formList.getElement());
    }
    render(this.formList , containerElement);
  };
}
