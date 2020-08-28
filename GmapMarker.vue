<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import {get_coordinate} from './lib' ;

export default {
  name: 'GMarker',
  provide() {
    const obj = {};
    Object.defineProperty(obj,'inherited_position',{enumerable:true,get:()=>this._position});
    return obj ;
  },
  inject: {
    google : 'google',
    map : 'map',
    inherited_position : {default:null} ,
  },
  props: {
    position : Object , // {lat:~~,lng:~~} 型のオブジェクト、他のプロパティがあってもOK
    label : { // pinに重ねて表示される文字列、error時の識別子
      type : String ,
      default : ' ' ,
    },
    visible : { // 表示非表示
      type : Boolean ,
      default : true ,
    },
    title : String , // pinにhoverで表示される文字列
    icon_uri : String , // これがあれば host+dir+file より優先する
    icon_host : { // uriがあると無視される
      type : String ,
      default : 'https://maps.google.com' ,
    },
    icon_dir : { // uriがあると無視される
      type : String ,
      default : '/mapfiles/ms/icons/' ,
    },
    icon_file : { // uriがあると無視される
      type : String ,
      default : 'red-dot.png' ,
    },
    color : { // label文字色
      type : String ,
      default : 'white' ,
    },
    fontWeight : { // label文字スタイル
      type : String ,
      default : 'bold' ,
    },
  },
  data () {
    return {
      instance : null ,
    };
  },
  computed: {
    _position () {
      let p = get_coordinate(this.position          ) ;
      let i = get_coordinate(this.inherited_position) ;
      p || i || this.throw_position_error() ;
      return p || i || null ;
    },
    _label () {
      return {
        text : this.label ,
        color : this.color ,
        fontWeight : this.fontWeight ,
      };
    },
  },
  watch: {
    position () {this.update_position();},
    visible  () {this.update_visible ();},
    label    () {this.update_label   ();},
    title    () {this.update_title   ();},
  },
  created () {
    this.create_instance() ;
    this.update_position() ;
    this.update_label   () ;
    this.update_icon    () ;
    this.update_title   () ;
  },
  methods: {
    create_instance() {
      this.instance = new this.google.maps.Marker() ;
      this.mount_instance () ;
      this.$once('hook:beforeDestroy', () => {
        this.unmount_instance() ;
      });
    },
    throw_position_error() {
      // production 環境でなければ コンソールで知らせる
      if (process.env.NODE_ENV!=='production') { /* eslint-disable-line no-undef */
        console.info(`coordinate error @${this.label} : found in GmapMarker.vue`) ; /* eslint-disable-line no-console */
      }
    },
    mount_instance  () {this.instance.setMap(this.map) ;},
    unmount_instance() {this.instance.setMap(null)     ;},
    update_position() {
      if (this._position) {
        this.instance.setPosition(this._position) ;
        this.update_visible() ;
      } else {
        this.instance.setVisible(false) ;
      }
    },
    update_visible() {this.instance.setVisible(this.visible) ;},
    update_label() {this.instance.setLabel(this._label) ;},
    update_title() {this.instance.setTitle(this.title) ;},
    update_icon() {this.instance.setIcon(this.icon_uri || (this.icon_host + this.icon_dir + this.icon_file)) ;},
  },
};
</script>
