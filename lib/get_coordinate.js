export default function get_coordinate (a) {
  // {lat:~~~,lng:~~~}型かどうか
  return (
    Object.prototype.toString.call(a) === '[object Object]' && !!a.lat && !!a.lng && a
    || null
  );
}
