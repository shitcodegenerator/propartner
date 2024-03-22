<script setup>
import { ref, onMounted, computed } from 'vue';
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


const eventName = computed(() => {
    if(event.value === 1) {
      return `113年3月9日台中場`
    }

    if(event.value === 2) {
      return `113年3月30日高雄場`
    }

    if(event.value === 3) {
      return `113年4月13日林口場`
    }
  })
  
  const note = computed(() => {
    if(event.value === 1) {
      return `備註:<br>
      得獎者請於當日公告時間內，攜帶有照證件至服務台領取獎品，逾期或資料錯誤，視同放棄得獎資格。`
    }

    if(event.value === 2) {
      return `備註:<br>
      得獎者請於當日公告時間內，攜帶有照證件至服務台領取獎品，逾期或資料錯誤，視同放棄得獎資格。`
    }

    if(event.value === 3) {
      return `備註:<br>
      得獎者請於當日公告時間內，攜帶有照證件至服務台領取獎品，逾期或資料錯誤，視同放棄得獎資格。`
    }
  })


onMounted(() => {
  if(route.query.event) {
    event.value = +route.query.event
    raw.value = !!route.query.raw
    getWinners()
  }
})




</script>

<template>
  <div class="bg min-h-screen  w-screen pt-[5vh] pb-[10vh] px-4">
    <h1 class="font-bold mb-4 text-2xl  text-blue-700">{{ eventName }}<br>
      葡眾珍鑽經理贈車表揚大會<br>得獎名單</h1>
      <p class="text-gray-500 bg-white p-4 border border-gray-300 mb-4 rounded" v-html="note"></p>
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
