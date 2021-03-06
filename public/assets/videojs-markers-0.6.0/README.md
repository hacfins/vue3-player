Video.js Markers
===================
![Alt text](https://raw.github.com/spchuang/videojs-markers/master/screenshot.png "Screen shot of videojs.markers")

A plugin that displays customizable markers upon progress bars of the video with [Video.js](https://github.com/videojs/video.js/). This could be used to show video breaks and show overlaid text on the video when playback reaches the specific break point.

## Demo and Documentation
See [here] (http://www.sampingchuang.com/videojs-markers)

JSBin Demo can be found [here] (http://jsbin.com/befob/7/edit)

## Features
* Display markers on progress bar, with hover-over tooltips
* Display break overlays
* Flexible styling
* Support dynamically adding and removing markers

## Download

* Download master with git -- `git clone git@github.com:spchuang/videojs-markers.git`

* Download zip/tar files for newest release
* Download through bower -- `bower install videojs-markers`


## Quick Start
Add the 'videojs.markers.js' plugin and stylesheet after including videojs script and jQuery library

    <link href="http://vjs.zencdn.net/4.2/video-js.css" rel="stylesheet">
    <link href="videojs.markers.css" rel="stylesheet">
    <script src="http://code.jquery.com/jquery-2.0.3.min.js"></script>
    <script src="http://vjs.zencdn.net/4.2/videohls.js"></script>
    <script src='../src/videojs.markers.js'></script>

### Basic usage: display break markers in the video.
To add breaks in the video, simply add a new time (in seconds) in the list of breaks option. 
   
    // initialize videohls.js
    var video = videojs('test_video');

    //load the marker plugin
    video.markers({
      markers: [
         {time: 9.5, text: "this"},
         {time: 16,  text: "is"},
         {time: 23.6,text: "so"},
         {time: 28,  text: "cool"}
      ]
    });

### Customize marker style: 
The style of the markers could be modified by passing an optional setting "markerStyle" with your preference of css styles. 

    video.markers({
      markerStyle: {
         'width':'8px',
         'background-color': 'red'
      },
      markers: [
         {time: 9.5, text: "this"},
         {time: 16,  text: "is"},
         {time: 23.6,text: "so"},
         {time: 28,  text: "cool"}
      ]    
    });
   
## History
- 0.5.0
   - add 'onMarkerClick' callback handler. When this returns false, the default behavior of seeking to the marker time will be prevented.
   - add new 'getMarkers' API 
   - remove constraints of using 'time' as the marker time attribute. Instead, a new markertip.time() function is added to resolve the time dynamically. This mean the time attribute can be represented in different attributes. This also made marker times modifiable (see new demo file). Note that the UI position of the marker will only be updated after you call marker.players.updateTime().
- 0.4
   - change display_time to displayTime
   - markers now takes an array of object containing time, text, overlay text
   - add markerReached callback
   - markerTip and overlay text is now a clalback function for higher flexibility
   - Add many markers APIs for adding and removing markers dynamically.
- 0.1
   - initial release


## License
This project is licensed under MIT.
