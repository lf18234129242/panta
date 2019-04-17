<template>
    <div class="Feedback">
        <van-nav-bar title="反馈建议"></van-nav-bar>
        <textarea name="textarea" maxlength="150" v-model="textarea_value"></textarea>
        <van-button
            type="info"
            size="large"
            :disabled = "disabled_button"
            @click="submit_feedback"
        >提交评价</van-button>
    </div>
</template>

<script>
import url from '@/serviceAPI.config.js'
import mdFive from '@/md5.js'
import {Toast} from 'vant'
    export default {
        data() {
            return {
                disabled_button: false,
                textarea_value:'',
                access_token : this.$md5(mdFive.prefix_str + mdFive.access_date + mdFive.api_key),
            }
        },
        methods: {
            submit_feedback() {
                this.disabled_button = true;
                this.axios.post(url.addFeedback,{
                    access_token:this.access_token,
                    content:this.textarea_value
                }).then(res => {
                    console.log(res)
                    if(res.data.code == 0){
                        Toast(`提交成功！`)
                        this.$router.go(-1)
                    }
                }).catch(err => {
                    console.log(err)
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
.Feedback{
    position: absolute;
    width: 100%;
    textarea{
        width:21rem;
        height:5.8rem;
        background:rgba(255,255,255,1);
        box-shadow:0px 6px 8px 0px rgba(96,100,112,0.1);
        border-radius:.4rem;
        border:2px solid rgba(206,208,210,1);
        display: block;
        margin: 1.5rem auto 2rem;
        padding: 0.3rem;
        box-sizing: border-box;
    }
    .van-button--large{
        width:21rem;
        height:3.2rem;
        background:rgba(50,119,216,1);
        border-radius:0.4rem;
        margin: 1rem auto 2rem;
        display: block;
        line-height: 0;
    }
}
</style>