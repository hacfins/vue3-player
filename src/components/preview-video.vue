<template>
    <div class="pre-video-wrap" v-loading="!isShowVideo">
        <vue-video
            v-if="rePlaySrc"
            class="vjs-custom-skin"
            ref="videoPlayer"
            refname="playvideo"
            :options="playerOptions"
            :playsinline="true"
            @play="onPlayerPlay($event)"
            @pause="onPlayerPause($event)"
            @ended="onPlayerEnded($event)"
            @loadeddata="onPlayerLoadeddata($event)"
            @loadedmetadata="onPlayerLoadedMetadata($event)"
            @waiting="onPlayerWaiting($event)"
            @playing="onPlayerPlaying($event)"
            @timeupdate="onPlayerTimeupdate($event)"
            @canplay="onPlayerCanplay($event)"
            @canplaythrough="onPlayerCanplaythrough($event)"
            @ready="playerReadied"
            @statechanged="playerStateChanged($event)"
            @click="mediaClick($event)">
        </vue-video>
    </div>

</template>

<script>
    import vueVideo from 'components/video.vue'
    export default {
        props  : {
            curItem:{
                type:Object,
                default:null
            },
        },
        data(){
            return {
                pre             : process.env.NODE_ENV == 'production' ? '/web' : '',
                myplayer:'',
                rePlaySrc:false,
                isShowVideo:true,
                playerOptions: {
                    height   : '400',
                    techOrder: ['html5','flash'],
                    autoplay : true,
                    controls : true,
                    flash    : {
                        swf: this.pre+'/assets/videojs-flashls-source-handler-0.0.0/video-js-hls.swf'
                    }
                },

            }
        },
        computed:{


        },
        mounted(){


        },
        components:{
            vueVideo
        },
        methods: {
            playVideo() {
                var res = {
                    play_info:{
                        list:[]
                    }
                }

                this.playerOptions.sources = [{
                    src : res.play_info.list[0]
                }]
                this.isShowVideo = true;
                this.rePlaySrc = true;

            },
            mediaClick(player){
                if(!_hasClass(player.el(),'vjs-has-started')){
                    player.play()
                }

            },
            onPlayerPlay(player) {
                //                 console.log('player play!', player)

            },
            onPlayerPause(player) {
                //                 console.log('player pause!', player)

            },
            onPlayerEnded(player) {
                // console.log('player ended!', player)

            },
            onPlayerLoadeddata(player) {
                // console.log('player Loadeddata!', player)
            },
            onPlayerLoadedMetadata(player){
            },
            onPlayerWaiting(player) {
                // console.log('player Waiting!', player)

            },
            onPlayerPlaying(player) {
                // console.log('player Playing!', player)
            },
            onPlayerTimeupdate(player) {
                // console.log('player Timeupdate!', player.currentTime())

            },
            onPlayerCanplay(player) {
                // console.log('player Canplay!', player)
            },
            onPlayerCanplaythrough(player) {
                // console.log('player Canplaythrough!', player)
            },

            // or listen state event
            playerStateChanged(playerCurrentState) {
                //                 console.log('player current update state', playerCurrentState)
            },

            // player is ready
            playerReadied(player) {
                this.myplayer = player;
            },

        },

    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .pre-video-wrap{
        position:absolute;
        top:50%;
        left:50%;
        transform: translate(-50%,-50%);
        z-index:10000;
        height:400px;
        width:800px;
        .el-loading-mask{
            background:rgba(0,0,0,1);

        }
    }

</style>

