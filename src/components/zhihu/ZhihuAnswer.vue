<template>
  <div></div>
</template>

<script>
const KEY_WORD_TYPE = {
  default: {
    label: 'default',
    value: 'default'
  },
  recount: {
    label: 'recount',
    value: 'recount'
  },
  single_plus: {
    label: 'single_plus',
    value: 'single_plus'
  },
  social_weight: {
    label: 'social_weight',
    value: 'social_weight'
  }
}
// const KEY_WORD_TYPE = [
//   {
//     'label': 'default',
//     'value': 'default'
//   },
//   {
//     'label': 'recount',
//     'value': 'recount'
//   },
//   {
//     'label': 'single_plus',
//     'value': 'single_plus'
//   },
//   {
//     'label': 'weight_by_socialization',
//     'value': 'weight_by_socialization'
//   }
// ]

export default {
  name: 'zhihu-answer',
  data () {
    return {
      KEY_WORD_TYPE
    }
  },
  mounted () {
    this.$axios.post('http://localhost:8081/zhihu-answer', {
      keyword_type: this.KEY_WORD_TYPE.default
    })
      .then(resp => {
        console.log(JSON.stringify(resp.data))
      })
  }
}
</script>

<style scoped>

</style>
