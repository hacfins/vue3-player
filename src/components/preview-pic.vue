<template>
    <div class="pre-pic-wrap">
        <div v-show="scaleTipShow" class="scale-tip">{{accMul(curscale,100)}}%</div>
        <div class="pic-preview-bd">
            <div v-loading="!curImgSrc" class="pic-content">
                <img v-imgDrag v-if="curImgSrc" :src="curImgSrc" @load="imgLoad" @error="imgError" alt=""
                     :style="{transform:'rotate(' +  curdeg + 'deg) scale(' +  curscale + ')'}">
            </div>

        </div>
        <div class="pic-preview-ft" :class="{'unfold':!is_fold}">
            <div class="toolbar">
                <div class="icons-holder">
                    <span class="esp-rotate" @click="pic_rotate" title="旋转"></span>
                    <span class="el-icon-zoom-in" @click="pic_zoomin" title="放大"></span>
                    <span class="el-icon-zoom-out" @click="pic_zoomout" title="缩小"></span>

                </div>
            </div>
            <div v-show="showThumb" class="small-pic-list-wrap">
                <div class="small-pic-list-toggle" @click="toggleFolder">
                    <i :class="{'el-icon-arrow-down':!is_fold,'el-icon-arrow-up':is_fold}"></i>
                </div>
                <div class="small-pic-list-con">
                    <div class="wrap">
                        <ul class="small-pic-list clearfix" :style="{transform:'translateX('+smallScrollX+'px)'}">
                            <li :title="item.f_name" :alt="item.f_name"
                                class="small-pic-item" v-for=" (item,index) in smallList" :key="index"
                                :class="{'cur':curIndex == index}"
                                @click="previewPic(index)"
                            >
                                <div class="pic"
                                     :style="{backgroundImage:'url('+ (item.img_path ? item.img_path : defaultImgPath) +')'}"></div>
                                <div class="pic-mask"></div>
                            </li>
                        </ul>
                    </div>
                    <div v-show="smallScrollX < 0" class="small-pre" @click="smallPreScroll"><i
                        class="el-icon-arrow-left"></i></div>
                    <div v-show="smallScrollMaxX < smallScrollX" class="small-next" @click="smallNextScroll"><i
                        class="el-icon-arrow-right"></i></div>
                </div>
            </div>
        </div>
        <a v-show="curIndex > 0" class="pre pic-arrow" @click="pic_pre_view"><i class="el-icon-arrow-left"></i></a>
        <a v-show="curIndex < smallList.length - 1" class="next pic-arrow" @click="pic_next_view"><i
            class="el-icon-arrow-right"></i></a>
    </div>
</template>

<script>

    export default {
        props     : {
            smallList: {
                type   : Array,
                default: []
            },
            showThumb: {
                type   : Boolean,
                default: true
            },
        },
        data(){
            return {
                is_fold        : true,
                curImgSrc      : '',
                curdeg         : 0,
                curscale       : 0,
                smallScrollX   : '',
                smallScrollMaxX: -54 * this.smallList.length + 1242,
                scalt          : "",
                validateExt    : ['.bmp', '.exif', 'gif', '.jpe', '.jpeg', '.png', '.jpg', '.ico'],
                scaleTipShow   : false,
                hideScale      : '',
                defaultImgPath : require('assets/defaultImg.png')
            }
        },
        computed  : {
            curIndex(){
                var curIndex;
                this.smallList.forEach((item, i) => {
                    if (item.lesson_id == this.curItem.lesson_id) {
                        curIndex = i;
                    }


                })
                return curIndex
            },
            curExt(){
                var imgpath = this.curItem.img_path ? this.curItem.img_path : this.curItem.img_path
                var ext     = imgpath.substring(imgpath.lastIndexOf('.'), imgpath.length)
                return ext
            }

        },
        mounted(){
            if (this.showThumb) {
                document.documentElement.off('keyup')
                document.documentElement.on('keyup', (event) => {
                    if (event.keyCode == 39) {
                        this.pic_next_view()

                    } else if (event.keyCode == 37) {
                        this.pic_pre_view()
                    }
                })
            }

            document.documentElement.off('mousewheel')
            document.documentElement.on('mousewheel', (e) => {
                if (e.wheelDelta > 0) {
                    this.pic_zoomin()
                } else {
                    this.pic_zoomout()
                }
            })
            _event(document.documentElement, 'DOMMouseScroll', (e) => {
                if (e.detail < 0) {
                    this.pic_zoomin()
                } else {
                    this.pic_zoomout()
                }
            })


        },
        methods   : {
            accMul(arg1, arg2){
                var m = 0, s1 = arg1.toString(),
                    s2        = arg2.toString();
                try {
                    m += s1.split(".")[1].length
                } catch (e) {

                }
                try {
                    m += s2.split(".")[1].length
                } catch (e) {

                }
                return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
            },
            calcScroolX(){
                var curIndex;
                this.smallList.forEach((item, i) => {
                    if (item.lesson_id == this.curItem.lesson_id) {
                        curIndex = i;
                    }

                })
                if (curIndex >= 23) {
                    this.smallScrollX = -54 * (curIndex - 12)
                } else {
                    this.smallScrollX = 0
                }
            },
            toggleFolder(){
                this.is_fold = !this.is_fold

            },
            getPicImgPath(){
                this.curImgSrc = '';
                this.curscale  = 0;
                this.curdeg    = 0;
                var res = {
                    play_info:{
                        list:[]
                    }
                }
                this.curImgSrc =  res.play_info.list[0];
                this.$nextTick(() => {
                    _removeAttr('.pic-content img', 'width height')
                })
            },
            pic_rotate(){
                this.curdeg -= 90

            },
            pic_zoomin(){
                this.scaleTipShow = true;
                this.curscale += 0.25;
                if (this.curscale >= 4) {
                    this.curscale = 4
                }
                this.hideScaleTip()


            },
            pic_zoomout(){
                this.scaleTipShow = true;
                this.curscale -= 0.25;
                if (this.curscale <= 0.25) {
                    this.curscale = 0.25
                }
                this.hideScaleTip()

            },
            hideScaleTip(){
                if (this.hideScale) {
                    clearTimeout(this.hideScale)
                }
                this.hideScale = setTimeout(() => {
                    this.scaleTipShow = false
                }, 1000)
            },
            pic_pre_view(){
                if(this.is_share){
                    if (this.curIndex <= 0) {
                        this.$parent.$parent.openItem = this.smallList[0];
                        return;
                    } else {
                        this.$parent.$parent.openItem = this.smallList[this.curIndex - 1]
                    }
                }else{
                    if (this.curIndex <= 0) {
                        this.$parent.$parent.$parent.$parent.playSection = this.smallList[0];
                        return;
                    } else {
                        this.$parent.$parent.$parent.$parent.playSection = this.smallList[this.curIndex - 1]
                    }
                }

                this.scaleTipShow = false;

                this.$nextTick(() => {
                    this.calcScroolX();
                    this.getPicImgPath()
                })


            },
            pic_next_view(){
                if(this.is_share){
                    if (this.curIndex >= this.smallList.length - 1) {
                        this.$parent.$parent.openItem = this.smallList[this.smallList.length - 1]
                        return;
                    } else {

                        this.$parent.$parent.openItem = this.smallList[this.curIndex + 1]
                    }
                }else{
                    if (this.curIndex >= this.smallList.length - 1) {
                        this.$parent.$parent.$parent.$parent.playSection = this.smallList[this.smallList.length - 1]
                        return;
                    } else {

                        this.$parent.$parent.$parent.$parent.playSection = this.smallList[this.curIndex + 1]
                    }
                }

                this.scaleTipShow = false
                this.$nextTick(() => {
                    this.calcScroolX();
                    this.getPicImgPath()
                })
            },
            previewPic(index){
                if(this.is_share){
                    this.$parent.$parent.openItem = this.smallList[index];
                }else{
                    this.$parent.$parent.$parent.$parent.playSection = this.smallList[index];
                }

                this.$nextTick(() => {
                    this.calcScroolX();
                    this.getPicImgPath()
                })
            },
            reset(){
                this.is_fold   = true;
                this.curImgSrc = '';
                this.curdeg    = 0;
                this.curscale  = 0;
            },
            imgLoad(){
                if (this.scalt) {
                    clearTimeout(this.scalt)
                }
                this.scalt = setTimeout(() => {
                    this.curscale = 1
                }, 150)


            },
            imgError(){
                this.curImgSrc = ''
            },
            resetdegAndScale(){
                this.curdeg   = 0;
                this.curscale = 0;
            },
            smallNextScroll(){
                this.smallScrollX -= 810;
                if (this.smallScrollX <= this.smallScrollMaxX) {
                    this.smallScrollX = this.smallScrollMaxX;
                }
            },
            smallPreScroll(){
                this.smallScrollX += 810;
                if (this.smallScrollX >= 0) {
                    this.smallScrollX = 0;
                }

            },


        },

    }
</script>

<style lang="scss" rel="stylesheet/scss">

    .pre-pic-wrap {
        height : 100%;
        width  : 100%;
        .scale-tip {
            font-family      : "Microsoft YaHei", "WenQuanYi Micro Hei", "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", sans-serif;
            position         : absolute;
            z-index          : 1000;
            font-size        : 12px;
            top              : 50%;
            left             : 50%;
            width            : 50px;
            height           : 20px;
            line-height      : 20px;
            margin-top       : -10px;
            margin-left      : -25px;
            text-align       : center;
            color            : #fff;
            border-radius    : 10px;
            background-color : rgba(0, 0, 0, .8);
        }
        .pic-arrow {
            width       : 64px;
            height      : 80px;
            position    : fixed;
            top         : 50%;
            margin-top  : -40px;
            z-index     : 777;
            padding-top : 17.5px;
            text-align  : center;
            cursor      : pointer;
            i {
                color     : #fff;
                font-size : 45px
            }
            &:hover {
                background    : rgba(0, 0, 0, .7);
                border-radius : 2px;
            }
        }

        .pre {
            left : 25px;
        }
        .next {
            right : 25px;
        }
        .pic-content {
            position   : absolute;
            top        : 50%;
            left       : 50%;

            width      : 750px;
            height     : 750px;
            text-align : center;
            transform  : translate(-50%, -50%);
            .el-loading-mask {
                background : transparent;
            }
            &:before {
                content        : "";
                display        : inline-block;
                width          : 0;
                height         : 100%;
                vertical-align : middle;
            }
            img {
                transition     : transform 0.3s;
                display        : inline-block;
                vertical-align : middle;
                max-width      : 100%;
                max-height     : 100%;
            }

        }

        .pic-preview-ft {
            opacity            : 1;
            text-align         : center;
            position           : absolute;
            width              : 100%;
            height             : 160px;
            left               : 0;
            bottom             : -76px;
            z-index            : 668;
            transition         : all .3s ease;
            -webkit-transition : all .3s ease;
            pointer-events     : none;
        }
        .pic-preview-ft.opa0 {
            opacity : 0;
        }
        .pic-preview-ft.unfold {
            bottom : 0;

        }
        .toolbar {
            margin           : 0 auto;
            width            : 182px;
            height           : 50px;
            border-radius    : 5px;
            background-color : #000;
            opacity          : .8;
            position         : relative;
            pointer-events   : auto;
            padding          : 5px 15px;
        }
        .icons-holder {
            font-size : 0;
            height    : 100%;
            span {
                color        : #fff;
                font-size    : 22px;
                height       : 100%;
                display      : inline-block;
                width        : 44px;
                margin-right : 10px;
                cursor       : pointer;
                line-height  : 40px;
                &:hover {
                    opacity       : .8;
                    background    : rgba(255, 255, 255, .1);
                    border-radius : 2px;
                }
            }
            .el-icon-zoom-out {
                margin-right : 0
            }
            .lookorigin {
                margin-right   : 0;
                font-size      : 14px;
                vertical-align : top;
                position       : relative;
                &:before {
                    content     : '';
                    position    : absolute;
                    border-left : 1px solid rgba(255, 255, 255, .2);
                    top         : 6px;
                    bottom      : 6px;
                    left        : 0;
                }
            }
            .origined {
                opacity : .5 !important;
                cursor  : not-allowed;
            }
        }
        .small-pic-list-wrap {
            position       : absolute;
            left           : 0;
            right          : 0;
            bottom         : 0;
            z-index        : 669;
            background     : rgba(0, 0, 0, .85);
            text-align     : center;
            pointer-events : auto;
        }

        .small-pic-list-toggle {
            position      : absolute;
            width         : 48px;
            height        : 15px;
            top           : -15px;
            left          : 50%;
            margin        : 0 0 0 -24px;
            border-radius : 2px 2px 0 0;
            background    : rgba(0, 0, 0, .7);
            cursor        : pointer;

            i {
                color : #fff;
            }
        }
        .small-pic-list-con {
            position : relative;
            display  : inline-block;
            height   : 73px;
            padding  : 13px 60px;
            .wrap {
                height   : 50px;
                overflow : hidden;
                .small-pic-list {
                    height      : 50px;
                    white-space : nowrap;
                    max-width   : 1242px;
                    transition  : all 0.2s ease 0s;
                    .small-pic-item {
                        position    : relative;
                        display     : inline-block;
                        width       : 50px;
                        height      : 50px;
                        margin-left : 4px;
                        overflow    : hidden;
                        cursor      : pointer;
                        &:hover {
                            .pic-mask {
                                display : none
                            }
                        }
                        .pic {
                            width               : 50px;
                            height              : 50px;
                            background-size     : cover;
                            background-repeat   : no-repeat;
                            background-position : center;
                        }

                        .pic-mask {
                            position           : absolute;
                            width              : 50px;
                            height             : 50px;
                            background         : #000;
                            opacity            : .4;
                            z-index            : 670;
                            left               : 0;
                            top                : 0;
                            -webkit-transition : all .3s ease;
                            transition         : all .3s ease;
                        }
                    }
                    .cur .pic-mask {
                        opacity : 0;
                    }
                    .small-pic-item.cur:after, .small-pic-item.cur:hover:after {
                        position : absolute;
                        content  : "";
                        left     : 0;
                        right    : 0;
                        top      : 0;
                        bottom   : 0;
                        border   : 2px solid #389cff;
                        z-index  : 1;
                    }
                    .small-pic-item:first-child {
                        margin-left : 0;
                    }
                }
            }

            .small-next, .small-pre {
                position   : absolute;
                width      : 30px;
                height     : 40px;
                top        : 50%;
                margin-top : -20px;
                text-align : center;
                cursor     : pointer;
                transition : all .3s ease;
                &:after {
                    content        : '';
                    height         : 100%;
                    display        : inline-block;
                    vertical-align : middle;
                }
                &:hover {
                    background    : rgba(255, 255, 255, .1);
                    border-radius : 2px;
                }

                i {
                    font-size      : 24px;
                    color          : #fff;
                    vertical-align : middle;
                }
            }
            .small-pre {
                left : 0
            }
            .small-next {
                right : 0;
            }
        }

    }


</style>

