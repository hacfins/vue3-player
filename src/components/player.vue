<template>
    <div class="playe-wrap">
        <div class="player-wrap-cnt">
            <div class="player-wrap-right">
                <detail-video
                    v-show="playSection.f_type == 1"
                    :playSection="playSection"
                    :videoInfo="params.video"
                    ref="detail_video">
                </detail-video>
                <detail-pic
                    v-show="playSection.f_type == 2"
                    :playSection="playSection"
                    ref="detail_pic"
                    :showThumb="true"
                    :picList="picList">
                </detail-pic>
                <detail-doc
                    v-show="(playSection.f_type == 3 || playSection.f_type== 31 || playSection.f_type == 32 || playSection.f_type == 33)"
                    :playSection="playSection"
                    ref="detail_doc">
                </detail-doc>
                <detail-ppt
                    v-show="playSection.f_type == 34"
                    :playSection="playSection"
                    ref="detail_ppt">
                </detail-ppt>
                <detail-audio
                    v-show="playSection.f_type == 4"
                    :playSection="playSection"
                    :audioList="audioList"
                    ref="detail_audio">
                </detail-audio>
            </div>
            <div class="player-wrap-left">
                <div class="lesson-list-wrap">
                    <course-catalog ref="catalog" @change="changeLesson" :sectionList="params.section_list"></course-catalog>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    import detailVideo from '@/pages/player/children/video-play'
    import detailPic from '@/pages/player/children/pic-play'
    import detailDoc from '@/pages/player/children/doc-play'
    import detailPpt from '@/pages/player/children/ppt-play'
    import detailAudio from '@/pages/player/children/audio-play'
    import courseCatalog from 'components/detail-course-catalog'
    export default {
        props     : {
            params:{
                type   : Object,
                default: {
                    video:{
                        is_fill:false
                    },
                    section_list : []
                }
            }
        },
        data(){
            return{
                myplayer:'',
                playerOptions: {
                    height   : '',
                    techOrder: ['html5'],
                    autoplay : false,
                    controls : true,
                    flash    : {
                        swf: '/assets/videojs-swf-5.4.2/dist/video-js.swf'
                    },
                    flvjs: {
                        mediaDataSource: {
                            isLive         : true,
                            cors           : true,
                            withCredentials: false,
                        },
                        config         : {
                            enableWorker     : true, //浏览器端是否开启flv.js的多线程
                            enableStashBuffer: false,//音视频服务器的buffer
                            stashInitialSize : 1,//首桢显示等待时长
                            deferLoadAfterSourceOpen:false,//是否只在当前标签播放
                            fixAudioTimestampGap: false,

                            lazyLoad: false,
                            lazyLoadMaxDuration: 1,
                            lazyLoadRecoverDuration: 1,

                        }
                    },
                },
                lessonreq:false,
                playSection:'',

            }
        },
        computed  : {
            audioList(){
                return  this.params.section_list.filter((item) => {
                        return item.f_type == 4
                    })
            },
            picList(){
                return this.params.section_list.filter((item) => {
                        return item.f_type == 2
                    })
            },
        },
        components: {
            courseCatalog,
            detailVideo,
            detailPic,
            detailDoc,
            detailPpt,
            detailAudio

        },
        mounted(){
            this.calcPlayWrapHeight();
        },
        methods:{
            changeLesson(val){
                this.playSection = val;
            },
            playToggle(){
                if(this.myplayer.paused()){
                    this.myplayer.play()
                }else{
                    this.myplayer.pause()
                }

            },
            calcPlayWrapHeight(){
                var sumheight = window.innerHeight
                var contentH  = sumheight
                if (contentH < 550) {
                    contentH = 550;
                }
                _dom('.playe-wrap')[0].style.height = contentH + 'px'
                if(!this.myplayer){
                    this.playerOptions.height = contentH - 32;
                }else{

                    this.myplayer.height(contentH - 32);
                }

            },

        },
        watch:{
            playSection(val){
                this.$nextTick(() => {
                    document.documentElement.off('keydown');
                    this.$refs.detail_pic.curImgSrc = '';
                    this.$refs.detail_video.loadedMeta = false;
                    if(val.f_type != 4){
                        this.$refs.detail_audio.reset();
                    }
                    if(val.f_type != 1){
                        if(this.$refs.detail_video.myplayer){
                            this.$refs.detail_video.myplayer.pause()
                        }
                    }
                    if(val.f_type == 1){
                        this.$refs.detail_video.initPlay()
                    }
                    if(val.f_type == 2){
                        this.$refs.detail_pic.filePlay()
                    }
                    if(val.f_type == 3 || val.f_type == 31 || val.f_type == 32 || val.f_type == 33){
                        this.$refs.detail_doc.reset();
                        this.$refs.detail_doc.initPlay();
                    }
                    if(val.f_type == 34){
                        this.$refs.detail_ppt.initPlay();
                    }
                    if(val.f_type == 4){
                        this.$refs.detail_audio.$refs.audio.isPause = false
                        this.$refs.detail_audio.filePlay()
                    }
                })
            }
        }

    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .playe-wrap {
        overflow: hidden;
        .player-wrap-cnt{
            width: 1440px;
            padding:16px 0;
            margin:0px auto 0 auto;
            height: 100%;
        }
        .player-wrap-right{
            height:100%;
            float:left;
            width: calc(100% - 320px);
            position   : relative;
            background : #000;
            background-position: center;
            background-size: cover;
            background-repeat: no-repeat;
            .online-num{
                position: absolute;
                background: rgba(0,0,0,.5);
                padding:5px 8px;
                top:16px;
                right:16px;
                color:#FEFEFD;
                border-radius:5px;
                line-height:1;
                font-size:12px;
                z-index:4000

            }
            .live-room-title {
                color           : #fff;
                position:absolute;
                z-index:300;
                text-shadow: 1px 1px 0px #000;
                top:16px;
                left:16px;

            }
            .video-js.vjs-fullscreen{
                z-index:3000
            }
            ::-webkit-scrollbar{
                display:none
            }
        }
        .player-wrap-left{
            float:left;
            width:320px;
            height:100%;
            background: #2d2d2d;
            overflow: hidden;
            position:relative;
            .hide-class{
                opacity: 0;
            }
            .hide-visible-class{
                visibility: hidden;
            }
            .lesson-list-wrap{
                height:100%;
                .detai-course-catalog-list{

                }
                .el-loading-mask{
                    background:transparent
                }
            }







        }
    }
</style>
