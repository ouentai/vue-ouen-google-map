<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import {get_coordinate} from './lib' ;

export default {
  name: 'GIWindow',
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
    label : { // error時の識別子
      type : String ,
      default : 'no label' ,
    },
    visible : { // 表示非表示
      type : Boolean ,
      default : true ,
    },
    content : { // 表示される文字列
      type : [String, HTMLElement] ,
      default : 'default' ,
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
  },
  watch: {
    position () {this.update_position();},
    visible  () {this.update_visible ();},
    content  () {this.update_content ();},
  },
  created () {
    this.create_instance() ;
    this.update_position() ;
    this.update_content () ;
  },
  methods: {
    create_instance() {
      this.instance = new this.google.maps.InfoWindow({disableAutoPan: true}) ;
      this.$once('hook:beforeDestroy', () => {
        this.unmount_instance() ;
      });
    },
    throw_position_error() {
      // production 環境でなければ コンソールで知らせる
      if (process.env.NODE_ENV!=='production') { /* eslint-disable-line no-undef */
        console.info(`coordinate error @${this.label} : found in GmapInfoWindow.vue`) ; /* eslint-disable-line no-console */
      }
    },
    mount_instance  () {this.instance.open(this.map) ;},
    unmount_instance() {this.instance.close()        ;},
    update_position() {
      if (this._position) {
        this.instance.setPosition(this._position) ;
        this.update_visible() ;
      } else {
        this.unmount_instance() ;
      }
    },
    update_visible() {this.visible ? this.mount_instance() : this.unmount_instance() ;},
    update_content() {this.instance.setContent(this.content) ;},
  },
};
</script>
