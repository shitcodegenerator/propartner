<template>
  <div class="bg min-h-screen px-4 py-[40px] flex flex-col gap-10">
    <div
      v-if="!show"
      class="w-1/2 mx-auto flex items-center justify-center gap-4 flex-col"
    >
      <el-input
        v-model="password"
        class="w-1/2 h-10"
        @keyup.enter="login"
        placeholder="請輸入密碼"
        type="password"
      />
      <el-button class="w-full bg-yellow-500" @click="login"
        >進入設定頁面</el-button
      >
    </div>

    <template v-else>
      <div
        class="bg-white shadow rounded-lg border w-[300px] mx-auto flex flex-col items-center justify-center py-8 px-4"
      >
        <h1 class="font-bold text-2xl text-center mb-4 text-blue-700">
          抽獎人數設置
        </h1>
        <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          status-icon
          :rules="rules"
          label-width="120px"
          label-position="left"
          class="demo-ruleForm"
        >
          <el-form-item label="抽獎人數" prop="num">
            <el-select
              v-model="ruleForm.num"
              style="
                width: 100px;
                border-radius: 400px;
                overflow: hidden;
                font-size: 20px;
              "
            >
              <template v-if="isBiolive">
                <el-option :value="3" label="3人">3人</el-option>
                <el-option :value="5" label="5人">5人</el-option>
                <el-option :value="10" label="10人">10人</el-option>
                <el-option :value="20" label="20人">20人</el-option>
              </template>
              <template v-else>
                <el-option :value="10" label="10人">10人</el-option>
                <el-option :value="15" label="15人">15人</el-option>
                <el-option :value="20" label="20人">20人</el-option>
                <el-option :value="25" label="25人">25人</el-option>
                <el-option :value="30" label="30人">30人</el-option>
                <el-option :value="35" label="35人">35人</el-option>
                <el-option :value="40" label="40人">40人</el-option>
                <el-option :value="45" label="45人">45人</el-option>
                <el-option :value="50" label="50人">50人</el-option>
                <el-option :value="55" label="55人">55人</el-option>
                <el-option :value="60" label="60人">60人</el-option>
                <el-option :value="65" label="65人">65人</el-option>
                <el-option :value="70" label="70人">70人</el-option>
                <el-option :value="75" label="75人">75人</el-option>
                <el-option :value="80" label="80人">80人</el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="兌換時間">
            <el-input v-model="ruleForm.time" />
          </el-form-item>
        </el-form>

        <div class="flex flex-col gap-4 w-full">
          <el-button
            type="primary"
            style="margin: 0; height: 48px"
            @click="submitForm(ruleFormRef)"
            >送出</el-button
          >
          <el-button type="danger" style="margin: 0; height: 48px" @click="open"
            >清除所有名單</el-button
          >
        </div>
      </div>

      <div
        class="bg-white shadow rounded-lg border w-[300px] mx-auto flex flex-col items-center justify-center py-8 px-4"
      >
        <h1 class="font-bold text-2xl text-center mb-4 text-green-700">
          匯入參加者
        </h1>
        <el-form label-width="120px" label-position="left" class="w-full">
          <el-form-item label="場次">
            <el-select v-model="importEvent" class="w-[100px]">
              <el-option :value="1" label="1">1</el-option>
              <template v-if="!isBiolive">
                <el-option :value="2" label="2">2</el-option>
                <el-option :value="3" label="3">3</el-option>
                <el-option :value="4" label="4">4</el-option>
              </template>
            </el-select>
          </el-form-item>
        </el-form>
        <el-upload
          ref="uploadRef"
          :auto-upload="false"
          :limit="1"
          accept=".csv"
          :on-change="handleFileChange"
          :on-remove="handleFileRemove"
          class="w-full mb-4"
        >
          <template #trigger>
            <el-button type="primary" plain>選擇 CSV 檔案</el-button>
          </template>
          <template #tip>
            <div class="text-gray-400 text-xs mt-1">
              <template v-if="isBiolive">
                格式：每行一筆代號（不需標題列）
              </template>
              <template v-else>
                格式：姓名,手機號碼,身分證字號（第一行為標題列）
              </template>
            </div>
          </template>
        </el-upload>
        <el-button
          type="success"
          class="w-full"
          style="height: 48px"
          :disabled="!csvFile"
          @click="handleImport"
          >匯入</el-button
        >
      </div>

      <div
        class="bg-white shadow rounded-lg border w-[300px] mx-auto flex flex-col items-center justify-center py-8 px-4"
      >
        <h1 class="font-bold text-2xl text-center mb-4 text-red-700">
          重置得獎名單
        </h1>
        <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          status-icon
          :rules="rules"
          label-width="120px"
          label-position="left"
          class="demo-ruleForm"
        >
          <el-form-item label="場次" prop="event">
            <el-select
              v-model="ruleForm2.event"
              style="
                width: 100px;
                border-radius: 400px;
                overflow: hidden;
                font-size: 20px;
              "
            >
              <el-option :value="1" label="1">1</el-option>
              <template v-if="!isBiolive">
                <el-option :value="2" label="2">2</el-option>
                <el-option :value="3" label="3">3</el-option>
                <el-option :value="4" label="4">4</el-option>
              </template>
            </el-select>
          </el-form-item>
        </el-form>

        <div class="flex flex-col gap-4 w-full">
          <el-button
            type="warning"
            style="margin: 0; height: 48px"
            @click="reset"
            >重置得獎者</el-button
          >
          <el-button
            type="success"
            style="margin: 0; height: 48px"
            @click="openFake"
            >新增假名單資料</el-button
          >
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import type {
  FormInstance,
  FormRules,
  UploadInstance,
  UploadFile,
} from "element-plus";
import { ElMessage, ElLoading, ElMessageBox } from "element-plus";
import axios from "axios";
import { useRoute } from "vue-router";
import type { Action } from "element-plus";

const API_BASE = import.meta.env.VITE_API_BASE;
const MERCHANT_TYPE = import.meta.env.VITE_MERCHANT_TYPE || "propartner";
const isBiolive = MERCHANT_TYPE === "biolive";

// === 匯入參加者 ===
const importEvent = ref(1);
const csvFile = ref<File | null>(null);
const uploadRef = ref<UploadInstance>();

const handleFileChange = (file: UploadFile) => {
  csvFile.value = file.raw ?? null;
};

const handleFileRemove = () => {
  csvFile.value = null;
};

const parseCsv = (text: string) => {
  const lines = text.split(/\r?\n/).filter((line) => line.trim());

  // biolive：所有非空 cell 都是一筆代號
  if (isBiolive) {
    if (lines.length === 0) return [];
    return lines
      .flatMap((line) => line.split(","))
      .map((cell) => cell.trim())
      .filter((cell) => cell)
      .map((code) => ({ code }));
  }

  // propartner：跳過標題列
  if (lines.length < 2) return [];
  return lines
    .slice(1)
    .map((line) => {
      const cols = line.split(",");
      return {
        name: (cols[0] || "").trim(),
        mobile: (cols[1] || "").trim(),
        userId: (cols[2] || "").trim(),
      };
    })
    .filter((m) => m.name && m.userId);
};

const handleImport = async () => {
  if (!csvFile.value) return;

  const loading = ElLoading.service({
    lock: true,
    customClass: "spinner",
    background: "rgba(0, 0, 0, 0.7)",
  });

  try {
    const text = await csvFile.value.text();
    const members = parseCsv(text);

    if (members.length === 0) {
      ElMessage.error(
        isBiolive
          ? "CSV 檔案中沒有有效資料，請確認格式：代號"
          : "CSV 檔案中沒有有效資料，請確認格式：姓名,手機號碼,身分證字號",
      );
      loading.close();
      return;
    }

    const { data } = await axios.post(`${API_BASE}/import`, {
      members,
      event: importEvent.value,
    });

    ElMessage.success(data.message);
    csvFile.value = null;
    uploadRef.value?.clearFiles();
  } catch (err: any) {
    ElMessage.error(err?.response?.data?.message ?? "匯入失敗");
  } finally {
    loading.close();
  }
};

const ruleFormRef = ref<FormInstance>();

const ruleForm = reactive({
  num: isBiolive ? 10 : 30,
  time: "16:00",
});
const ruleForm2 = reactive({
  event: 1,
});

const rules = reactive<FormRules<typeof ruleForm>>({
  num: [{ required: true, message: "請選擇人數", trigger: "change" }],
});

const show = ref(false);
const password = ref("");

const login = () => {
  if (password.value.toLowerCase() === "caq6866") {
    show.value = true;
  } else {
    ElMessage.error("密碼錯誤");
  }
};

const secondAlert = () => {
  ElMessageBox.alert("按下確定會立即清除所有參加人員，請務必確認", "提示", {
    // if you want to disable its autofocus
    // autofocus: false,
    confirmButtonText: "確定",
    callback: async (action: Action) => {
      const res1 = await axios.get(`${API_BASE}/clear`);
      ElMessage({
        type: "info",
        message: `已清除`,
      });
    },
  });
};

const activeEvent = ref(1);

const secondAlertFake = () => {
  ElMessageBox.alert("按下確定會立即新增假名單人員，請務必確認", "提示", {
    // if you want to disable its autofocus
    // autofocus: false,
    confirmButtonText: "確定",
    callback: async (action: Action) => {
      const res1 = await axios.get(`${API_BASE}/fake?event=${ruleForm2.event}&type=${MERCHANT_TYPE}`);
      ElMessage({
        type: "info",
        message: `成功新增`,
      });
    },
  });
};

const open = () => {
  ElMessageBox.alert("是否要清除所有參加人員？", "提示", {
    // if you want to disable its autofocus
    // autofocus: false,
    confirmButtonText: "確定",
    callback: secondAlert,
  });
};

const openFake = () => {
  ElMessageBox.alert("是否要新增假名單資料？", "提示", {
    // if you want to disable its autofocus
    // autofocus: false,
    confirmButtonText: "確定",
    callback: secondAlertFake,
  });
};

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  const loading = ElLoading.service({
    lock: true,
    customClass: "spinner",
    background: "rgba(0, 0, 0, 0.7)",
  });
  formEl.validate(async (valid) => {
    if (valid) {
      try {
        const { data } = await axios.post(`${API_BASE}/setNum`, ruleForm);
        await axios.post(`${API_BASE}/setTime`, ruleForm);
        console.log(data);
        ElMessage.success("成功");
        loading.close();
      } catch (err) {
        console.log(err);
        ElMessage.error(err?.response?.data?.message ?? "失敗");
        loading.close();
      }
    }
  });
};

const route = useRoute();

const reset = async () => {
  const loading = ElLoading.service({
    lock: true,
    customClass: "spinner",
    background: "rgba(0, 0, 0, 0.7)",
  });
  try {
    await axios.get(`${API_BASE}/reset?event=${ruleForm2.event}`);
    ElMessage.success("成功");
    loading.close();
  } catch (e) {
    ElMessage.error("失敗");
    loading.close();
  }
};

onMounted(async () => {
  const res1 = await axios.get(`${API_BASE}/getNum`);
  ruleForm.num = res1.data.num;
  const res2 = await axios.get(`${API_BASE}/getTime`);
  ruleForm.time = res2.data.time;
});
</script>

<style lang="scss" scoped>
.bg {
  background-color: #dbdbdb;
}
</style>
