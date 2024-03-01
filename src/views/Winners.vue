<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import { useRoute } from 'vue-router';

const event = ref(1)
const raw = ref(false)


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
  console.log(name, name.length)
  if (name.length <= 2) {
    return name[0] + '*';
  } else {
    return name[0] + '*' + name[name.length - 1];
  }
}

const route = useRoute()


onMounted(() => {
  if(route.query.event) {
    event.value = +route.query.event
    raw.value = !!route.query.raw
    getWinners()
  }
})




</script>

<template>
  <div class="bg min-h-screen  w-screen py-[10vh] px-4">
    <h1 class="font-bold mb-4 text-3xl underline text-black">{{ event === 1 ? '台中' : event === 2 ? '高雄' : '林口' }}場得獎名單</h1>
    
    <div class="grid grid-cols-3 gap-4">
      <div v-for="i in winners" class="flex flex-col text-black">
        <span class="font-bold text-xl">{{raw ? i.name :  maskName(i.name) }}</span>
        <span>{{ raw ? i.userId : maskTWID(i.userId) }}</span>
        <span v-if="raw">{{ i.mobile }}</span>
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
