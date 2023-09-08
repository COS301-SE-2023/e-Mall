import moment from 'moment';

export function reactiveTimeFormat(time: string): string {
  const timestamp = moment(time);
  const now = moment();
  const delta = moment.duration(now.diff(timestamp));
  let customTime: string;
  if (delta.asMinutes() < 1) {
    customTime = '<1m';
  } else if (delta.asHours() < 1) {
    customTime = `${Math.floor(delta.asMinutes())} min ago`;
  } else if (delta.asDays() < 1) {
    customTime = `${Math.floor(delta.asHours())} hour ago`;
  } else if (delta.asDays() < 10) {
    customTime = `${Math.floor(delta.asDays())} days ago`;
  } else if (delta.asDays() < 365) {
    customTime = timestamp.format('DD.MM');
  } else {
    customTime = timestamp.format('DD.MM.YYYY');
  }
  return customTime;
}

export function timeFormat(time: string): string {
  const timestamp = moment(time);
  const now = moment();
  let customTime: string;
  if (now.isSame(timestamp, 'day')) {
    customTime = timestamp.format('HH:mm');
  } else if (now.isSame(timestamp, 'year')) {
    customTime = timestamp.format('DD.MM HH:mm');
  } else {
    customTime = timestamp.format('DD.MM.YYYY');
  }
  return customTime;
}
