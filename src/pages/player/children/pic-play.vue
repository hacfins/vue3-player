<template>
    <div class="pic-play">
        <img v-if="curImgSrc" @click="previewPic" :src="curImgSrc" alt="">
        <preview
            ref="preview"
            :openItem="playSection"
            :showThumb="showThumb"
        >
        </preview>
    </div>

</template>

<script>
    import preview from 'components/vod-preview'
    import {sectionPlay,filePlay} from '@/api/getdata'
    import {getSessionStorage} from '@/config/utils'
    export default {
        props:{
            playSection:{
                type:Object,
                default:null
            },
            picList:{
                type:Array,
                default:[]
            },
            showThumb:{
                type:Boolean,
                default:true
            }
        },
        data(){
            return {
                curImgSrc:''

            }
        },
        computed  : {

        },
        components: {
            preview
        },
        mounted(){



        },
        methods   : {
            filePlay(){
                var res = {
                    play_info:{
                        list:[]
                    }
                }
                this.curImgSrc = res.play_info.list[0];

            },


            previewPic(){

                this.$refs.preview.previewShow = true;
                this.$refs.preview.listData = this.picList;

            }

        },
        watch     : {

        }
    }
</script>


<style lang="scss" rel="stylesheet/scss">
    .pic-play{
        height:100%;
        width:100%;
        display: inline-block;
        vertical-align: middle;
        text-align: center;
        &:before{
            content: "";
            display: inline-block;
            width: 0;
            height: 100%;
            vertical-align: middle;

        }
        img{
            cursor: pointer;
            display: inline-block;
            vertical-align: middle;
            max-width: 100%;
            max-height: 100%;
        }
    }

</style>
