<template>
    <div class="audio-play">
        <audio-play
            :curItem="playSection"
            ref="audio"
            width="500"
            :initial-volume="audioInitVolume"
            :auto-play="audioAutoPlay"
            bg-color="#F7FAFF"
            :listData="audioList"
            @timeupdate="timeupdate"
            @end="end"
        ></audio-play>

    </div>

</template>

<script>
    import audioPlay from 'components/audio'

    export default {
        props:{
            playSection:{
                type:Object,
                default:null
            },
            audioList:{
                type:Array,
                default:[]
            },
        },
        data(){
            return {
                audioAutoPlay:true,
                audioInitVolume:30,
                init:false

            }
        },
        computed  : {


        },
        components: {
            audioPlay

        },
        mounted(){


        },
        methods   : {
            filePlay(){
                if(!this.init){
                    this.init = true;
                    if(!this.audioAutoPlay)
                        this.$refs.audio.$refs.player.removeAttribute('autoplay')
                    this.$refs.audio.$refs.player.volume = this.audioInitVolume / 100;
                }
                this.$refs.audio.currentAudio()

            },
            reset(){
                this.$refs.audio.reset();
            },
            timeupdate(time,duration){

            },
            end(){

            }

        },
        watch     : {
        }
    }
</script>


<style lang="scss" rel="stylesheet/scss">
    .audio-play{
        height:100%;
        width:100%;
    }

</style>
