<template>
    <div class="PageHeader">
        <header>
            <img :src="headerImg" alt="">
        </header>
        <h1>{{descriptionTitle}}</h1>
    </div>
</template>

<script>
    export default {
        props:{
            descriptionTitle:String,
            headerImg:String
        }
    }
</script>

<style scoped lang="scss">
.PageHeader{
    header{
        padding-top: 4rem;
        display: flex;
        justify-content: center;
        margin-bottom: 1.6rem;
        img{
            width: 12.8rem;
            height: 4rem;
        }
    }
    h1{
        font-size: 1.467rem;
        color: #323643;
        text-align: center;
        margin-bottom: 2rem;
    }
}
</style>