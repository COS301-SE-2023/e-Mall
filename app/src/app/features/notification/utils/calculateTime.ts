import moment from 'moment';

export function reactiveTimeFormat(time: string): string {
  const timestamp = moment(time);
  const now = moment();
  const delta = moment.duration(now.diff(timestamp));
  let custom_time: string;
  if (delta.asMinutes() < 1) {
    custom_time = '<1 min';
  } else if (delta.asHours() < 1) {
    custom_time = `${Math.floor(delta.asMinutes())} mins ago`;
  } else if (delta.asHours() === 1) {
    custom_time = `${Math.floor(delta.asHours())} hour ago`;
  } else if (delta.asDays() < 1) {
    custom_time = `${Math.floor(delta.asHours())} hours ago`;
  } else if (delta.asDays() === 1) {
    custom_time = `${Math.floor(delta.asDays())} day ago`;
  } else if (delta.asDays() < 10) {
    custom_time = `${Math.floor(delta.asDays())} days ago`;
  } else if (delta.asDays() < 365) {
    custom_time = timestamp.format('DD.MM');
  } else {
    custom_time = timestamp.format('DD.MM.YYYY');
  }
  return custom_time;
}

export function timeFormat(time: string): string {
  const timestamp = moment(time);
  const now = moment();
  let custom_time: string;
  if (now.isSame(timestamp, 'day')) {
    custom_time = timestamp.format('HH:mm');
  } else if (now.isSame(timestamp, 'year')) {
    custom_time = timestamp.format('DD/MM  HH:mm');
  } else {
    custom_time = timestamp.format('DD/MM/YYYY');
  }
  return custom_time;
}
