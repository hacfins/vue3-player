<template>
    <div class="doc-play">
        <div class="preview-hd">
            <div class="preview-page">
                <div class="arrow pre-page" :disabled="currentPage == 1"  title="上一页" @click="prePage"></div>
                <div class="current-page">
                    <input type="text" name="current-page" v-model="currentPage" @input="correctVal" @keyup.enter="skipPage">
                </div>
                <div class="vertical-line"></div>
                <div class="total-page"><em class="total-page-count">{{totalCount}}</em> <em>页</em></div>
                <div class="arrow next-page" title="下一页" @click="nextPage" :disabled="currentPage == totalCount"></div>
            </div>
        </div>
        <pre-doc
            ref="doc"
            @customscroll="scroll"
        ></pre-doc>
    </div>

</template>

<script>
    import preDoc from 'components/preview-doc'
    export default {
        props:{
            playSection:{
                type:Object,
                default:null
            }
        },
        data(){
            return {
                currentPage:1,
                oldPage:'',
                totalCount:'',
                is_running:false,
                check_run_time:''
            }
        },
        computed  : {

        },
        components: {
            preDoc

        },
        mounted(){


            var that = this;
            window.onresize = function() {
                if(that.playSection.f_type == 3 && that.playSection.f_type == 31 || that.playSection.f_type == 32 || that.playSection.f_type == 33){
                    that.$refs.doc.docSrcHeight = _find(_dom('.docSrc')[0],'img')[0].offsetHeight;
                    that.$nextTick(() => {
                        that.$refs.doc.scrollToPage(that.currentPage)
                    })
                }
            }

        },
        methods   : {
            scroll(page){
                if(!this.$refs.doc.docPageList[page - 1] && this.oldPage != page){
                    this.oldPage = page
                    this.$refs.doc.getDocPage(this.playSection,page)
                }

            },
            prePage(){
                if(this.currentPage == 1){
                    return;
                }
                this.currentPage--;

                this.skipPage()


            },
            nextPage(){
                if(this.currentPage == this.totalCount){
                    return;
                }
                this.currentPage++;
                this.skipPage()
            },
            correctVal(){
                if(this.currentPage){
                    if(!/^\d+$/.test(this.currentPage)){
                        this.currentPage = 1;
                    }
                }

            },
            skipPage(){
                if(!/^\d+$/.test(this.currentPage)){
                    this.currentPage = 1;
                }
                if(parseInt(this.currentPage,10) < 1){
                    this.currentPage = 1;
                }
                if(parseInt(this.currentPage,10) > parseInt(this.totalCount,10)){
                    this.currentPage = this.totalCount;
                }
                if( this.$refs.doc.docPageList[this.currentPage - 1]){
                    this.$refs.doc.scrollToPage(this.currentPage)
                }else{
                    this.$refs.doc.getDocPage(this.playSection,this.currentPage,() => {
                        this.$nextTick(() => {
                            this.$refs.doc.scrollToPage(this.currentPage)
                        })
                    })
                }


            },
            reset(){
                this.$refs.doc.reset();
                this.currentPage = 1;
                this.oldPage = '';
                this.totalCount = '';
            },
            initPlay(){
                var val = this.playSection
                if(this.check_run_time){
                    clearInterval(this.check_run_time)
                }
                if(!this.is_running){
                    this.is_running = true;
                    this.$refs.doc.getDocPage(val,1,(count) => {
                        if(count){
                            this.totalCount = count;
                        }
                        this.is_running = false;

                })
                }else {
                    this.check_run_time = setInterval(() => {
                            if(!this.is_running){
                        clearInterval(this.check_run_time)
                        this.is_running = true;
                        this.$refs.doc.getDocPage(val,1,(count) => {
                            this.totalCount = count;
                        this.is_running = false;
                    })
                    }
                },100)
                }
                document.documentElement.off('keydown')
                document.documentElement.on('keydown',(event) => {
                    if(event.target.tagName != 'INPUT' && event.target.tagName != 'TEXTAREA' && (event.keyCode == 40 || event.keyCode == 38)){
                    event.preventDefault();
                }
            })
                document.documentElement.off('keyup')
                document.documentElement.on('keyup',(event) => {
                    if(event.target.tagName != 'INPUT' && event.target.tagName != 'TEXTAREA'){
                    if(event.keyCode == 40){
                        this.nextPage()

                    }else if(event.keyCode == 38){
                        this.prePage()
                    }
                }
            })
            }


        },
        watch     : {

        }
    }
</script>


<style lang="scss" rel="stylesheet/scss">
    .doc-play{
        height:100%;
        width:100%;
        .preview-hd{
            height: 62px;
            width: 100%;
            font-size: 14px;
            position: relative;
            z-index: 46;
            background: #000;
            opacity: .8;
            color: #fff;
            padding: 0 24px;
            .preview-title{
                width:calc(50% - 85px);
                float:left;
                height:100%;
                line-height: 62px;
            }
            .preview-page{
                display: inline-block;
                height: 28px;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%,-50%);
                -o-transform: translate(-50%,-50%);
                -ms-transform: translate(-50%,-50%);
                -moz-transform: translate(-50%,-50%);
                -webkit-transform: translate(-50%,-50%);
                div{
                    display: inline-block;
                    float: left;
                    margin-right: 10px;
                }
                .arrow{
                    height: 28px;
                    width: 28px;
                    cursor: pointer;
                    opacity: 1;
                    background: url(~assets/previewsprite.png) 0 0 no-repeat;
                    &:hover{
                        opacity: .8;
                    }
                }
                .arrow.pre-page {
                    background-position: 0 -3px;
                }
                .arrow.next-page {
                    background-position: 0px -31px;
                    margin-right:0;
                }
                .arrow[disabled=true]{
                    cursor:not-allowed;
                    opacity:.5!important;
                }
                .vertical-line {
                    height: 15px;
                    margin-top: 7px;
                    width: 0;
                    border-left: 1px solid #fff;

                }
                .current-page {
                    width: 32px;
                    height: 24px;
                    text-align: right;
                    line-height: 24px;
                    background-color: #fff;
                    margin-top: 2px;
                }
                .current-page input {
                    float: left;
                    outline: 0;
                    padding: 0;
                    line-height: 24px;
                    width: 32px;
                    height: 100%;
                    border: 0;
                    background-color: rgba(0,0,0,0);
                    text-align: center;
                    font-size: 15px;
                    color: #000;
                }
                .total-page {
                    height: 28px;
                    line-height: 28px;
                }
            }
            .preview-operation{
                float:right;
                margin-top:14px;
                .closeBtn-wrap{
                    float:left;
                    margin-left:15px;
                    cursor:pointer;
                    .el-icon-close{
                        font-size:32px;
                        &:hover{
                            background:#2f2f2f;
                        }
                    }
                }

            }
        }
        .doc-pages-panel{
            height:calc(100% - 62px);
        }
        .doc-pages-panel #docPages .docSrc img{
            border:1px solid #ddd
        }
    }
    :-webkit-full-screen{
        .doc-pages-panel{
            height:100%;
        }
    }
    :-moz-full-screen{
        .doc-pages-panel{
            height:100%;
        }
    }
    :-webkit-full-screen {
        width : 100%;
    }

    :-moz-full-screen {
        width : 100%;
    }

    :-webkit-full-screen .preview-hd{
        display:none

    }
    :-moz-full-screen .preview-hd{
        display:none
    }
    :-webkit-full-screen .preview-bd{
        height : 100vh;

    }
    :-moz-full-screen .preview-bd{
        height : 100vh;
    }
    :-webkit-full-screen .toolbar{
        display:none

    }
    :-moz-full-screen .toolbar{
        display:none
    }


</style>
