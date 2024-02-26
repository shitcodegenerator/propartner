<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import { useRoute } from 'vue-router';

const event = ref(1)


const winners = ref([])

const getWinners = async () => {
  try {
    const { data } = await axios.get(`https://propartnerbe.vercel.app/getWinners?event=${event.value}`)
    winners.value = data.winners
  } catch(err) {
    ElMessage.error(err?.response?.data?.message ??'取得失敗')
  }
}


function maskTWID(twid) {
  if (twid.length !== 10 || !/[A-Z][0-9]{9}/.test(twid)) {
    return '身分證字號錯誤';
  }
  
  return twid.replace(/(?<=^[A-Z]\d{3})\d{3}(?=\d{3}$)/, '***');
}
function maskName(name) {
  if (name.length <= 2) {
    return name[0] + '*'.repeat(name.length - 1);
  } else {
    return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
  }
}



const route = useRoute()


onMounted(() => {
  if(route.query.event) {
    event.value = +route.query.event
    getWinners()
  }
})


</script>

<template>
  <div class="bg min-h-screen  w-screen pt-[10vh] px-4">
    <h1 class="font-bold mb-4 text-3xl underline text-black">第 {{ event }} 場次得獎名單</h1>
    <div class="grid grid-cols-3 gap-4">
      <div v-for="i in winners" class="flex flex-col text-black">
        <span class="font-bold text-xl">{{ maskName(i.name) }}</span>
        <span>{{ maskTWID(i.userId) }}</span>
    </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.bg {
  background-color: #ffffff;
opacity: 0.8;
background-image:  linear-gradient(#fcf4c0 1px, transparent 1px), linear-gradient(to right, #fcf4c0 1px, #ffffff 1px);
background-size: 20px 20px;
}
</style>
