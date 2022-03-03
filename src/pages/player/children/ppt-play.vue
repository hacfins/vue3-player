<template>
    <pre-ppt
        ref="ppt"
        class="detail-ppt-panel"
        :curItem="playSection"
    >
    </pre-ppt>

</template>

<script>
    import prePpt from 'components/preview-ppt'
    export default {
        props:{
            playSection:{
                type:Object,
                default:null
            },
        },
        data(){
            return {

            }
        },
        computed  : {

        },
        components: {
            prePpt
        },
        mounted(){

        },
        methods   : {
            initPlay(){
                this.$refs.ppt.reset();
                this.$refs.ppt.keyEvent();
                this.$refs.ppt.loadPPT(this.playSection)
            }

        },
        watch     : {

        }
    }
</script>


<style lang="scss" rel="stylesheet/scss">

</style>
