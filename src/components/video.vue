<template>
    <div class="video-player" :class="{'m-video-player':!IsPC(),'pc-video-player':IsPC()}" v-if="reseted">
        <video class="video-js" :class="{'videojs-fill':videoInfo.is_fill == 1}" :ref="refname"></video>
        <div v-if="IsPC()" class="video-player-shade" style="position: absolute;top:0;left:0;right:0;bottom:0;z-index:10000" @click="mediaClick"></div>
        <slot></slot>
    </div>
</template>

<script>
    var DEFAULT_EVENTS = [
        'fullscreenchange',
        'loadedmetadata',
        'loadeddata',
        'canplay',
        'canplaythrough',
        'play',
        'pause',
        'waiting',
        'playing',
        'ended',
        'error',
        'click',
        'touchstart',
        'error'
    ]
    import {IsPC,mathRand,IsWx,IsAndroid} from '@/config/utils'
    export default {
        props  : {
            videoInfo:{
                type    : Object,
                default:null
            },
            refname        : {
                type   : String,
                default: ''
            },
            start          : {
                type   : Number,
                default: 0
            },
            playsinline    : {
                type   : Boolean,
                default: false
            },
            customEventName: {
                type   : String,
                default: 'statechanged'
            },
            options        : {
                type    : Object,
                required: true
            },
            events         : {
                type   : Array,
                default: () => []
            },
            globalOptions  : {
                type   : Object,
                default: () => ({
                    language: 'zh-CN',
                    controls  : true,
                    controlBar: {
                        volumePanel: {
                            inline: false
                        }
                    },
                    plugins   : {},
                    autoplay  : false,
                    preload   : 'auto',

                })
            },
            globalEvents   : {
                type   : Array,
                default: () => []
            }
        },
        computed  : {

        },
        data   : function () {
            return {
                player : null,
                reseted: true,
                is_add_mark:false,
                finger_time:'',
                is_run_finger:false,

                //flv 重连inter,及次数
                reconnect_time:'',
                reconnect_count :0,
                reconnect_max_count: 6,
                reconnect_step:2e3,
                add_flv_event:false,
                is_flv_recon_play:false,


            }
        },
        mounted: function () {

            EleResize.on(_dom('.video-player')[0], () => {
                this.resizeVideo()
            });
            if (!this.player) {
                this.initialize()
            }



        },
        beforeDestroy() {
            if (this.player) {
                this.dispose()
            }
        },
        methods: {
            IsPC,
            initialize(){
                this.initplay()
            },
            mediaClick(){
                this.$emit('playerclick',this.player)

            },

            initplay(){
                if(this.videoInfo.back_img){
                    this.globalOptions.poster = this.videoInfo.back_img
                }else{
                    this.globalOptions.poster = require('assets/player.png')
                }

                const videoOptions = Object.assign({}, this.globalOptions, this.options)

                // ios fullscreen

                if (this.playsinline) {
                    if(IsWx() && IsAndroid()){
                        this.$refs[this.refname].setAttribute('x5-video-player-type', 'h5-page')

                    }else{
                        this.$refs[this.refname].setAttribute('playsinline', this.playsinline)
                        this.$refs[this.refname].setAttribute('webkit-playsinline', this.playsinline)
                        this.$refs[this.refname].setAttribute('x5-playsinline', this.playsinline)
                        this.$refs[this.refname].setAttribute('x5-video-player-type', 'h5')
                    }

                    this.$refs[this.refname].setAttribute('x5-video-player-fullscreen', false)
                }
                // emit event
                const emitPlayerState = (event, value) => {
                    if (event) {
                        this.$emit(event, this.player)
                    }
                    if (value) {
                        this.$emit(this.customEventName, {[event]: value})
                    }
                }

                // player
                const self = this;

                this.player = videojs(this.$refs[this.refname], videoOptions, function () {

                    // events
                    const events = DEFAULT_EVENTS.concat(self.events).concat(self.globalEvents)

                    // watch events
                    const onEdEvents = {}
                    for (let i = 0; i < events.length; i++) {
                        if (typeof events[i] === 'string' && onEdEvents[events[i]] === undefined) {
                            (event => {
                                onEdEvents[event] = null;

                                this.on(event, () => {

                                    if(event == 'play'){
                                        if( _attr(this.el(),'is_flv_recon_play')){
                                            _removeClass(this.el(),'vjs-flv-reconnect')
                                            _removeClass(this.el(),'vjs-seeking')
                                        }


                                        if(this.src().indexOf('.flv') != -1){
                                            var range = 0;
                                            var bf = this.buffered();
                                            var time = this.currentTime();
                                            try{
                                                while(!(bf.start(range) <= time && time <= bf.end(range))) {
                                                    range += 1;
                                                }
                                                this.currentTime(bf.end(range) - 0.01)
                                            }catch(err){
                                                range -= 1;
                                                this.currentTime(bf.end(range) - 0.01)
                                            }
                                            if(!self.add_flv_event){
                                                self.add_flv_event = true;


                                                //监控flv log
                                                var flv_player =  this.tech({ IWillNotUseThisInPlugins: true }).flvPlayer
                                                flv_player.on(flvjs.Events.ERROR, (errorType) => {

                                                    if(errorType == flvjs.ErrorTypes.NETWORK_ERROR){
                                                        var src = this.src();
                                                        _attr(this.el(),'is_flv_recon_play',false)
                                                        _addClass(this.el(),'vjs-flv-reconnect');
                                                        var reconnect_time = ''
                                                        reconnect_time =   _attr(this.el(),'reconnect_time')
                                                        reconnect_time && clearInterval(reconnect_time)
                                                        reconnect_time = setInterval(() => {
                                                            self.reconnect_count++;
                                                            //                                                                if(self.reconnect_count == self.reconnect_max_count){
                                                            //                                                                    clearInterval(self.reconnect_time)
                                                            //                                                                    return
                                                            //                                                                }
                                                            flv_player.unload()
                                                            flv_player.load()
                                                            //                                                                this.src({
                                                            //                                                                    type:'video/flv',
                                                            //                                                                    src:src
                                                            //                                                                })


                                                        },self.reconnect_step)
                                                        _attr(this.el(),'reconnect_time',reconnect_time)
                                                        self.$emit('flv_error', this);
                                                    }


                                                });
                                                flv_player.on(flvjs.Events.MEDIA_INFO,() => {
                                                    if(_attr(this.el(),'reconnect_time')){

                                                        _attr(this.el(),'is_flv_recon_play',true)
                                                        this.play();

                                                        clearInterval(_attr(this.el(),'reconnect_time'))

                                                        _removeAttr(this.el(),'reconnect_time')
                                                        self.reconnect_count = 0


                                                    }

                                                })
                                                flvjs.LoggingControl.addLogListener((type, str) => {
                                                    if(str == '[FLVDemuxer] > Parsed onMetaData'){

                                                        self.$emit('flv_load_meta_data', this);

                                                    }


                                                });
                                            }



                                        }


                                        if(_hasClass(this.el(),'vjs-cengji')){
                                            _removeClass(this.el(),'vjs-cengji')
                                        }


                                        if(self.videoInfo.is_finger_mark == 1 && !self.is_run_finger){

                                            if(_find(this.el(),'.vjs-finger-text').length == 0){
                                                var location_origin = window.location.hostname + (window.location.port ? ':' + window.location.port : '');
                                                var finger_text;
                                                finger_text = location_origin +' 访客 '+mathRand();
                                                var clone_div = _createElementByString('<div class="vjs-finger-text-clone">'+finger_text+'</div>')[0]
                                                this.el().appendChild(clone_div)
                                                var finer_width = _width(clone_div)
                                                this.el().removeChild(clone_div)
                                                var div = _createElementByString('<div class="vjs-finger-text vjs-finger-text-ani" style="right:-'+finer_width+'px;width:'+finer_width+'px">'+finger_text+'</div>')[0]
                                                this.el().appendChild(div)
                                                div.addEventListener("transitionend",() => {
                                                    _removeClass(div,'vjs-finger-text-ani')
                                                    _css(div,{right:'-'+finer_width+'px'});
                                                    self.is_run_finger = false;
                                                    setTimeout(() => {
                                                        if(!_hasClass(div,'vjs-finger-text-ani')){
                                                            _addClass(div,'vjs-finger-text-ani')
                                                        }

                                                    },10)
                                                    if(!this.paused()){
                                                        self.run_finger_mark()
                                                    }



                                                });


                                            }

                                            self.run_finger_mark()
                                        }




                                    }
                                    if(event == 'pause' || event == 'ended'){
                                        if(self.finger_time){
                                            clearTimeout(self.finger_time)
                                        }
                                    }


                                    if(event == 'loadeddata'){
                                        if(!IsPC()){
                                            emitPlayerState(event, true)
                                        }

                                        self.resizeVideo()

                                    }
                                    if(event == 'fullscreenchange'){
                                        self.resizeVideo()
                                    }
                                    emitPlayerState(event, true)
                                })
                            })(events[i])
                        }
                    }

                    // watch timeupdate
                    this.on('timeupdate', function () {
                        emitPlayerState('timeupdate', this.currentTime())
                    })
                    // player readied
                    self.$emit('ready', this);



                    if(self.videoInfo.is_fill){
                        if(self.videoInfo.is_water_mark == 1 && !self.is_add_mark){
                            self.is_add_mark = true
                            this.watermark({
                                image: self.videoInfo.water_mark_img
                            });
                        }
                    }

                })
                this.player.addClass('vjs-cengji')
            },
            dispose(callback) {

                if (this.player && this.player.dispose) {
                    if (this.player.techName_ !== 'Flash') {
                        this.player.pause && this.player.pause()
                    }

                    this.player.dispose()
                    this.player = null

                    this.$nextTick(() => {

                        this.reseted = false
                        this.$nextTick(() => {
                            this.reseted = true
                            this.$nextTick(() => {
                                callback && callback()
                            })
                        })
                    })
                }
            },
            run_finger_mark(is_mobile_full_screen,pos){


                var $finger = _find(this.player.el(),'.vjs-finger-text')[0];



                if(is_mobile_full_screen){
                    var ranomPos = Math.ceil(Math.random() * (pos - 20)) + pos;
                }else{
                    var ranomPos = Math.ceil(Math.random() * (_height(this.player.el()) - 20));
                }
                var init_right_pos = -1 * _width($finger);
                var total_width = _width(this.player.el());
                _css($finger,{'right':init_right_pos+'px','top':ranomPos+'px'})

                var randomTime = (Math.ceil(Math.random() * 10)) * 1000;
                this.finger_time = setTimeout(() => {

                    this.is_run_finger = true;
                    _css($finger,{'right':total_width+'px'})
                },randomTime)
            },
            resizeVideo(){
                if(this.videoInfo.is_fill == 1 && _find(this.player.el(),'.vjs-tech').length > 0){

                    var nativeWidth = _find(this.player.el(),'object.vjs-tech').length > 0 ?
                        _find(this.player.el(),'object.vjs-tech')[0].vjs_getProperty('videoWidth') :
                        _find(this.player.el(),'video.vjs-tech')[0].videoWidth;

                    var nativeHeight = _find(this.player.el(),'object.vjs-tech').length > 0 ?
                        _find(this.player.el(),'object.vjs-tech')[0].vjs_getProperty('videoHeight') :
                        _find(this.player.el(),'video.vjs-tech')[0].videoHeight;
                    var availableWidth = _width(this.player.el())
                    var availableHeight = _height(this.player.el())
                    var mod;
                    if(nativeWidth / nativeHeight <  availableWidth / availableHeight){
                        mod = availableWidth / nativeWidth //fit to width
                    }else{
                        mod = availableHeight / nativeHeight //fit to height
                    }

                    var dWidth = mod * nativeWidth;
                    var dHeight = mod * nativeHeight;
                    var hdif = availableWidth - dWidth;
                    var margL = hdif/2
                    var vdif = availableHeight - dHeight;
                    var margT = vdif/2
                    _css(_find(this.player.el(),'.vjs-tech'),{'width':dWidth+'px',height:dHeight+'px',marginLeft:Math.floor(margL) + 'px',marginTop:Math.floor(margT) + 'px'})
                }

            },

        },
        watch:{
            videoInfo(val){
                if(this.player){
                    if(val.is_water_mark == 1 && !this.is_add_mark){
                        this.is_add_mark = true
                        this.player.watermark({
                            image: val.water_mark_img
                        });
                    }
                    if(val.back_img){
                        this.player.poster(val.back_img)
                    }else{
                        this.player.poster(require('assets/player.png'))
                    }

                }

            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .video-player{
        video{
            width: 100%;
            height: 100%;
        }
    }

    .vjs-has-started+.video-player-shade{
        display: none;
    }
    .el-popup-parent--hidden{
        .video-player-shade{
            display: none;
        }
    }
    .video-js{
        overflow: hidden;
       .vjs-watermark-content{
           opacity: 1!important;
           z-index:200;
           img{
               width: auto;
               height: auto;
               max-height: 100px;
           }
       }
    }
    .small-video{
        .video-js:not(.vjs-fullscreen){
            .vjs-watermark-content{
                img{
                    max-height: 20px;
                }
            }
        }
    }
    .vjs-tech,.vjs-poster{
        outline :none;
    }
    .video-js .vjs-progress-control{
        min-width:0
    }
    .vjs-finger-text{
        position: absolute;
        top:0;
        right:0;
        color:#999;
        font-size: 12px;
        z-index:10;
        white-space: nowrap;



    }
    .vjs-finger-text-ani{
        transition: right 30s ease;
    }
    .vjs-finger-text-clone{
        position: absolute;
        top:0;
        right:0;
        color:#999;
        font-size: 12px;
        z-index:-1;
        white-space: nowrap;
    }
    .pc-video-player{
        .videojs-fill{
            video{
                object-fit: cover;
            }
            .vjs-tech{
                right: 0px;
                left: 0px;
                top: 0px;
                bottom: 0px;
                margin: auto;
            }

        }
    }
    .m-video-player{
        .videojs-fill:not(.vjs-fullscreen){
            video{
                object-fit: cover;
            }
            .vjs-tech{
                right: 0px;
                left: 0px;
                top: 0px;
                bottom: 0px;
                margin: auto;
            }

        }
    }




</style>





