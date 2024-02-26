<script setup>
import { ref, onMounted, computed} from 'vue';
import prologo from '../assets/prologo.png'
import title from '../assets/title.png'
import { ElMessage } from 'element-plus';
import axios from 'axios';
import { useRoute } from 'vue-router';
import QRCodeVue3 from "qrcode-vue3";

const event = ref(1)
const winners = ref(
  [
    {
        "_id": "65db7c21506f2c23d3416eca",
        "name": "雪莉懂",
        "userId": "N123456798",
        "event": 1
    },
    {
        "_id": "65db7c12506f2c23d3416eb8",
        "name": "雪莉",
        "userId": "N123456792",
        "event": 1
    },
    {
        "_id": "65db7c1c506f2c23d3416ec7",
        "name": "雪莉",
        "userId": "N123456797",
        "event": 1,

    },
    {
        "_id": "65db7c17506f2c23d3416ec1",
        "name": "雪莉",
        "userId": "N123456795",
        "event": 1
    },
    {
        "_id": "65db7c24506f2c23d3416ecd",
        "name": "雪莉懂",
        "userId": "N123456799",
        "event": 1
    },
    {
        "_id": "65db7c21506f2c23d3416eca",
        "name": "雪莉懂",
        "userId": "N123456798",
        "event": 1
    },
    {
        "_id": "65db7c12506f2c23d3416eb8",
        "name": "雪莉",
        "userId": "N123456792",
        "event": 1
    },
    {
        "_id": "65db7c1c506f2c23d3416ec7",
        "name": "雪莉",
        "userId": "N123456797",
        "event": 1,

    },
    {
        "_id": "65db7c17506f2c23d3416ec1",
        "name": "雪莉",
        "userId": "N123456795",
        "event": 1
    },
    {
        "_id": "65db7c24506f2c23d3416ecd",
        "name": "雪莉懂",
        "userId": "N123456799",
        "event": 1
    },
    {
        "_id": "65db7c21506f2c23d3416eca",
        "name": "雪莉懂",
        "userId": "N123456798",
        "event": 1
    },
    {
        "_id": "65db7c12506f2c23d3416eb8",
        "name": "雪莉",
        "userId": "N123456792",
        "event": 1
    },
    {
        "_id": "65db7c1c506f2c23d3416ec7",
        "name": "雪莉",
        "userId": "N123456797",
        "event": 1,

    },
    {
        "_id": "65db7c17506f2c23d3416ec1",
        "name": "雪莉",
        "userId": "N123456795",
        "event": 1
    },
    {
        "_id": "65db7c24506f2c23d3416ecd",
        "name": "雪莉懂",
        "userId": "N123456799",
        "event": 1
    },
    {
        "_id": "65db7c21506f2c23d3416eca",
        "name": "雪莉懂",
        "userId": "N123456798",
        "event": 1
    },
    {
        "_id": "65db7c12506f2c23d3416eb8",
        "name": "雪莉",
        "userId": "N123456792",
        "event": 1
    },
    {
        "_id": "65db7c1c506f2c23d3416ec7",
        "name": "雪莉",
        "userId": "N123456797",
        "event": 1,

    },
    {
        "_id": "65db7c17506f2c23d3416ec1",
        "name": "雪莉",
        "userId": "N123456795",
        "event": 1
    },
    {
        "_id": "65db7c24506f2c23d3416ecd",
        "name": "雪莉懂",
        "userId": "N123456799",
        "event": 1
    },
    {
        "_id": "65db7c21506f2c23d3416eca",
        "name": "雪莉懂",
        "userId": "N123456798",
        "event": 1
    },
    {
        "_id": "65db7c12506f2c23d3416eb8",
        "name": "雪莉",
        "userId": "N123456792",
        "event": 1
    },
    {
        "_id": "65db7c1c506f2c23d3416ec7",
        "name": "雪莉",
        "userId": "N123456797",
        "event": 1,

    },
    {
        "_id": "65db7c17506f2c23d3416ec1",
        "name": "雪莉",
        "userId": "N123456795",
        "event": 1
    },
    {
        "_id": "65db7c24506f2c23d3416ecd",
        "name": "雪莉懂",
        "userId": "N123456799",
        "event": 1
    },
]
)

const visibleWinners = ref([])
const isFinished = ref(false)

const reset = () => {
  axios.get(`https://propartnerbe.vercel.app/reset?event=${event.value}`)
}

const lottery = async () => {
  try {
    visibleWinners.value = []
    isFinished.value = false
    const { data } = await axios.get(`https://propartnerbe.vercel.app/lottery?event=${event.value}&size=${size.value}`)
    winners.value = data.winners
    isFinished.value = true
    step.value++
    showWinners()
    ElMessage.success('開始抽獎')
  } catch(err) {
    ElMessage.error(err?.response?.data?.message ??'抽獎失敗')
  }
}


function showWinners() {
  let index = 0;
  const intervalId = setInterval(() => {
    if (index < winners.value.length) {
      console.log(winners[index])
      visibleWinners.value.push(winners.value[index]);
      index++;
    } else {
      clearInterval(intervalId);
    }
  }, 300); // 每秒执行一次
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

const step = ref(0)



const route = useRoute()

const addKeyDown = () => {
  window.addEventListener('keydown', function(e){ 
    if (e.code !== 'Enter') return
   
    if(step.value === 0) {
      lottery()
      return
    }

    if(step.value === 1) {
      step.value ++
      return
    }

    if(step.value === 2) {
      step.value = 0
      isFinished.value = false
      return
    }
    
   }, false);
}

const href = computed(() => {
  console.log(location)
  return location?.origin
})

const size = ref(30)

onMounted(() => {
  addKeyDown()
  if(route.query.event) {
    event.value = +route.query.event
  }
})


</script>

<template>
  <div class="bg h-screen gap-10 flex flex-cols items-center justify-center">
      <div class="w-[50vw]">
        <div v-if="step === 1" class="grid grid-cols-5 gap-4">
          <div v-for="i in visibleWinners" class="flex flex-col">
            <span class="font-bold text-4xl">{{ maskName(i.name) }}</span>
            <span>{{ maskTWID(i.userId) }}</span>
          </div>
        </div>
        <img v-if="step === 0" :src="title" class="w-[50vw]"/>
        <div class="flex items-center justify-center" v-if="step === 2">
          <QRCodeVue3
            :width="580"
            :height="580"
            :value="`${href}/#/winners?event=${event}`"
            :qrOptions="{ typeNumber: 0, mode: 'Byte', errorCorrectionLevel: 'H' }"
            :imageOptions="{ hideBackgroundDots: true, imageSize: 0.4, margin: 0 }"
            :dotsOptions="{
              type: 'dots',
              color: '#26249a',
              gradient: {
                type: 'linear',
                rotation: 0,
                colorStops: [
                  { offset: 0, color: '#26249a' },
                  { offset: 1, color: '#26249a' },
                ],
              },
            }"
            :backgroundOptions="{ color: '#ffffff' }"
            :cornersSquareOptions="{ type: 'dot', color: '#000000' }"
            :cornersDotOptions="{ type: undefined, color: '#000000' }"
            fileExt="png"
            myclass="my-qur"
            imgclass="img-qr"
          />
      </div>
      </div>
      <div class="w-[40vw] flex justify-between gap-10 flex-col items-center">
        <img :src="prologo" class="w-[300px]"/>
       <div class="flex items-center flex-col gap-4">
        <el-select v-model="size" style="width: 100px; border-radius: 400px; overflow: hidden; font-size: 20px;">
          <el-option :value="30" label="30人">30人</el-option>
          <el-option :value="45" label="45人">45人</el-option>
        </el-select>
        <div v-if="step === 0" @click="lottery" class="w-[360px] cursor-pointer hover:scale-[1.05] hover:shadow-xl rounded-full  py-4 text-4xl font-bold bg-yellow-500 flex items-center justify-center text-white">開始抽獎</div>
        <div v-if="step === 2" class="font-bold text-5xl leading-loose">請掃描QRCODE<br>查看完整中獎名單</div>
        <div class="reset cursor-pointer" @click="reset">重置得獎者</div>
       </div>
      </div>
    </div>

    
</template>

<style scoped lang="scss">
.bg {
  @apply h-screen;
  background-image: url('../assets/probg.png');
  background-size: cover;
  background-position: center;
}
</style>
