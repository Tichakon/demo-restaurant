<template>
  <div v-if="loading" class="loading-page">
    <p>Loading...</p>
  </div>
</template>

<script>
export default {
  computed: {
    // ไปดูรายละเอียดที่ store/loading.js
    loading() {
      return this.$store.state.loading.loading
    },
  },
}
</script>

<style></style>
