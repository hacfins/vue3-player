<template>
    <div class="ppt-panel">
        <div id="ppt-wrap">
            <div class="ppt-content">

                <img v-show="curImgSrc" :src="curImgSrc" alt="">

            </div>
            <div onselectstart="return false;" class="ppt-arrow-left ppt-arrow" @click="preBrowse">
                &nbsp;&nbsp;
            </div>
            <div onselectstart="return false;" class="ppt-arrow-right ppt-arrow" @click="nextBrowse">
                &nbsp;&nbsp;
            </div>
            <div class="ppt-slider">
                <el-slider
                    v-model="curprogress"
                    :min="1"
                    :max="totalCount"
                    :step="0.1"
                    tooltip-class="custom-tip"
                    :format-tooltip="formatTooltip"
                    @change="PPTChange">

                </el-slider>
            </div>

        </div>
    </div>
</template>

<script>
    export default {
        props   : {
            curItem  : {
                type   : Object,
                default: null
            },

        },
        data(){
            return {
                curpage    : 1,
                curprogress: 1,
                curImgSrc  : '',
                totalCount : 1,
                pptList    : []
            }
        },
        computed: {},
        mounted(){

        },
        methods : {
            formatTooltip(val){
                if (isNaN(val)) {
                    return '第1页'
                }
                var num = Math.floor(val)
                var str = '第' + num + '页'
                return str
            },
            PPTChange(val){
                if (isNaN(val)) {
                    return
                }
                var num      = Math.floor(val)
                this.curpage = num;
                this.loadPPT(this.curItem)
            },
            loadPPT() {

                if (this.pptList[this.curpage - 1]) {
                    this.curImgSrc = this.pptList[this.curpage - 1];
                    return;

                }
                var res = {
                    play_info:{
                        list:[]
                    }
                }
                this.totalCount = res.play_info.list.length;
                res.play_info.list.forEach((imgitem, i) => {
                    this.pptList[(this.curpage - 1) + i] = imgitem
                })
                this.curImgSrc = this.pptList[0];
            },
            preBrowse(){
                this.curpage--;
                if (this.curpage < 1) {
                    this.curpage = 1
                    return;
                }
                this.curprogress = this.curpage
                this.loadPPT(this.curItem)
            },
            nextBrowse(){

                this.curpage++;
                if (this.curpage > this.totalCount) {
                    this.curpage = this.totalCount
                    return;
                }
                this.curprogress = this.curpage
                this.loadPPT(this.curItem)
            },
            reset(){
                this.curpage     = 1;
                this.curprogress = 1;
                this.curImgSrc   = '';
                this.totalCount  = 1;
                this.pptList     = []
            },
            keyEvent(){
                document.documentElement.off('keyup')
                document.documentElement.on('keyup', (event) => {
                    if (event.target.tagName != 'TEXTAREA') {
                        if (event.keyCode == 39) {
                            this.nextBrowse()

                        } else if (event.keyCode == 37) {
                            this.preBrowse()
                        }
                    }

                })
            }

        },

    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .ppt-panel {
        height      : 100%;
        display     : flex;
        align-items : center;
    }

    #ppt-wrap {
        height     : 776px;
        width      : 992px;
        margin     : 0 auto;
        padding    : 16px 16px 0 16px;
        background : #fff;
        position   : relative;
        .ppt-content {
            width               : 100%;
            height              : calc(100% - 40px);
            background-position : center;
            background-repeat   : no-repeat;
            background-size     : contain;
            img {
                width      : 100%;
                height     : 100%;
                object-fit : contain;
            }
        }
        .ppt-arrow {
            position            : absolute;
            width               : 49.9%;
            bottom              : 40px;
            top                 : 0;
            -moz-user-select    : none;
            -webkit-user-select : none;

        }
        .ppt-arrow.ppt-arrow-left {
            left   : 0;
            cursor : url(~assets/arrow_left.png), default;
        }
        .ppt-arrow.ppt-arrow-right {
            right  : 0;
            cursor : url(~assets/arrow_right.png), default;
        }

        .ppt-slider {
            padding-left  : 20px;
            padding-right : 20px;
            .el-slider__button-wrapper {
                width  : 40px;
                height : 40px;
            }
            .el-slider__button {
                background          : url(~assets/detail_sprite.png);
                width               : 37px;
                height              : 19px;
                background-position : -207px -6px;
                border-radius       : 0;
                border              : none;
                display             : block;
                margin-top          : 9.8px;
            }
            .el-slider__button.hover, .el-slider__button.dragging {
                transform : scale(1);
            }
            .el-slider__bar, .el-slider__runway {
                height : 8px;
            }
            .el-slider__bar {
                background : #3aab87
            }
        }

    }

    .custom-tip {
        width       : 70px;
        height      : 20px;
        border      : 1px solid #769dc0;
        background  : #fff !important;
        font-size   : 10px;
        color       : #769dc0 !important;
        text-align  : center;
        line-height : 18px;
        padding     : 0;
    }

    .custom-tip .el-popper__arrow {
        border-top-color : #769dc0;
    }

    .custom-tip .el-popper__arrow:before {
        background  : #fff !important;
        border      : 1px solid #769dc0;
        border-top  : none;
        border-left : none;
    }

    .detail-ppt-panel {
        #ppt-wrap {
            height  : 100%;
            width   : 100%;
            padding : 0;
        }
    }

</style>

