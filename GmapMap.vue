<template>
  <div>
    <div ref='map_container' style='width:100%;height:100%;min-width:50px;min-height:50px'></div>
    <slot v-if='google && map' />
  </div>
</template>

<script>
import {
  apiLoader as loader ,
  get_coordinate ,
  is_coordinate_same ,
} from './lib' ;
const tokyo = {lat:35.681187, lng: 139.767052} ; // 東京駅

export default {
  name: 'GMap',
  provide() {
    // リアクティブな状態でproviedeする方法
    const obj = {};
    Object.defineProperty(obj,'google',{enumerable:true,get:()=>this.google});
    Object.defineProperty(obj,'map'   ,{enumerable:true,get:()=>this.map   });
    Object.defineProperty(obj,'inherited_center',{enumerable:true,get:()=>this._center});
    return obj ;
  },
  props: {
    center: { // {lat:~~,lng:~~} 型のオブジェクト、他のプロパティがあってもOK
      type: Object,
      default: () => tokyo ,
    },
    label : { // error時の識別子
      type : String ,
      default : 'no label' ,
    },
    zoom: {
      type: Number,
      default: 15,
    },
    options: { // googlemapsapiのurlにつけるクエリストリングのオプション
      type: Object,
      default: () => ({}),
    },
    clickableIcons: { // クリックによる場所情報の表示
      type: Boolean ,
      default: false ,
    },
  },
  data () {
    return {
      google: null ,
      map: null ,
    };
  },
  computed: {
    _center () {
      let c = get_coordinate(this.center) ;
      c || this.throw_position_error() ;
      return c || tokyo ;
    },
  },
  watch: {
    center (val,old) {is_coordinate_same(val,old) || this.update_center();},
    zoom   () {this.update_zoom  ();},
  },
  created () {
    // サーバーサイドで実行している場合は何もしない
    if (typeof document === 'undefined') return ;
    // google maps api を読込む
    loader(this.options).then(google => {
      this.google = google ;
      this.create_instance() ;
      this.update_center() ;
      this.update_zoom() ;
      this.update_clickableIcons() ;
//      this.update_disableDefaultUI() ;
    });
  },
  methods: {
    create_instance() {
      const { Map } = this.google.maps ;
      this.map = new Map(this.$refs.map_container);
    },
    throw_position_error() {
      // production 環境でなければ コンソールで知らせる
      if (process.env.NODE_ENV!=='production') { /* eslint-disable-line no-undef */
        console.info(`coordinate error @${this.label} : found in GmapMap.vue`) ; /* eslint-disable-line no-console */
      }
    },
    update_center() {this.map.setCenter(this._center) ;},
    update_zoom  () {this.map.setZoom  (this.zoom   ) ;},
    update_clickableIcons() {this.map.setClickableIcons(this.clickableIcons) ;},
//    update_disableDefaultUI() {this.map.setDisableDefaultUI(true)},メソッドがない：setOptions()を使う// zoomボタン、全画面ボタンのhidden
  },
};
</script>
