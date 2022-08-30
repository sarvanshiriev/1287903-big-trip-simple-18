import { getRandomArrayElement,getRandomInteger } from '../utils';
import {TRIP_TYPES,DESTINATIONS,OFFERS} from './const';

const getArrayId = (type) => {
  const offersByType = OFFERS.find((element) => element.type === type ).offers;
  return offersByType.map((element) => element.id);
};

export const generatePointRoute = () => {
  const typePointRoute = getRandomArrayElement(TRIP_TYPES);
  const offersPoint = getArrayId(typePointRoute);

  return ({
    id:getRandomInteger(0,3),
    basePrice:getRandomInteger(200,500),
    dateFrom:null,
    dateTo:null,
    destination:getRandomArrayElement(DESTINATIONS).id,
    typePointRoute,
    offersPoint
  });
};


