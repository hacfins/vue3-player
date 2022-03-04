<template>
    <div class="doc-pages-panel" @scroll="docScroll">
        <div id="docPages"  :style="{width:currWithPer+'%'}">
            <div :page="item"  class="docSrc" v-for=" item in totalCount" :style="{height:docSrcHeight+'px'}">
                <img @load="imgLoad" v-if="docPageList[item - 1]"  :src="docPageList[item -1].url" alt="" style="width:100%">
            </div>
            <div class="toolbar">
                <div class="icons-holder">
                    <span class="icon zoom-in" @click="zoomIn" :disabled="currWithPer == 100" title="放大"></span>
                    <span class="icon zoom-out" @click="zoomOut" title="缩小" :disabled="currWithPer == 25"></span>
                    <span class="icon full-screen" @click="fullScreen"  title="全屏"></span>
                </div>
            </div>
        </div>


    </div>
</template>

<script>
    export default {
        props  : {


        },
        data(){
            return {
                docPageList : [],
                pageList:[],
                scrollBind  : true,
                totalCount  : '',
                docSrcHeight: '',
                oldDocHeight: '',
                currWithPer : 50,
                bindTime:''
            }
        },
        computed:{


        },
        mounted(){



        },
        methods: {
            imgLoad(event){
                _removeAttr(event.target,'width height')
                if( this.docSrcHeight ){
                    return
                }
                this.oldDocHeight = event.target.offsetHeight
                this.docSrcHeight = event.target.offsetHeight


            },
            docScroll(event){
                if(!this.scrollBind){
                    return;
                }
                var that = this;
                var heightS = parseInt(event.target.scrollTop,10);
                var heightY = parseInt(event.target.clientHeight,10);
                var loadPage,curPage;
                if(heightS > 0){
                    var dom_arr = _dom(".docSrc");
                    for(var i = 0 ; i < dom_arr.length; i++){
                        if(dom_arr[i].offsetTop <= heightS + heightY){
                            loadPage = _attr(dom_arr[i],'page')
                        }

                        if(dom_arr[i].offsetTop <= heightS + heightY - (heightY / 2)){

                            curPage= parseInt(_attr(dom_arr[i],'page'),10)

                        }
                    }

                    that.$parent.currentPage = curPage
                }else{
                    loadPage = 1;
                    that.$parent.currentPage = 1
                }

                this.$emit('customscroll',loadPage)

            },
            loadOnePage(){
                var heightS = parseInt(_dom('.doc-pages-panel')[0].scrollTop,10);
                var heightY = parseInt(_dom('.doc-pages-panel')[0].clientHeight,10);


                var loadPages = [parseInt(this.$parent.currentPage,10) + 1,parseInt(this.$parent.currentPage,10) + 2]
                loadPages.forEach((item) => {
                    if(item > 1 && _dom('.docSrc[page="'+item+'"]').length > 0 && _dom('.docSrc[page="'+item+'"]')[0].offsetTop <= heightS + heightY){
                        if(!this.docPageList[item- 1]){
                            this.getDocPage(this.$parent.playSection,item)
                        }
                    }
                })
            },
            scrollToPage(page,isnotanimate){
                if(this.bindTime){
                    clearTimeout(this.bindTime)
                }
                this.scrollBind = false;
                if(_dom('.docSrc[page="'+page+'"]').length == 0){
                    return
                }
                var docscrollHeight = _offset('.docSrc[page="'+page+'"]').top- _offset('.doc-pages-panel ').top + _dom('.doc-pages-panel')[0].scrollTop;

                if(isnotanimate){
                    _dom('.doc-pages-panel')[0].scrollTop = docscrollHeight
                   this.bindTime = setTimeout(() => {
                        this.scrollBind = true;
                    },50)


                }else{

                    _scrollPosition('.doc-pages-panel',docscrollHeight,500, () => {
                        //文档资源页 下一页 上一页事件
                        this.bindTime = setTimeout(() => {
                            this.scrollBind = true;
                        },50);
                    })
                }



            },
            getDocPage(item,page,callback){
                if(this.pageList[page - 1]){
                    this.docPageList[page-1] = this.pageList[page - 1]
                    callback && callback(this.totalCount)
                    return
                }

                this.totalCount = item.play_info.list.length;

                item.play_info.list.forEach((imgitem,i) => {
                    this.pageList[i] = {url:imgitem}
                })
                this.docPageList[page-1] = this.pageList[page - 1]

                console.log(this.totalCount)
                callback && callback(this.totalCount)


            },
            zoomIn(){
                this.scrollBind = false;
                this.currWithPer += 5;
                if(this.currWithPer >= 100){
                    this.currWithPer = 100
                }
                this.$nextTick(() => {
                    this.docSrcHeight = _find(_dom('.docSrc')[0],'img')[0].offsetHeight;
                    this.$nextTick(() => {
                        this.scrollToPage(this.$parent.currentPage,true)
                    })

                })


            },
            zoomOut(){
                this.scrollBind = false;
                this.currWithPer -= 5;
                if(this.currWithPer <= 25){
                    this.currWithPer = 25;

                }
                this.$nextTick(() => {
                    this.docSrcHeight = _find(_dom('.docSrc')[0],'img')[0].offsetHeight;
                    this.$nextTick(() => {
                        this.scrollToPage(this.$parent.currentPage,true)
                        this.loadOnePage()
                    })


                })
            },
            fullScreen(){
                var element = _dom('.preview-wrap')[0] || _dom('.doc-play')[0]
                if(element.requestFullscreen) {
                    element.requestFullscreen();
                } else if(element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if(element.webkitRequestFullscreen) {
                    element.webkitRequestFullscreen();
                } else if(element.msRequestFullscreen) {
                    element.msRequestFullscreen();
                }


            },
            reset(){
                this.docPageList = [];
                this.pageList = [];
                this.scrollBind  = true;
                this.totalCount  = '';
                this.docSrcHeight= '';
                this.oldDocHeight= '';
                this.currWithPer = 50;
            }

        },

    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .doc-pages-panel {
        width: 100%;
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        #docPages {
            margin: 0 auto;
            min-height: 0;
            width: 50%;
            &:hover{
                .toolbar{
                    opacity: .8;
                }
            }
           .docSrc {
                display: block;
                width: 100%;
                margin-bottom: 10px;
               img{
                   display:block;
               }
            }
        }
        .toolbar {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 40px;
            margin: 0 auto;
            width: 182px;
            height: 50px;
            border-radius: 5px;
            background-color: #000;
            opacity: 0;
            transition:opacity .3s;
            z-index:2001;
            padding:5px 15px;
        }
        .icons-holder {
            height:100%;
            font-size:0
        }
        .icon {
            display: inline-block;
            cursor: pointer;
            opacity: 1;
            width: 44px;
            margin-right:10px;
            height: 100%;
            text-align: center;


            &:before{
                content:'';
                display: inline-block;
                width:32px;
                height:32px;
                background: url(~assets/previewsprite.png) 0 0 no-repeat;
                margin-top:4px;

            }
        }
        .icon:not([disabled=true]){
            &:hover{
                opacity: .8;
                background:rgba(255,255,255,.1);
                border-radius:2px;
            }
        }
        .icon:last-child{
            margin-right:0;
        }
        .icon[disabled=true]{
            cursor:not-allowed;
            opacity: .5;
        }
        .icon.zoom-in:before {
            background-position: 3px -134px;
        }
        .icon.zoom-out:before{
            background-position: 3px -161px;
        }
        .icon.full-screen:before{
            background-position: 3px -188px;
        }
    }

</style>

