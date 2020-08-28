<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import {get_coordinate} from './lib' ;

export default {
  name: 'GCircle',
  provide() {
    const obj = {};
    Object.defineProperty(obj,'inherited_position',{enumerable:true,get:()=>this._position});
    return obj ;
  },
  inject: {
    google : 'google',
    map : 'map',
    inherited_position : {default:null} ,
    inherited_center : 'inherited_center' ,
  },
  props: {
    center : Object , // {lat:~~,lng:~~} 型のオブジェクト、他のプロパティがあってもOK
    label : { // error時の識別子
      type : String ,
      default : ' ' ,
    },
    visible : { // 表示非表示
      type : Boolean ,
      default : true ,
    },
    radius : {
      type : Number ,
      default : 4000 , // メートル
    },
    fillColor : { // 塗り潰し色
      type : String ,
      default : 'white' ,
    },
    strokeColor : { // 円弧色
      type : String ,
      default : 'white' ,
    },
  },
  data () {
    return {
      instance : null ,
    };
  },
  computed: {
    _position () {
      let b = get_coordinate(this.center            ) ;
      let p = get_coordinate(this.inherited_position) ;
      let c = get_coordinate(this.inherited_center  ) ;
      b || p || c || this.throw_position_error() ;
      return b || p || c || null ;
    },
  },
  watch: {
    center   () {this.update_position();},
    visible  () {this.update_visible ();},
    radius   () {this.update_radius  ();},
  },
  created () {
    this.create_instance() ;
    this.set_options();
    this.update_position() ;
    this.update_radius() ;
//    this.update_label   () ;
  },
  methods: {
    create_instance() {
      this.instance = new this.google.maps.Circle() ;
      this.mount_instance() ;
      this.$once('hook:beforeDestroy', () => {
        this.unmount_instance() ;
      });
    },
    throw_position_error() {
      // production 環境でなければ コンソールで知らせる
      if (process.env.NODE_ENV!=='production') { /* eslint-disable-line no-undef */
        console.info(`coordinate error @${this.label} : found in GmapCircle.vue`) ; /* eslint-disable-line no-console */
      }
    },
    mount_instance  () {this.instance.setMap(this.map) ;},
    unmount_instance() {this.instance.setMap(null)     ;},
    update_position() {
      if (this._position) {
        this.instance.setCenter(this._position) ;
        this.update_visible() ;
      } else {
        this.throw_position_error() ;
        this.instance.setVisible(false) ;
      }
    },
    update_visible() {this.instance.setVisible(this.visible) ;},
    update_radius () {this.instance.setRadius (this.radius ) ;},
    set_options() {
      this.instance.setOptions({
        clickable : false , // mapのクリックイベントを邪魔してしまうのでOFF
        fillColor : this.fillColor ,
        strokeColor : this.strokeColor ,
      });
    },
  },
};
</script>
