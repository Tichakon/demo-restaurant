<template>
  <main class="d-flex flex-nowrap" style="">
    <div id="map" ref="map"></div>
    <div
      class="d-flex flex-column align-items-stretch bg-body-tertiary row col-sm-6"
    >
      <div class="list-group list-group-flush border-bottom scrollarea p-10">
        <a
          v-for="(restaurant, index) in restaurants"
          :key="index"
          href="#"
          class="list-group-item list-group-item-action py-3 lh-sm"
          :class="{ active: restaurant.isActive == true }"
          @click="handleClick(index)"
        >
          <div class="d-flex w-100 align-items-center justify-content-between">
            <strong class="mb-1">{{ restaurant.name }}</strong>
          </div>
          <div class="col-10 mb-1 small">ที่อยู่: {{ restaurant.address }}</div>
        </a>
      </div>
    </div>
  </main>
</template>

<script>
// สร้างแผนที่และ Mark จุดบนแผนที่
import { Marker } from '../utils/index'

export default {
  name: 'NuxtMain',
  computed: {
    // ไปดูรายละเอียดที่ store/index.js
    searchText() {
      return this.$store.state.searchText
    },
    restaurants() {
      return this.$store.state.restaurants
    },
    indexActive() {
      return this.$store.state.indexActive
    },
  },

  async mounted() {
    // เปิดหน้า Loading ขึ้นมา เพื่อมากันเวลา User จะทำอะไร
    await this.$store.commit('loading/toggleLoading')

    // ยิง API หาร้านอาหาร
    // Method POST
    // name = คำค้นหา
    const res = await this.$store.dispatch('fetchPlace', {
      name: 'Bang Sue',
    })

    // เช็คว่า API มีการ Error รึเปล่า โดยถ้า err เป็น 0 ก็คือไม่มีการ Error เกิดขึ้น แต่ถ้าเป็นเลขอื่นคือ Error หมด
    if (res.err === 0) {
      // เลือกผลลัพธ์ที่เราต้องการจากการยิง API และเพิ่ม isAcitive เพื่อบอกว่าตอนนี้คลิกที่ร้านอาหารร้านไหนอยู่
      // List จะประกอบด้วย
      // name = ชื่อร้านอาหาร
      // address = สถานที่ของร้านอาหาร
      // location = ละติจูด ลองติจูด เพื่อเอาไปใส่บนแผนที่
      // isActive = สถานะเลือกร้านอาหาร ถ้าเป็น true แสดงว่าเลือกร้านนี้อยู่ ถ้าเป็น false แสดงว่าไม่ได้เลือก
      const list = []

      for (let i = 0; i < res.data.results.length; i++) {
        const result = res.data.results[i]
        list.push({
          name: result.name,
          address: result.formatted_address,
          location: result.geometry.location,
          isActive: false,
        })
      }

      // เช็คว่ามีข้อมูลส่งมารึเปล่า
      if (list.length > 0) {
        // เลือกร้านที่ 1
        list[0].isActive = true

        // เซ็ตและส่งผลลัพธ์ไปยัง store เพื่อส่งไปยัง Component อื่น
        await this.$store.commit('setRestaurants', list)

        // ทำการสร้างแผนที่และ Mark จุด
        Marker(
          this.restaurants[this.indexActive].name,
          this.restaurants[this.indexActive].location
        )
      }
    } else {
      alert('Network Error')
    }

    // ปิดหน้า Loading
    await this.$store.commit('loading/toggleLoading')
  },
  methods: {
    // คลิกเลือกร้าน
    handleClick(index) {
      // เซ็ตสถานะเลือกร้านค้า ส่งไปที่ store/index.js
      this.$store.commit('toggleRestaurants', {
        from: this.indexActive,
        to: index,
      })

      // เซ็ตลำดับที่คลิก ส่งไปที่ store/index.js
      this.$store.commit('setIndexActive', index)

      // ทำการสร้างแผนที่และ Mark จุด
      Marker(
        this.restaurants[this.indexActive].name,
        this.restaurants[this.indexActive].location
      )
    },
  },
}
</script>

<style></style>
