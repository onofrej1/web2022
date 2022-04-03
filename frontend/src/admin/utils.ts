import settings from './settings';

function isObject(obj: any) {
  return obj === Object(obj);
}

export function getValue(value: any) {
  const pk = settings.primaryKey;
  if (Array.isArray(value) && value.length && isObject(value[0])) {
    value = value.map((v: any) => v[pk]);
  }
  if (!Array.isArray(value) && isObject(value)) {
    value = value[pk];
  }
  return value;
}
