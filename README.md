# @ouen/vue-google-maps

## Basic usage / Documentation

### Install
- npm
  `npm install https://github.com/ouentai/vue-ouen-google-map`

### Quickstart (Webpack, Vue-cli, Nuxt)

- import & register components
  ``` demo.vue
  <script>
  import {
    GmapMap            as GRoot    ,
    GmapCircle         as GCircle  ,
    GmapMarker         as GMarker  ,
    GmapInfoWindow     as GIWindow ,
    GmapLocationPicker as GLPicker ,
  } from 'vue-ouen-google-map'

  export default {
    components: {
      GRoot    ,
      GCircle  ,
      GMarker  ,
      GIWindow ,
      GLPicker ,
    },
  };
  <script>
  ```


- use components in template
  ``` demo.vue
  <template>
    <GRoot>
      <GMarker :position='{lat:~~~~,lng:~~~~}' />
      <GMarker :position='{lat:~~~~,lng:~~~~}' />
      <GLPicker @coordinate='e => {your method}' />
    </GRoot>
  </template>
  ```


- usage point
  - GmapMap component must be ***top level*** of this package items as google-maps-api container.
  - If you need, other component can be in GmapMap component as vue slot.
  - GmapMap : Discribe a google map.
  - GmapMarker : Add a marker to map of GmapMap. With `v-for`, it's easy way to create many marker.
  - GmapLocationPicker : Add a function to get coordinate as emit event, to click map.


- example

  - only map
    ``` demo.vue
    <template>
      <GRoot />
    </template>
    ```

  - want coordinate by click map
    ``` demo.vue
    <template>
      <GRoot>
        <GLPicker
          :disabled='bool'
          @coordinate='location=$event' // $event = {lat:~~~~,lng:~~~~}
          />
      </GRoot>
    </template>
    ```

  - some marker with map
    ``` demo.vue
    <template>
      <GRoot>
        <GMarker
          v-for='pos in array_of_position'
          :position='pos'       // pos = {lat:~~~~,lng:~~~~}
          :label='some string'
          />
      </GRoot>
    </template>
    ```


- interface

  - GmapMap as GRoot
    - zoom : initial scale of google map zoom : default 15
    - center : initial center of google map : default tokyo station
    - options : when loading google maps api, options add to URI as query string
      - apiKey : string : your google api apiKey
      - language : string : region
    - example
      ``` demo.vue
      <template>
        <GRoot
          :zoom='20'
          :center='{lat:~~~,lng:~~~}'
          :options='{ apiKey : "your api key" , language : "ja" }'
          >
        </GRoot>
      </template>
      ```

  - GmapMarker
    - position : required : {lat:\~\~\~,lng:\~\~\~} : marker position
    - icon config
      - icon_uri  : String : Full URI uses in preference to [icon_host+icon_dir+ icon_file]
      - icon_host : String :
      - icon_dir  : String :
      - icon_file : String :
    - tilte : String : hover text : default blank
    - label : String : text on marker : default blank
    - color : String : label color : default white
    - fontWeight : String : label font style : default bold

  - GmapLocationPicker
    - @coordinate : {lat:\~\~\~,lng:\~\~\~} : emit event
    - disabled : Boolean : disable getting coordinate : default false


## Advanced usage

- GmapApiLoader.js @lib folder

  - This
    - is module to add \<script\> tag to head of html.
    - loads Google maps api with script tag.
    - returns new Promise
      - resolve : window.google
      - reject  : new Error

  - example
    ``` .javascript
    import loader from 'vue-ouen-google-map/lib/GmapApiLoader' ;

    const options={ apiKey : "your api key" , language : "ja" };
    // same as GmapMap options

    loader(options).then( google =>  {
      // google === window.google
      new google.maps.Map(~~~~);
    });
    ```
