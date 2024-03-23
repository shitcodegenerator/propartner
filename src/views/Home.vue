<script setup>
import { ref, onMounted, computed, onBeforeUnmount} from 'vue';
import prologo from '../assets/prologo.svg'
import title from '../assets/title.png'
import { ElMessage, ElLoading } from 'element-plus';
import axios from 'axios';
import { useRoute } from 'vue-router';
import QRCodeVue3 from "qrcode-vue3";
import QrcodeVue from 'qrcode.vue'
import screenfull from 'screenfull';


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
  const loading = ElLoading.service({
      lock: true,
      text: '抽獎中',
      customClass: 'spinner',
      background: 'rgba(0, 0, 0, 0.7)',
    })
  try {
    visibleWinners.value = []
    isFinished.value = false
    const { data } = await axios.get(`https://propartnerbe.vercel.app/lottery?event=${event.value}&size=${size.value}`)
    winners.value = data.winners
    isFinished.value = true
    step.value++
    showWinners()
    ElMessage.success('開始抽獎')
    loading.close()
  } catch(err) {
    ElMessage.error(err?.response?.data?.message ??'抽獎失敗')
    
  } finally {
    loading.close()
  }
}


function showWinners() {
  let index = 0;
  const intervalId = setInterval(() => {
    if (index < winners.value.length) {
      visibleWinners.value.push(winners.value[index]);
      index++;
    } else {
      clearInterval(intervalId);
    }
  }, 300); // 每秒执行一次
}

function maskTWID(twid) {
  if (twid.length !== 10 || !/[A-Z][0-9]{9}/.test(twid)) {
    return '身分證字號有誤';
  }
  
  return twid.replace(/(?<=^[A-Z]\d{3})\d{3}(?=\d{3}$)/, '***');
}
function maskName(name) {
  if (name.length <= 2) {
    return name[0] + '*';
  } else {
    return name[0] + '*' + name[name.length - 1];
  }
}

const step = ref(0)



const route = useRoute()
const enterEvent = (e) => {
  if (e.code !== 'Enter') return
   
    if(step.value === 0) {
      lottery()
      return
    }

    if(step.value === 1) {
      step.value = 0
      isFinished.value = false
      return
    }
}

const keysPressed = {};

// 特定函數，當同時按下空白鍵和 Enter 鍵時觸發
function triggerFunction() {
  console.log('空白鍵和 Enter 鍵被同時按下！');
  if(step.value === 0) {
      lottery()
      return
    }

    if(step.value === 1) {
      step.value = 0
      isFinished.value = false
      return
    }
}

// 監聽鍵盤按下事件
document.addEventListener('keydown', (event) => {
  // 將按下的鍵設置為 true
  keysPressed[event.key] = true;

  // 檢查是否同時按下空白鍵（Space）和 Enter 鍵
  if (keysPressed['s'] && keysPressed['Enter']) {
    triggerFunction();
  }
});

// 監聽鍵盤釋放事件
document.addEventListener('keyup', (event) => {
  // 將釋放的鍵設置為 false
  keysPressed[event.key] = false;
});

const addKeyDown = () => {
  window.addEventListener('keydown', enterEvent, false);
}

const href = computed(() => {
  console.log(location)
  return location?.origin
})

const size = ref(30)

const spaceEvent = (e) => {
  if (e.code !== 'Space') return
    screenfull.request();
}

const fullScreen = () => {
  window.addEventListener('keydown', spaceEvent, false);
}

const time = ref('')
onMounted(async() => {
  // addKeyDown()
  fullScreen()
  console.log(route.query)
  if(route.query.event) {
    event.value = +route.query.event
  }
  const res2 = await axios.get('https://propartnerbe.vercel.app/getTime')
  time.value = res2.data.time
})



onBeforeUnmount(() => {
  window.removeEventListener('keydown', enterEvent)
  window.removeEventListener('keydown', spaceEvent)
})

const show = ref(false)
const password = ref('')


const login = () => {
  if(password.value.toLowerCase() === 'prologin') {
    show.value = true
  }
}

</script>

<template>
  <div class="bg h-screen gap-10 flex flex-cols items-center justify-center">
    <div v-if="!show" class="w-1/2 flex items-center justify-center gap-4 flex-col">
      <el-input v-model="password" class="w-1/2 h-10" @keyup.enter="login"  type="password" />
      <el-button class="w-full bg-yellow-500" @click="login">進入抽獎頁面</el-button>
    </div>
      <div v-if="show" class="w-[50vw]">
        <div v-if="step === 1" class="grid grid-cols-5 gap-4">
          <div v-for="i in visibleWinners" class="flex flex-col">
            <span class="font-bold text-[60px] leading-[42px]">{{ maskName(i.name) }}</span>
            <span>{{ maskTWID(i.userId) }}</span>
          </div>
        </div>
        <img v-if="step === 0" :src="title" class="w-[50vw]"/>
       
        <!-- <div class="flex items-center justify-center" v-if="step === 2">
          <QrcodeVue :value="`${href}/#/winners?event=${event}`" size="600" class="border-8 border-white"/>
      </div> -->
      </div>
      <div v-if="show" class="w-[40vw] flex justify-between gap-10 flex-col items-center">
        <img :src="prologo" class="w-[300px]"/>
        <p class="text-4xl leading-loose">請於今日{{time}}前兌換完畢<br>逾期視同放棄得獎資格</p>
       <div class="flex items-center flex-col gap-4">
        <!-- <div @click="lottery" class="w-[360px] cursor-pointer hover:scale-[1.05] hover:shadow-xl rounded-full  py-4 text-4xl font-bold bg-yellow-500 flex items-center justify-center text-black">開始抽獎</div> -->
        <!-- <div v-if="step === 2" class="font-bold text-5xl leading-loose">請掃描QRCODE<br>查看完整中獎名單</div> -->
        <!-- <div class="reset cursor-pointer" @click="reset">重置得獎者</div> -->
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
