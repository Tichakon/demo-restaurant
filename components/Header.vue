<template>
  <header
    class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow"
  >
    <a class="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6" href="#"
      >Tichaky Restaurant</a
    >
    <button
      class="navbar-toggler position-absolute d-md-none collapsed"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#sidebarMenu"
      aria-controls="sidebarMenu"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <input
      v-model="text"
      class="form-control form-control-dark w-100 rounded-0 border-0"
      type="text"
      placeholder="Search"
      aria-label="Search"
      @keyup.enter="search"
    />
    <div class="navbar-nav">
      <div class="nav-item text-nowrap">
        <a class="nav-link px-3" href="#" @click="search">ค้นหา</a>
      </div>
    </div>
  </header>
</template>

<script>
// สร้างแผนที่และ Mark จุดบนแผนที่
import { Marker } from '../utils/index'

export default {
  name: 'NuxtHeader',
  data() {
    return {
      text: '',
    }
  },
  computed: {
    // ไปดูรายละเอียดที่ store/index.js
    restaurants() {
      return this.$store.state.restaurants
    },
    indexActive() {
      return this.$store.state.indexActive
    },
  },
  methods: {
    async search() {
      // เปิดหน้า Loading ขึ้นมา เพื่อมากันเวลา User จะทำอะไร
      await this.$store.commit('loading/toggleLoading')

      // เซ็ตคำค้นหาเป็นคำที่พิมพ์มา (เพราะเดี๋ยวส่งไปให้ API จะทำการ Reset คำค้นหาใหม่)
      await this.$store.commit('setSearchText', this.text)

      // ยิง API หาร้านอาหาร
      // Method POST
      // name = คำค้นหา
      const res = await this.$store.dispatch('fetchPlace', {
        name: this.text,
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

        // เลือกร้านที่ 1
        list[0].isActive = true

        // เซ็ตและส่งผลลัพธ์ไปยัง store เพื่อส่งไปยัง Component อื่น
        await this.$store.commit('setRestaurants', list)
        await this.$store.commit('setIndexActive', 0)

        // เคลียคำค้นหา
        this.text = ''

        // ทำการสร้างแผนที่และ Mark จุด
        Marker(
          this.restaurants[this.indexActive].name,
          this.restaurants[this.indexActive].location
        )
      } else {
        alert('Network Error')
      }

      // ปิดหน้า Loading
      await this.$store.commit('loading/toggleLoading')
    },
  },
}
</script>
