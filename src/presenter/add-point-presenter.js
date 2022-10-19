import { render, remove, RenderPosition } from '../framework/render.js';
import { UserAction, UpdateType } from '../mock/const-mock.js';
import PointAddView from '../view/add-point-view.js';

import { customAlphabet } from 'nanoid';
const nanoid = customAlphabet('1234567890', 10);

export default class AddPointPresenter {
  #destinations = null;
  #offersByType = null;
  #destroyCallback = null;

  #addPointComponent = null;
  #tripPointsListContainer = null;

  #changeData = null;

  constructor(tripPointsListContainer, changeData) {
    this.#tripPointsListContainer = tripPointsListContainer;
    this.#changeData = changeData;
  }

  init = (destinations, offersByType, destroyCallback) => {
    this.#destinations = destinations;
    this.#offersByType = offersByType;
    this.#destroyCallback = destroyCallback;

    if (this.#addPointComponent !== null) {
      return;
    }

    this.#addPointComponent = new PointAddView (undefined, destinations, offersByType);

    this.#addPointComponent.setOnCancelPointButtonClick(this.#onCancelButtonClick);
    this.#addPointComponent.setOnClosePointButtonClick(this.#onCloseButtonClick);
    this.#addPointComponent.setOnSubmitPointForm(this.#onFormSubmit);

    render(this.#addPointComponent, this.#tripPointsListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#onEscKeyDown);
  };

  destroy = () => {
    if (this.#addPointComponent === null) {
      return;
    }

    this.#destroyCallback?.();

    remove(this.#addPointComponent);
    this.#addPointComponent = null;

    document.removeEventListener('keydown', this.#onEscKeyDown);
  };

  setSaving = () => {
    this.#addPointComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  };

  setAborting = () => {
    const resetFormState = () => {
      this.#addPointComponent.updateElement({
        isDisabled: false,
        isSaving: false,
      });
    };

    this.#addPointComponent.shake(resetFormState);
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };

  #onCancelButtonClick = () => {
    this.destroy();
  };

  #onCloseButtonClick = () => {
    this.destroy();
  };

  #onFormSubmit = (point) => {
    this.#changeData(UserAction.ADD_POINT, UpdateType.MINOR, {id: nanoid(), ...point});
    this.destroy();
  };
}
