# vue3-player
播放器组件，可以播放video、audio、picture、doc等

## Demo效果
###
![Image text](https://github.com/hacfins/vue3-player/raw/master/src/assets/demo.gif)

## player.vue

``` vue
<template>
   <player :params="params"></player>

</template>

<script>
import player from 'components/player'
export default {
    data(){
        return{
            //参数
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
    watch:{
      
    }
}
</script>

<style lang="scss" rel="stylesheet/scss">
   
</style>

```

## Components

### player

#### Props

* `params {Object}`

    Default:
    ```js
    {
     video:{
       is_fill:false
      },
     section_list : []
    }
    ```

#### 组件props解释

##### treeParams字段

| 字段            | 类型    | 必填 | 描述     |
| --------------- | ------- | ---- | -------- |
| video           | Object  | 否   | 视频配置 |
| section_list    | Array   | 是   | 课时列表 |

##### section_list字段

| 字段            | 类型    | 必填 | 描述     |
| --------------- | ------- | ---- | ---------|
| lesson_name     | String  | 否   | 课时名称 |
| lesson_id       | String  | 否   | 课时id   |
| f_type          | String  | 否   | 课时类型 |

##### video字段

| 字段            | 类型    | 必填 | 描述         |
| --------------- | ------- | ---- | ------------ |
| is_fill        | Boolean  | 否   | 视频填充模式 |

## Development

``` bash
# install dependencies
npm install
# serve with hot reload at localhost:3001
npm run serve
# build for production with minification
npm run build
```


