export default function is_coordinate_same (a,b) {
  // coordinate型のオブジェクトで同じ座標かどうか
  // 同じならtrue、異なればfalse
  return a.lat===b.lat && a.lng===b.lng ;
}
