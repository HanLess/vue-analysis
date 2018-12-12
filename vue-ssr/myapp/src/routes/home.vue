<template>
    <div>
          home
          {{homeInfo}}
    </div>
</template>


<script>
export default {
    serverRequest(store) {
            return store.dispatch('getHomeInfo')
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


<style scoped>

</style>
