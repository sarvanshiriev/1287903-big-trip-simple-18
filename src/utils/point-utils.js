import dayjs from 'dayjs';

const isEventFuture = (dueDate) => dayjs(dueDate).isAfter(dayjs(), 'D') || dayjs(dueDate).isSame(dayjs(), 'D');

const humanizePointDate = (date, format) => dayjs(date).format(format);

const isOfferChecked = (offers, id) => offers.includes(id);

const sortPointDay = (pointA, pointB) => dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));

const sortPointPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

export {humanizePointDate,sortPointDay,sortPointPrice,isEventFuture,isOfferChecked};
