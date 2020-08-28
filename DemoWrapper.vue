<template>
  <div class="">
    <button @click='bool=!bool'>表示非表示</button>
    {{location}}
    <GMap
      v-if='bool'
      label='root'
      :options='options'
      :center='{lat:35.683187, lng: 139.768052}'
      :zoom='13'
      class='map_container'
      >
      <GMarker
        v-for='(m,i) in marker_arr'
        :key='i'
        :position='m'
        :label='m.name1'
        :title='m.adr2'
        />
      <GLPicker
        :disabled='!bool'
        @coordinate='location=$event'
        />
      <GIWindow
        :position='{lat:35.671187, lng: 139.767052}'
        :visible='bool'
        content='aaa<br>aaa'
        />

      <GMarker
        :position='{lat:35.671187, lng: 139.777052}'
        label='2'
        :visible='bool'
        />

      <GMarker :position='{lat:35.671187, lng: 139.767052}' label='3'>
        <GMarker :position='{lat:35.661187, lng: 139.767052}' label='5'>
          <GIWindow content='入れ子だよ' label='入れ'/>
        </GMarker>
      </GMarker>

      <GCircle />
      <GCircle :radius='2000'/>
      <GCircle :radius='2000' :center='{lat:35.671187, lng: 139.767052}'/>
    </GMap>

    <!-- <GMap :center='{lat:35,lng:139}' class='map_container' /> -->

    <!-- <GMap class='map_container' /> -->
  </div>
</template>

<script>
import GMap    from './GmapMap' ;
import GMarker from './GmapMarker' ;
import GLPicker from './GmapLocationPicker' ;
import GIWindow from './GmapInfoWindow' ;
import GCircle  from './GmapCircle' ;

export default {
  name: 'Demo',
  components: {
    GMap ,
    GMarker ,
    GLPicker ,
    GCircle  ,
    GIWindow ,
  },
  data () {
    return {
      location: null,
      bool: true,
      marker_arr : [
        {lat:35.681187, lng: 139.767052, adr2:'千代田区1-1-1', name1:'安藤', name2:'太郎'},
        {lat:35.681187, lng: 139.777052, adr2:'千代田区2-2-2', name1:'伊藤', name2:'耳聾'},
        {lat:35.681187, lng: 139.787052, adr2:'千代田区3-3-3', name1:'有働', name2:'三郎'},
      ],
      options: {
//        apiKey: 'yourkey' ,
//        language: 'ja',
      },
    };
  },
}
</script>

<style>
.map_container
{
  /* width  : 100% ; */
  height : 500px ;
}
</style>
