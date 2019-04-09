<template>
    <div>
        {{loading}}
    </div>
</template>

<script>
import url from '@/serviceAPI.config.js'
import mdFive from '@/md5.js'
import {Toast} from 'vant'
    export default {
        name:'author',
        data() {
            return {
                loading: '正在登录...',
                access_token : this.$md5(mdFive.prefix_str + mdFive.access_date + mdFive.api_key),
            }
        },
        created(){
            
        },
    }
</script>

<style scoped lang="scss">

</style>