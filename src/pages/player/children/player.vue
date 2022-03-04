<template>
	<player :params="params"></player>
</template>

<script>
    import player from 'components/player'
	export default {
        data(){
            return{
                params:{
                    video:{
                        is_fill:false
					},
					section_list:[{
                        lesson_id:1,
                        lesson_name:'课时1',
                        f_type:1,
                        f_type_name:'视频',
                        play_info:{
                            list:['/medias/01_avc_1104x622p25_aac_44100_2.mp4']
                        }
                    },{
                        lesson_id:2,
                        lesson_name:'课时2',
                        f_type:2,
                        f_type_name:'图片',
                        play_info:{
                            list:['/medias/01_1920x1080p.png']
                        }
                    },{
                        lesson_id:3,
                        lesson_name:'课时3',
                        f_type:3,
                        f_type_name:'文档',
                        play_info:{
                            list:[
                                "/medias/page-0.jpg",
                                "/medias/page-1.jpg"
                            ]
                        }
                    },{
                        lesson_id:4,
                        lesson_name:'课时4',
                        f_type:34,
                        f_type_name:'PPT',
                        play_info:{
                            list:[
                                "/medias/ppt-0.jpg",
                                "/medias/ppt-1.jpg"
                            ]
                        }
                    },{
                        lesson_id:5,
                        lesson_name:'课时5',
                        f_type:4,
                        f_type_name:'音乐',
                        play_info:{
                            list:[
                                "/medias/12_MPEG-Audio_8000_1.mp3"
                            ]
                        }
                    },{
                        lesson_id:6,
                        lesson_name:'课时6',
                        f_type:4,
                        f_type_name:'音乐',
                        play_info:{
                            list:[
                                "/medias/06_aac_32000_1.aac"
                            ]
                        }
                    }]
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
