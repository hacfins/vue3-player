<template>
    <div class="pic-play">
        <img v-if="curImgSrc" :src="curImgSrc" alt="">

    </div>
</template>

<script>
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

        },
        mounted(){



        },
        methods   : {
            filePlay(){
                this.curImgSrc = this.playSection.play_info.list[0];

            },
            previewPic(){

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
