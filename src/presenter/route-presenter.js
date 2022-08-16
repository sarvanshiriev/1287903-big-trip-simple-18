import FormAdd from '../view/form-add';
import PointRoute from '../view/point-route';
import PointList from '../view/point-list';
import { render } from '../render';

export default class RoutePresenter {
  formList = new PointList();

  init = (containerElement) => {
    this.containerElement = containerElement;
    render(new FormAdd,this.formList.getElement());
    for (let i = 0;i < 3; i++) {
      render(new PointRoute,this.formList.getElement());
    }
    render(this.formList,containerElement);
  };
}
