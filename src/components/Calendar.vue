<template>
    <div class="Calendar">
        <h2 :class="['carplate', carplate_num.length == 7 ? 'bg-blue' : 'bg-green']">{{carplate_num}}</h2>
        <DatePicker
            type="date"
            :options="options"
            placeholder="Select date"
            :open=true
            placement="left"
            :multiple=true
        ></DatePicker>
    </div>
</template>

<script>
import 'iview/dist/styles/iview.css';
    export default {
        data() {
            return {
                options: {
                    disabledDate (date) {
                        return date && date.valueOf() < Date.now() - 86400000;
                    }
                },
                carplate_num:'沪A888888',
            }
        },
        created(){

        },
        methods: {
            name() {
                
            }
        },
    }
</script>

<style lang="scss" scoped>
.Calendar{
    width: 100%;
    position: absolute;
    .carplate{
        width: 100%;
        height: 3rem;
        line-height: 2rem;
        font-size: 1.5rem;
        font-weight: bold;
        color: #fff;
        text-align: center;
        
        padding: 0.5rem;
    }
    .bg-blue{
        background: #3277D8;
    }
    .bg-green{
        background: #55C15B;
    }
}
</style>
<style lang="scss">
.ivu-select-dropdown{
    position: absolute;
    left: 0!important;
    top: 3rem!important;
    margin: 0;
    // width: 100%!important;
}
</style>
