<template>
	<player :videoInfo="videoInfo"></player>
</template>

<script>
    import player from 'components/player'
	export default {
        data(){
            return{
                videoInfo:{
                    is_fill:false
				}
			}
		},
		components: {
            player
		},
		mounted(){

		},
		methods:{

		},

	}
</script>

<style lang="scss" rel="stylesheet/scss">


</style>
