import {createElement} from '../render.js';

const noPointTemplate = () => `
<p class="trip-events__msg">Click New Event to create your first point</p>
`;
export default class NoPoint {
  #element = null;
  get template () {
    return noPointTemplate;
  }

  get element () {
    if(!this.#element){
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  removeElement () {
    this.#element = null;
  }
}
