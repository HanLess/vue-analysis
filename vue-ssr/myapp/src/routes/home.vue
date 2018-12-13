<template>
    <div>
          home
          <div @click="change">{{changeData}}</div>
          <div class="red">{{createdData}}</div>
          {{homeInfo}}
    </div>
</template>


<script>
export default {
    methods : {
        serverRequest(store) {
            return store.dispatch('getHomeInfo')
        },
        change(){
            this.changeData = "changed!!!!!!!!!"
        }
    },
    created(){
        // setTimeout(() => {
        //     this.createdData = "createdData changed!!!!!!!"
        // },1000)
        this.createdData = "createdData changed!!!!!!!"
    },
    data(){
        return {
            createdData: "init data",
            changeData : "this is home"
        }
    },
    mounted() {
        console.log(this.homeInfo)
    },
    computed: {
        homeInfo() {
            return this.$store.state.homeInfo
        }
    }
}
</script>


<style>
.red{
    color:red
}
</style>
