<template>
  <div class="min-h-screen bg-gray-100 px-4 py-10">
    <!-- 登入 -->
    <div
      v-if="!show"
      class="max-w-xs mx-auto flex flex-col items-center gap-4 pt-20"
    >
      <h2 class="text-xl font-bold text-gray-600 tracking-wide">管理後台</h2>
      <el-input
        v-model="password"
        class="w-full"
        size="large"
        @keyup.enter="login"
        placeholder="請輸入密碼"
        type="password"
      />
      <el-button type="primary" class="w-full" size="large" @click="login">
        進入設定頁面
      </el-button>
    </div>

    <!-- 主內容 -->
    <div v-else class="max-w-3xl mx-auto flex flex-col gap-6">
      <!-- 抽獎設定 -->
      <el-card shadow="hover">
        <template #header>
          <div class="flex items-center gap-2">
            <span class="text-lg font-bold text-blue-700">抽獎設定</span>
          </div>
        </template>
        <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          status-icon
          :rules="rules"
          label-width="100px"
          label-position="left"
        >
          <el-form-item label="抽獎人數" prop="num">
            <el-select v-model="ruleForm.num" class="w-[120px]">
              <template v-if="isBiolive">
                <el-option :value="3" label="3人" />
                <el-option :value="5" label="5人" />
                <el-option :value="10" label="10人" />
                <el-option :value="20" label="20人" />
              </template>
              <template v-else>
                <el-option
                  v-for="n in [
                    10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80,
                  ]"
                  :key="n"
                  :value="n"
                  :label="`${n}人`"
                />
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="兌換時間">
            <el-input v-model="ruleForm.time" class="w-[120px]" />
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          class="w-full"
          @click="submitForm(ruleFormRef)"
        >
          儲存設定
        </el-button>
      </el-card>

      <!-- 匯入參加者 -->
      <el-card shadow="hover">
        <template #header>
          <div class="flex items-center gap-2">
            <span class="text-lg font-bold text-green-700">匯入參加者</span>
          </div>
        </template>
        <el-form label-width="100px" label-position="left" class="mb-4">
          <el-form-item label="場次" class="!mb-0">
            <el-select v-model="importEvent" class="w-[120px]">
              <el-option :value="1" label="1" />
              <template v-if="!isBiolive">
                <el-option :value="2" label="2" />
                <el-option :value="3" label="3" />
                <el-option :value="4" label="4" />
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
          :disabled="!csvFile"
          @click="handleImport"
        >
          匯入
        </el-button>
      </el-card>

      <!-- 資料查詢 -->
      <el-card shadow="hover">
        <template #header>
          <div class="flex items-center gap-2">
            <span class="text-lg font-bold text-purple-700">資料查詢</span>
          </div>
        </template>
        <el-tabs v-model="activeQueryTab">
          <!-- 查詢得獎者 -->
          <el-tab-pane label="得獎者" name="winners">
            <div class="flex items-center gap-4 mb-4">
              <el-form
                label-width="50px"
                label-position="left"
                class="flex-shrink-0"
              >
                <el-form-item label="場次" class="!mb-0">
                  <el-select v-model="queryWinnersEvent" class="w-40">
                    <el-option :value="1" label="1" />
                    <template v-if="!isBiolive">
                      <el-option :value="2" label="2" />
                      <el-option :value="3" label="3" />
                      <el-option :value="4" label="4" />
                    </template>
                  </el-select>
                </el-form-item>
              </el-form>
              <el-button
                type="primary"
                @click="queryWinners"
                :loading="winnersLoading"
              >
                查詢
              </el-button>
            </div>
            <div v-if="winnersList.length > 0" class="w-full">
              <p class="text-sm text-gray-500 mb-2">
                共 {{ winnersList.length }} 位得獎者
              </p>
              <el-table
                :data="winnersList"
                border
                size="small"
                max-height="400"
              >
                <el-table-column type="index" label="#" width="50" />
                <el-table-column v-if="isBiolive" prop="name" label="代號" />
                <el-table-column v-if="!isBiolive" prop="name" label="姓名" />
                <el-table-column
                  v-if="!isBiolive"
                  prop="userId"
                  label="身分證字號"
                />
                <el-table-column
                  v-if="!isBiolive"
                  prop="mobile"
                  label="手機號碼"
                />
              </el-table>
            </div>
            <el-empty
              v-else-if="winnersSearched"
              description="此場次尚無得獎者"
            />
          </el-tab-pane>

          <!-- 查詢參賽者 -->
          <el-tab-pane label="參賽者" name="members">
            <div class="flex items-center gap-4 mb-4">
              <el-form
                label-width="50px"
                label-position="left"
                class="flex-shrink-0"
              >
                <el-form-item label="場次" class="!mb-0">
                  <el-select v-model="queryMembersEvent" class="!w-40">
                    <el-option :value="1" label="1" />
                    <template v-if="!isBiolive">
                      <el-option :value="2" label="2" />
                      <el-option :value="3" label="3" />
                      <el-option :value="4" label="4" />
                    </template>
                  </el-select>
                </el-form-item>
              </el-form>
              <el-button
                type="primary"
                @click="queryMembers"
                :loading="membersLoading"
              >
                查詢
              </el-button>
            </div>
            <div v-if="membersList.length > 0" class="w-full">
              <p class="text-sm text-gray-500 mb-2">
                共 {{ membersList.length }} 位參賽者
              </p>
              <el-table
                :data="membersList"
                border
                size="small"
                max-height="400"
              >
                <el-table-column type="index" label="#" width="50" />
                <el-table-column v-if="isBiolive" prop="name" label="代號" />
                <el-table-column v-if="!isBiolive" prop="name" label="姓名" />
                <el-table-column
                  v-if="!isBiolive"
                  prop="userId"
                  label="身分證字號"
                />
                <el-table-column
                  v-if="!isBiolive"
                  prop="mobile"
                  label="手機號碼"
                />
                <el-table-column
                  prop="isWinner"
                  label="已中獎"
                  width="80"
                  align="center"
                >
                  <template #default="{ row }">
                    <el-tag
                      :type="row.isWinner ? 'success' : 'info'"
                      size="small"
                    >
                      {{ row.isWinner ? "是" : "否" }}
                    </el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <el-empty
              v-else-if="membersSearched"
              description="此場次尚無參賽者"
            />
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <!-- 危險操作 -->
      <el-card shadow="hover" class="danger-zone">
        <template #header>
          <div class="flex items-center gap-2">
            <span class="text-lg font-bold text-red-600">危險操作</span>
          </div>
        </template>
        <el-form label-width="100px" label-position="left" class="mb-4">
          <el-form-item label="場次" class="!mb-0">
            <el-select v-model="ruleForm2.event" class="w-[120px]">
              <el-option :value="1" label="1" />
              <template v-if="!isBiolive">
                <el-option :value="2" label="2" />
                <el-option :value="3" label="3" />
                <el-option :value="4" label="4" />
              </template>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="flex flex-row gap-3">
          <el-button type="warning" class="w-full" @click="reset">
            重置此場次得獎者
          </el-button>
          <el-button type="info" class="w-full" @click="openFake">
            新增假名單資料
          </el-button>
          <el-button type="danger" class="w-full" @click="open">
            清除所有名單
          </el-button>
        </div>
      </el-card>
    </div>
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

const API_BASE = import.meta.env.VITE_API_BASE;
const MERCHANT_TYPE = import.meta.env.VITE_MERCHANT_TYPE || "propartner";
const isBiolive = MERCHANT_TYPE === "biolive";

// === 登入 ===
const show = ref(false);
const password = ref("");

const login = () => {
  if (password.value.toLowerCase() === "caq6866") {
    show.value = true;
  } else {
    ElMessage.error("密碼錯誤");
  }
};

// === 抽獎設定 ===
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  num: isBiolive ? 10 : 30,
  time: "16:00",
});
const rules = reactive<FormRules<typeof ruleForm>>({
  num: [{ required: true, message: "請選擇人數", trigger: "change" }],
});

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
        await axios.post(`${API_BASE}/setNum`, ruleForm);
        await axios.post(`${API_BASE}/setTime`, ruleForm);
        ElMessage.success("成功");
      } catch (err: any) {
        ElMessage.error(err?.response?.data?.message ?? "失敗");
      } finally {
        loading.close();
      }
    } else {
      loading.close();
    }
  });
};

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

  if (isBiolive) {
    if (lines.length === 0) return [];
    return lines
      .flatMap((line) => line.split(","))
      .map((cell) => cell.trim())
      .filter((cell) => cell)
      .map((code) => ({ code }));
  }

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

// === 資料查詢 ===
const activeQueryTab = ref("winners");

// 查詢得獎者
const queryWinnersEvent = ref(1);
const winnersList = ref<any[]>([]);
const winnersLoading = ref(false);
const winnersSearched = ref(false);

const queryWinners = async () => {
  winnersLoading.value = true;
  winnersSearched.value = false;
  const { data } = await axios.get(
    `${API_BASE}/getWinners?event=${queryWinnersEvent.value}`,
  );
  winnersList.value = data.winners ?? [];
  winnersSearched.value = true;
  winnersLoading.value = false;
};

// 查詢參賽者
const queryMembersEvent = ref(1);
const membersList = ref<any[]>([]);
const membersLoading = ref(false);
const membersSearched = ref(false);

const queryMembers = async () => {
  membersLoading.value = true;
  membersSearched.value = false;
  const { data } = await axios.get(
    `${API_BASE}/getMembers?event=${queryMembersEvent.value}`,
  );
  membersList.value = data.members ?? [];
  membersSearched.value = true;
  membersLoading.value = false;
};

// === 危險操作 ===
const ruleForm2 = reactive({ event: 1 });

const reset = async () => {
  const loading = ElLoading.service({
    lock: true,
    customClass: "spinner",
    background: "rgba(0, 0, 0, 0.7)",
  });
  try {
    await axios.get(`${API_BASE}/reset?event=${ruleForm2.event}`);
    ElMessage.success("成功");
  } catch {
    ElMessage.error("失敗");
  } finally {
    loading.close();
  }
};

const open = () => {
  ElMessageBox.confirm("是否要清除所有參加人員？", "提示", {
    confirmButtonText: "確定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      ElMessageBox.confirm(
        "按下確定會立即清除所有參加人員，請務必確認",
        "最後確認",
        {
          confirmButtonText: "確定清除",
          cancelButtonText: "取消",
          type: "error",
        },
      )
        .then(async () => {
          await axios.get(`${API_BASE}/clear`);
          ElMessage.success("已清除");
        })
        .catch(() => {});
    })
    .catch(() => {});
};

const openFake = () => {
  ElMessageBox.confirm("是否要新增假名單資料？", "提示", {
    confirmButtonText: "確定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      ElMessageBox.confirm(
        "按下確定會立即新增假名單人員，請務必確認",
        "最後確認",
        {
          confirmButtonText: "確定新增",
          cancelButtonText: "取消",
          type: "warning",
        },
      )
        .then(async () => {
          await axios.get(
            `${API_BASE}/fake?event=${ruleForm2.event}&type=${MERCHANT_TYPE}`,
          );
          ElMessage.success("成功新增");
        })
        .catch(() => {});
    })
    .catch(() => {});
};

// === 初始化 ===
onMounted(async () => {
  const [numRes, timeRes] = await Promise.all([
    axios.get(`${API_BASE}/getNum`),
    axios.get(`${API_BASE}/getTime`),
  ]);
  ruleForm.num = numRes.data.num;
  ruleForm.time = timeRes.data.time;
});
</script>

<style lang="scss" scoped>
.danger-zone {
  :deep(.el-card__header) {
    @apply border-red-200 bg-red-50;
  }
}
</style>
