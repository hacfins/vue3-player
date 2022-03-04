<template>
  <div class="player"
       :class="{'player_bl':showBtnControl}"
       v-show="is_share ? audioOpen : true"
       :style="{'background-color': bgColor}">
    <div class="player-panel">
      <div class="player-panel-details">
        <div class="player-panel-title text-ellipsis" v-cloak :title="is_share ? curItem.share_name : curItem.name">
          {{is_share ? curItem.share_name : curItem.name}}
        </div>

        <div v-show="showBtnControl" class="audio-oper-btn-wrap">
          <span class="el-icon-close" @click="audioClose"></span>
        </div>
      </div>
    </div>
    <div class="player-controls" v-show="!ismin">
      <div class="player-buttons">
        <div v-show="showNext" class="player-btn">
          <span class="player-prev" @click="prev()">
            <i class="iconfont icon-circle" aria-hidden="true"></i>

            <i class="iconfont icon-skip_previous" aria-hidden="true"></i>

          </span>
        </div>
        <div class="player-btn">
          <span class="player-pause" @click="toggleStatus()">
            <i class="iconfont" :class="{'icon-play-circle':isPause,'icon-pause':!isPause}" aria-hidden="true"></i>
          </span>
        </div>
        <div v-show="showNext" class="player-btn">
          <span class="player-next" @click="next()">
             <i class="iconfont icon-circle" aria-hidden="true"></i>

             <i class="iconfont icon-baseline-skip_next-" aria-hidden="true"></i>
          </span>
        </div>
        <div class="player-panel-volume player-btn"  ref="volume-control">
          <div class="volume-button">
            <i class="iconfont" :class="{'icon-volume':volume,'icon-mute':!volume}" @click="noVolume()"></i>
          </div>
          <div class="volume-range">
            <el-slider :show-tooltip="false" v-model="volume" @input="volumeChange"></el-slider>
          </div>


        </div>
      </div>
      <div style="clear: both"></div>
      <div class="player-range">
        <el-slider :class="{'vishide':!currentAudioData.url}" v-model="current" @change="change"  @mousedown.native="mouseDown" :format-tooltip="formatTooltip" :min="0" :max="duration"></el-slider>
        <div class="player-panel-time" :class="{'vishide':!currentAudioData.url}">
          <span class="player-time-current pull-left">{{ time(current)}}</span>
          <span class="player-time-total pull-right">{{ time(duration)}}</span>
        </div>

      </div>
    </div>
    <audio :src="currentAudioData.url" id="player" :loop="loop" :autoPlay="autoPlay" @timeupdate="timeChange()"
           @loadeddata="getDuration()" @ended="audioEnd" @play="audioPlaying"
           ref="player">
    </audio>
  </div>
</template>

<script>
  export default {
    props: {
      autoPlay: {
        type: Boolean,
        default: false
      },
      repeat: {
        type: Boolean,
        default: true
      },
      loop: {
        type: Boolean,
        default: false
      },
      width: {
        type: String,
        default: '300'
      },
      initialVolume: {
        type: String,
        default: '60'
      },
      bgColor: {
        type: String,
        default: '#000000'
      },
      curItem:{
          type: Object,
          default:null
      },
      listData:{
            type: Array,
            default:[]
       },
      showNext:{
          type:Boolean,
          default:true

      },
        school_id:{
            type:String,
            default:''
        },
        showBtnControl:{
            type:Boolean,
            default:false
        }
    },
    data: function () {
      return {
        RANGE_WIDTH: 431,
        current: 0,
        duration: 0,
        oldVolume: 0,
        volume: parseInt(this.initialVolume),
        isPause: true,
        ismin:false,
        currentAudioData:'',
        errmsg:'',
          audioOpen:false,
      }
    },
    mounted: function () {

    },
    computed: {
        audioIndex(){
            var curIndex;
            this.listData.forEach((item,i) => {
                if(item.lesson_id == this.curItem.lesson_id){
                  curIndex = i;
                }
            })
            return curIndex
        }

    },
    methods: {
        audioPlaying(){
            this.isPause = false
        },
        audioClose(){
            this.reset();
            this.audioOpen = false;
        },
      currentAudio () {
          this.currentAudioData = {
              url:this.curItem.play_info.list[0]
          }
          this.$refs.player && this.$refs.player.load()
      },
      toggleStatus: function () {

        var player = this.$refs.player;
        this.isPause ? player.play() : player.pause();
        this.isPause = !this.isPause;
      },
      timeChange: function () {

        if(!this.$refs.player){
            return
        }

        this.current = this.$refs.player.currentTime;
        this.$emit('timeupdate',this.$refs.player.currentTime,this.$refs.player.duration)
      },
      getDuration: function () {
        this.duration = this.$refs.player.duration;
      },
      formatTooltip(val){
          if(isNaN(val)){
              val = 0
          }

          return this.$options.filters['time'](val)

      },
      change(val){
          if(!this.currentAudioData.url){
              this.$message.error('没有资源');
              return;
          }
          this.$refs.player.currentTime = val
          this.$refs.player.play()
          this.isPause = false;

      },
      mouseDown:function(event){

          if(!_hasClass(event.target,'el-slider')){
              this.$refs.player.pause()
              this.isPause = true;
          }

      },
      volumeChange:function(val){
        this.volume = val;
        this.$refs.player.volume = val / 100;
      },
      noVolume: function () {

        if (this.volume) {
          this.oldVolume = this.volume;
          this.volume = 0;
        } else {
          this.volume = this.oldVolume;
        }
        this.$refs.player.volume = this.volume / 100;
      },
      prev: function () {
          if(this.listData.length == 1 || this.listData.length == 0){
              this.$message.error('没有上一首')
              return;
          }
        if (this.audioIndex == 0) {
          if (this.repeat) {
              this.$parent.$parent.$parent.$parent.playSection = this.listData[this.listData.length - 1]
          }
        } else {
            this.$parent.$parent.$parent.$parent.playSection  = this.listData[this.audioIndex - 1]

        }
        this.isPause = false

      },
      next: function () {
          if(this.listData.length == 1 || this.listData.length == 0){
              this.$message.error('没有下一首')
              return;
          }
        if (this.audioIndex == this.listData.length - 1) {
          if (this.repeat) {
              this.$parent.$parent.$parent.$parent.playSection  = this.listData[0]

          }
        } else {
            this.$parent.$parent.$parent.$parent.playSection  = this.listData[this.audioIndex + 1]

        }
        this.isPause = false
      },
      reset(){
            this.$refs.player.pause()
            this.isPause = false;
            this.current = 0;
            this.duration = 0;
            this.oldVolume = 0;
            this.volume= parseInt(this.initialVolume);
            this.ismin = false;
            this.currentAudioData = ''
        },
      audioEnd(){
          this.isPause=true;
          this.$emit('end')
      },
        time(value){
            if(isNaN(value)){
                value = 0
            }
            var length = Math.floor(parseInt(value));
            var minute = Math.floor(value / 60);
            if (minute < 10) {
                minute = '0' + minute;
            }
            var second = length % 60;
            if (second < 10) {
                second = '0' + second;
            }
            return minute + ':' + second;
        }
    },
    filters: {
      time: function (value) {
          if(isNaN(value)){
              value = 0
          }
        var length = Math.floor(parseInt(value));
        var minute = Math.floor(value / 60);
        if (minute < 10) {
          minute = '0' + minute;
        }
        var second = length % 60;
        if (second < 10) {
          second = '0' + second;
        }
        return minute + ':' + second;
      }
    },
    watch:{
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">


  .text-ellipsis {
    overflow      : hidden;
    white-space   : nowrap;
    text-overflow : ellipsis;
  }

  [v-cloak] {
    display : none
  }
  .vishide{
    visibility: hidden;
  }

  .player {
    position:absolute;
    top:50%;
    left:50%;
    width:440px;
    height:174px;
    transform:translate(-50% ,-50%);
    z-index:52;
    border-radius : 3px;
    border:1px solid #2697eb;
  }
  .player_bl{
    position: fixed;
    bottom: 10px;
    left: 60px;
    top:auto;
    transform:translate(0% ,0%);

  }

  .player-panel {
    width         : 100%;
    height        : 45px;
    border-radius : 2px;
    position:relative;

    .audio-oper-btn-wrap{
      position:absolute;
      right:10px;
      top:10px;
      span{
        display:inline-block;
        padding:5px;
        cursor:pointer;
        color:#5f7094

      }
    }
  }
  .player-controls{
    padding:0 15px 15px 15px;
  }

  .player-btn {
    cursor     : pointer;
    margin: 0 15px;
    i{
      color: #3B8CFF;
    }

  }
  .player-btn span{
    display:block;
  }

  .player-prev {

    position:relative;
    i.icon-circle{
      font-size: 50px;
      color: #D3E4FD;
    }
    i.icon-skip_previous{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      font-size: 26px;
      color: #3B8CFF;
    }

  }

  .player-pause {
    i{
      font-size:60px;
      color:#3B8CFF
    }


  }

  .player-play {
    i{
      font-size:60px;
      color:#3B8CFF
    }
  }

  .player-next {
    position:relative;
    i.icon-circle{
      font-size: 50px;
      color: #D3E4FD;
    }
    i.icon-baseline-skip_next-{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      font-size: 26px;
      color: #3B8CFF;
    }
  }

  .player-buttons {
    display:flex;
    justify-content: center;
    align-items: center;
  }

  .player-panel-details {
    width         : 100%;
    height        : 100%;
    text-align:center;
    color:#333;
    padding: 0 64px;
    cursor: default;
  }

  .player-panel-volume {
    display:flex;
    align-items: center;
    margin-right:0;
    cursor:default;
    i{
      color:#3B8CFF;
      font-size: 20px;
      cursor:pointer;
    }
    .volume-button{
      width:25px;
    }
    .volume-range{
      width: 60px;
      margin-left: 5px;

    }
  }


  .player-panel-title {
    width       : 100%;
    height      : 45px;
    font-size   : 16px;
    line-height : 45px;
    color:#5E687E;
  }

  .player-panel-time {
    width  : 100%;
    overflow: hidden;
    font-size:10px;
    color:#424E67
  }

  .player-time-total {
    font-size      : 10px;
    vertical-align : text-bottom;
  }

  .backBlack {
    background-color : #000
  }
  .player-range{
    .el-slider__bar,.el-slider__runway{
      border-radius:0
    }
    .el-slider__runway{
      background:#EDF4FD
    }
    .el-slider__button{
      width: 2px;
      border-radius: 0;
      height: 12px;
    }
  }




</style>

