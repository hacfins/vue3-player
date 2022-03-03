<template>
    <div class=" detail-video">
        <vue-video
            v-if="rePlaySrc"
            v-show="isShowVideo"
            class="vjs-custom-skin vjs-vod"
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
            @playerclick="mediaClick($event)">
        </vue-video>
    </div>
</template>

<script>
    import PlayVideo from 'components/video'
    export default {
        props     : {
            playSection: {
                type   : Object,
                default: null
            },
        },
        data(){
            return {
                pre          : process.env.NODE_ENV == 'production' ? '/web' : '',
                myplayer     : '',
                rePlaySrc    : false,
                isShowVideo  : false,
                playerOptions: {
                    height   : '',
                    techOrder: ['html5', 'flash'],
                    autoplay : true,
                    controls : true,
                    flash    : {
                        swf: this.pre + '/assets/videojs-flashls-source-handler-0.0.0/video-js-hls.swf'
                    }
                },
                resourses    : 1,
                loadedMeta   : false,
            }
        },
        computed  : {},
        components: {
            'vue-video': PlayVideo,
        },
        mounted(){

        },
        methods   : {
            initPlay(){
                _removeClass('.vjs-menu-item', 'vjs-selected')
                _addClass(_dom('.vjs-menu-item')[0], 'vjs-selected')
                _dom('.vjs-resolution-button-label').length > 0 && (_dom('.vjs-resolution-button-label')[0].innerHTML = '高清');
                this.filePlay(2);
                document.documentElement.off('keydown')
                document.documentElement.on('keydown', (event) => {
                    if (event.keyCode == 13 || event.keyCode == 32) {
                        if (event.target.tagName != 'INPUT' && event.target.tagName != 'TEXTAREA' && event.target.tagName != 'BUTTON') {
                            event.preventDefault();
                        } else {
                            return
                        }
                        if (event.keyCode == 32 && this.myplayer) {
                            if (this.myplayer.paused()) {
                                this.myplayer.play()
                            } else {
                                this.myplayer.pause()
                            }
                        }
                    }
                })
            },
            filePlay(resolution){
                var count = 1;
                var res = {
                    play_info:{
                        list:[]
                    }
                }


                this.resourses   = count;
                this.isShowVideo = true;
                if (!this.rePlaySrc) {
                    this.playerOptions.sources = [{
                        src: res.play_info.list[0]
                    }]
                    this.rePlaySrc             = true;
                } else {
                    if (count != 2) {
                        _hide('.vjs-resolution-button')
                    } else {
                        _show('.vjs-resolution-button')
                    }
                    this.myplayer.src(res.play_info.list[0]);
                }


            },
            mediaClick(player){
                if (!_hasClass(player.el(), 'vjs-has-started')) {
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
            onPlayerWaiting(player) {
                // console.log('player Waiting!', player)
            },
            onPlayerPlaying(player) {
                // console.log('player Playing!', player)
            },
            onPlayerTimeupdate(player) {
                // console.log('player Timeupdate!', player.currentTime())

                if (this.loadedMeta) {
                    setLocalStorage('video_' + this.playSection.lesson_id, player.currentTime())
                }
            },
            onPlayerCanplay(player) {
                // console.log('player Canplay!', player)
            },
            onPlayerCanplaythrough(player) {
                // console.log('player Canplaythrough!', player)
            },
            onPlayerLoadedMetadata(player){
                var seekTime = getLocalStorage('video_' + this.playSection.lesson_id);

                if (!seekTime) {
                    seekTime = 0
                } else {
                    if (player.duration() && player.duration() - seekTime < 20) {
                        deleteLocalStorage('video_' + this.playSection.lesson_id)
                        seekTime = 0
                    }
                }
                player.currentTime(seekTime)
                this.loadedMeta = true;
            },
            // or listen state event
            playerStateChanged(playerCurrentState) {
                //                 console.log('player current update state', playerCurrentState)
            },
            // player is ready
            playerReadied(player) {
                this.myplayer = player;

                var str = '<div class="vjs-menu-button vjs-menu-button-popup vjs-control vjs-button vjs-resolution-button">' +
                    '<button class="vjs-menu-button vjs-menu-button-popup vjs-button" type="button" aria-live="polite" aria-disabled="false" aria-haspopup="true" aria-expanded="false" title="清晰度">' +
                    '<span aria-hidden="true" class="vjs-icon-placeholder"></span>' +
                    '<span class="vjs-control-text">Quality</span>' +
                    '</button>' +
                    '<div class="vjs-menu">' +
                    '<ul class="vjs-menu-content" role="menu">' +
                    '<li type="2"  class="vjs-menu-item vjs-selected" tabindex="-1" role="menuitem" aria-live="polite" aria-disabled="false">' +
                    '<span class="vjs-menu-item-text">高清</span>' +
                    '<span class="vjs-control-text"></span>' +
                    '</li>' +
                    '<li type="1"   class="vjs-menu-item" tabindex="-1" role="menuitem" aria-live="polite" aria-disabled="false">' +
                    '<span class="vjs-menu-item-text">低清</span>' +
                    '<span class="vjs-control-text"></span>' +
                    '</li>' +
                    '</ul>' +
                    '</div>' +
                    '<span class="vjs-resolution-button-label">高清</span>' +
                    '</div>'

                _after('.vjs-control-bar .vjs-progress-control', _createElementByString(str)[0])
                var that = this;

                document.documentElement.on('click', '.vjs-menu-item', function (e) {
                    if (_hasClass(this, 'vjs-selected')) {
                        return;
                    }
                    var type = _attr(this, 'type');

                    _addClass(this, 'vjs-selected')


                    _removeClass(_siblings(this), 'vjs-selected')


                    var CurText = ''
                    if (type == 2) {
                        CurText = '高清'
                    } else {
                        CurText = '低清'
                    }
                    _dom('.vjs-resolution-button-label')[0].innerHTML = CurText;
                    that.loadedMeta                                   = false;
                    that.filePlay(type);

                })

                if (this.resourses == 2) {
                    _show('.vjs-resolution-button')
                }

            },
            playerResolutionChange(player){
                console.info('Source changed to %s', player.src())

            }

        },
        watch     : {}
    }
</script>


<style lang="scss" rel="stylesheet/scss">
    .detail-video {
        height : 100%;
        background: #000;
        .vjs-custom-skin {
            height : 100%;
        }
        .video-js {
            height : 100%;
        }
        .video-js .vjs-control-bar, .video-js .vjs-big-play-button {
            z-index : 3000
        }
        .video-js .vjs-big-play-button {
            z-index : 2000
        }
        .video-js.vjs-fullscreen {
            z-index : 3000
        }
        .vjs-loading-spinner {
            display : none !important;
        }
        .vjs-resolution-button {
            display : none;
        }
        .el-loading-mask {
            z-index    : 999;
            background : rgba(0, 0, 0, 1)
        }
    }

    .detail-share-video{
        height: calc(100% - 24px);
    }

</style>
