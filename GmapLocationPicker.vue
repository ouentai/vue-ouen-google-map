<template>
  <GMarker
    v-if='location'
    :position='location'
    icon_file='pink-pushpin.png'
    />
</template>

<script>
import GMarker from './GmapMarker' ;

export default {
  name: 'GLPicker',
  components: {
    GMarker ,
  },
  inject: [
    'google',
    'map',
  ],
  props: {
    disabled : { // クリックイベントの無効化
      type : Boolean ,
      defatul : false ,
    },
  },
  data () {
    return {
      marker : null ,
      location : null ,
    };
  },
  mounted () {
    this.map.addListener('click', this.click_action);
    this.$once('hook:beforeDestroy', function () {
      this.google.maps.event.clearListeners(this.map,'click');
    });
  },
  methods: {
    click_action(e) {
      if (this.disabled) return ;
      const coordinate = {
        lat : e.latLng.lat() ,
        lng : e.latLng.lng() ,
      };
      this.location = coordinate ;
      this.$emit('coordinate', coordinate) ;
    },
  },
};
</script>
