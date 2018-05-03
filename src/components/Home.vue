<template>
  <el-container id="home-container">
    <app-header></app-header>
    <div id="page-container">
      <transition mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
  </el-container>
</template>

<script>
import AppHeader from './AppHeader'

export default {
  name: 'HelloWorld',
  components: {
    AppHeader
  },
  data () {
    return {
    }
  },
  methods: {
  },
  mounted () {
    // this.$axios.post('http://localhost:8081', {
    //   test: 'just for test'
    // })
    //   .then(resp => {
    //     console.log(JSON.stringify(resp.data))
    //   })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  #home-container {
    width: 980px;
    display: flex;
    flex-direction: column;
    margin-top: 0;
  }
</style>
