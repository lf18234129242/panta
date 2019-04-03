<template>
    <div class="ShadowBox">
        <div class="box">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                key: 'value'
            }
        },
    }
</script>

<style scoped lang="scss">
.ShadowBox{
    .box{
        width:22.333rem;
        background:rgba(255,255,255,1);
        box-shadow:0px 10px 40px 0px rgba(96,100,112,0.1);
        border-radius:.4rem;
        margin: 0 auto 1.6rem;
        padding: 1.467rem 1.333rem 1.067rem 1.333rem;
        box-sizing: border-box;
    }

}
</style>