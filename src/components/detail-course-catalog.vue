<template>
    <ul class="detail-detail-catalog-list">
        <li v-for="(item,index) in sectionList" :class="{'active':item.lesson_id == lesson_id}">
            <a  class="detail-section-item" :class="{'active-detail-section-item':item.lesson_id == lesson_id}" @click="changeLesson(item)">
                <div class="detail-section-item-left">
                    <div class="detail-catalog-title">
                        <span class="hk-text-ellipsis detail-detail-catalog-title-text" :title="item.lesson_name">{{item.lesson_name}}</span>

                        <span>{{item.f_type_name}}</span>

                    </div>
                </div>
            </a>
        </li>
    </ul>
</template>

<script>
    export default {
        props     : {
            sectionList:{
                type   : Array,
                default: []
            }
        },
        data(){
            return {
                lesson_id:'',


            }
        },
        computed:{

        },
        mounted(){
            this.changeLesson(this.sectionList[0])
        },
        components: {

        },
        methods: {
            changeLesson(item){
                if(item.lesson_id == this.lesson_id){
                    return
                }
                this.lesson_id = item.lesson_id;
                this.$emit('change',item)

            },
        },
        watch  : {

        }


    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .detail-detail-catalog-list{
        li{
            height: auto;
            margin:0;
            color: #fff;

            .detail-section-item{
                display: flex;
                padding:10px 20px;
                position: relative;
                height: auto;
                cursor: pointer;
                align-items: center;
                .detail-section-item-left{
                    min-width: 0;
                    flex: 1;
                    .detail-catalog-title{
                        font-size:14px;
                        width: 100%;
                        display: flex;
                        align-items: center;
                        height: auto;
                        line-height:22px;
                        justify-content: space-between;
                    }
                }

            }

            .active-detail-section-item{
                cursor: default;
                background: rgba(0,0,0,.5);
                &:after,&:before{
                    display: none;
                }
                .detail-section-item-left{
                    .detail-catalog-title{

                        .detail-catalog-play-icon{

                        }
                    }
                }

            }

            .cursor-default{
                cursor: default;
            }



        }
        li:hover{
            .detail-section-item{
                .detail-catalog-title{

                    .detail-catalog-play-icon{


                    }
                }
                .detail-catalog-status{
                    .detail-catalog-status-s-time{
                        display: block;
                    }
                    .detail-catalog-tag{
                        display: block;
                    }
                    .study-canvas{
                        display:block
                    }
                }
            }
        }

    }
</style>

                        