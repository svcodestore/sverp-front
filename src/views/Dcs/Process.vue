<!--
 * @Date: 2021-05-05 13:33:36
 * @LastEditors: Mok.CH
 * @LastEditTime: 2021-05-14 11:03:48
 * @FilePath: \sverp-front\src\views\Dcs\Process.vue
-->
<template>
  <div>
    <div class="container">
      <div style="margin-bottom: 10px">
        <el-row :gutter="12">
          <el-col :span="4">
            <el-card shadow="hover">
              <div>
                <div class="num">{{ numFirst }}</div>
                <div class="title">进行中</div>
              </div>
            </el-card>
          </el-col>

          <el-col :span="4">
            <el-card shadow="hover">
              <div>
                <div class="num">{{ numSecond }}</div>
                <div class="title">流程作业指导书</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card shadow="hover">
              <div>
                <div class="num">{{ numThird }}</div>
                <div class="title">工序标准作业票</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card shadow="hover">
              <div>
                <div class="num">{{ numFourth }}</div>
                <div class="title">设备操作规范</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card shadow="hover">
              <div>
                <div class="num">{{ numFifth }}</div>
                <div class="title">品管作业指导书</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card shadow="hover">
              <div>
                <div class="num">{{ numSixth }}</div>
                <div class="title">已完成</div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">

        <el-tab-pane label="首页" name="first">
          <div>
            <el-button type="primary" @click="addPlan">添加计划</el-button>
          </div>
          <div>
            <el-divider content-position="left"></el-divider>
            <div id="main">
              <el-table
                :data="tableData"
                style="width: 100%"
                border
                :cell-style="cellStyle"
                :header-cell-style="tableHeaderColor"
              >
                <!-- 合并单元格 :span-method="objectSpanMethod" -->
                <el-table-column prop="dirName" label="四大标准" width="120" fixed></el-table-column>
                <el-table-column type="index" label="No" width="40"></el-table-column>
                <el-table-column prop="content" label="认证项目" fixed></el-table-column>
                <el-table-column label="收集资料">
                  <el-table-column prop="depPrincipal" label="被收集单位"></el-table-column>
                  <el-table-column prop="planTime" label="计划完成时间"></el-table-column>
                  <el-table-column label="实际完成时间" width="100">
                    <template slot-scope="scope">
                      <div>
                        {{ scope.row.actualTime }}
                        <div v-if="scope.row.actualTime === null">
                          <el-button type="primary" plain size="mini" @click="verify(scope.row, 1)">确认完成</el-button>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="gatherUsername" label="收集资料组长"></el-table-column>
                  <el-table-column prop="gatherPlanTime" label="计划送审时间"></el-table-column>
                </el-table-column>
                <el-table-column label="审核认证">
                  <el-table-column prop="authPlanTime" label="计划时间"></el-table-column>
                  <el-table-column label="认证人员" :filter-method="filterPlanAuth" :filters="filterData">
                    <template slot-scope="scope">
                      <div v-if="scope.row.authUsers !== null">
                        <div v-for="(item, i) in scope.row.authUsers" :key="i">
                          {{ item.con_name }}
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="完成时间" width="100">
                    <template slot-scope="scope">
                      <div v-if="scope.row.authPlanTime !== null">
                        {{ scope.row.authActualTime }}
                        <div
                          v-if="scope.row.authActualTime === null && scope.row.authPlanTime !== null"
                        >
                          <el-button type="primary" plain size="mini" @click="verify(scope.row, 2)">确认完成</el-button>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column label="稽核">
                  <el-table-column prop="checkPlanTime" label="计划时间"></el-table-column>
                  <el-table-column label="稽核人员" :filter-method="filterPlanCheck" :filters="filterData">
                    <template slot-scope="scope">
                      <div v-if="scope.row.checkUsers !== null">
                        <div v-for="(item, i) in scope.row.checkUsers" :key="i">
                          {{ item.con_name }}
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="checkActualTime" label="完成时间"></el-table-column>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="150">
                  <template slot-scope="scope">
                    <div v-if="scope.row.authPlanTime === null">
                      <el-row>
                        <el-col :span="24">
                          <el-button type="primary" plain size="mini" @click="settingPlan(scope.row)">设定计划送审时间</el-button>
                        </el-col>
                      </el-row>
                      <el-row v-if="scope.row.actualTime === null">
                        <el-col :span="24">
                          <el-button type="warning" plain size="mini" @click="updatePlan(scope.row, 1)">修改计划</el-button>
                        </el-col>
                        <el-col :span="24">
                          <el-button type="warning" plain size="mini" @click="delPlan(scope.row)">删除计划</el-button>
                        </el-col>
                      </el-row>
                    </div>
                    <div v-else-if="scope.row.checkPlanTime === null">
                      <el-row>
                        <el-col :span="24">
                          <el-button type="primary" plain size="mini" @click="addAuthPlan(scope.row)">设定稽核计划时间</el-button>
                        </el-col>
                      </el-row>
                      <el-row v-if="scope.row.authActualTime === null">
                        <el-col :span="24">
                          <el-button type="warning" plain size="mini" @click="updatePlan(scope.row, 2)">修改认证计划时间</el-button>
                        </el-col>
                      </el-row>
                    </div>
                    <div v-else-if="scope.row.checkActualTime === null">
                      <el-row>
                        <el-col :span="24">
                          <el-button type="primary" plain size="mini" @click="pass(scope.row)">稽核通过</el-button>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="24">
                          <el-button type="warning" plain size="mini" @click="updatePlan(scope.row, 3)">修改稽核计划时间</el-button>
                        </el-col>
                      </el-row>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="流程作业指导书" name="second">
          <div>
            <el-table
              :data="tabTableData"
              style="width: 100%"
              border
              :cell-style="cellStyleTab"
              :header-cell-style="tabTableHeaderColor"
            >
              <el-table-column type="index" label="No" width="40"></el-table-column>
              <el-table-column prop="content" label="认证项目"></el-table-column>
              <el-table-column label="收集资料">
                <el-table-column prop="depPrincipal" label="被收集单位"></el-table-column>
                <el-table-column prop="planTime" sortable label="计划完成时间"></el-table-column>
                <el-table-column width="100" label="实际完成时间">
                  <template slot-scope="scope">
                    <div v-if="scope.row.planTime !== null">
                      {{ scope.row.actualTime }}
                      <div v-if="scope.row.actualTime === null && scope.row.planTime !== null">
                        <el-button type="primary" plain size="mini" @click="verify(scope.row, 1)">确认完成</el-button>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="gatherUsername" label="收集资料组长"></el-table-column>
                <el-table-column prop="gatherPlanTime" label="计划送审时间" sortable></el-table-column>
              </el-table-column>
              <el-table-column label="审核认证">
                <el-table-column prop="authPlanTime" label="计划时间" sortable></el-table-column>
                <el-table-column label="认证人员" :filter-method="filterPlanAuth" :filters="filterData">
                  <template slot-scope="scope">
                    <div v-if="scope.row.authUsers !== null">
                      <div v-for="(item, i) in scope.row.authUsers" :key="i">
                        {{ item.con_name }}
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="完成时间" width="100">
                  <template slot-scope="scope">
                    <div v-if="scope.row.authPlanTime !== null">
                      {{ scope.row.authActualTime }}
                      <div
                        v-if="scope.row.authActualTime === null && scope.row.authPlanTime !== null"
                      >
                        <el-button type="primary" plain size="mini" @click="verify(scope.row, 2)">确认完成</el-button>
                      </div>
                    </div>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column label="稽核">
                <el-table-column prop="checkPlanTime" label="计划时间" sortable></el-table-column>
                <el-table-column label="稽核人员" :filter-method="filterPlanCheck" :filters="filterData">
                  <template slot-scope="scope">
                    <div v-if="scope.row.cUserId !== null">
                      <div v-for="(item, i) in scope.row.checkUsers" :key="i">
                        {{ item.con_name }}
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="checkActualTime" label="完成时间"></el-table-column>
              </el-table-column>
              <el-table-column label="操作" fixed="right" width="150">
                <template slot-scope="scope">
                  <div v-if="scope.row.authPlanTime === null">
                    <el-row>
                      <el-col :span="24">
                        <el-button type="primary" plain size="mini" @click="settingPlan(scope.row)">设定计划送审时间</el-button>
                      </el-col>
                    </el-row>
                    <el-row v-if="scope.row.actualTime === null">
                      <el-col :span="24">
                        <el-button type="warning" plain size="mini" @click="updatePlan(scope.row, 1)">修改计划</el-button>
                      </el-col>
                      <el-col :span="24">
                        <el-button type="warning" plain size="mini" @click="delPlan(scope.row)">删除计划</el-button>
                      </el-col>
                    </el-row>
                  </div>
                  <div v-else-if="scope.row.checkPlanTime === null">
                    <el-row>
                      <el-col :span="24">
                        <el-button type="primary" plain size="mini" @click="addAuthPlan(scope.row)">设定稽核计划时间</el-button>
                      </el-col>
                    </el-row>
                    <el-row v-if="scope.row.authActualTime === null">
                      <el-col :span="24">
                        <el-button type="warning" plain size="mini" @click="updatePlan(scope.row, 2)">修改认证计划时间</el-button>
                      </el-col>
                    </el-row>
                  </div>
                  <div v-else-if="scope.row.checkActualTime === null">
                    <el-row>
                      <el-col :span="24">
                        <el-button type="primary" plain size="mini" @click="pass(scope.row)">稽核通过</el-button>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24">
                        <el-button type="warning" plain size="mini" @click="updatePlan(scope.row, 3)">修改稽核计划时间</el-button>
                      </el-col>
                    </el-row>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>

        <el-tab-pane label="工序标准作业票" name="third">
          <div>
            <el-table
              :data="tabTableData"
              style="width: 100%"
              border
              :cell-style="cellStyleTab"
              :header-cell-style="tabTableHeaderColor"
            >
              <el-table-column type="index" label="No" width="40"></el-table-column>
              <el-table-column prop="content" label="认证项目"></el-table-column>
              <el-table-column label="收集资料">
                <el-table-column prop="depPrincipal" label="被收集单位"></el-table-column>
                <el-table-column prop="planTime" label="计划完成时间" sortable></el-table-column>
                <el-table-column width="100" label="实际完成时间">
                  <template slot-scope="scope">
                    <div v-if="scope.row.planTime !== null">
                      {{ scope.row.actualTime }}
                      <div v-if="scope.row.actualTime === null && scope.row.planTime !== null">
                        <el-button type="primary" plain size="mini" @click="verify(scope.row, 1)">确认完成</el-button>
                      </div>
                    </div>
                  </template>
                </el-table-column>

                <el-table-column prop="gatherUsername" label="收集资料组长"></el-table-column>
                <el-table-column prop="gatherPlanTime" label="计划送审时间" sortable></el-table-column>
              </el-table-column>
              <el-table-column label="审核认证">
                <el-table-column prop="authPlanTime" label="计划时间" sortable></el-table-column>
                <el-table-column label="认证人员" :filter-method="filterPlanAuth" :filters="filterData">
                  <template slot-scope="scope">
                    <div v-if="scope.row.planAuth !== null">
                      <div v-for="(item, i) in scope.row.authUsers" :key="i">
                        {{ item.con_name }}
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="完成时间" width="100">
                  <template slot-scope="scope">
                    <div v-if="scope.row.authPlanTime !== null">
                      {{ scope.row.authActualTime }}
                      <div
                        v-if="scope.row.authActualTime === null && scope.row.authPlanTime !== null"
                      >
                        <el-button type="primary" plain size="mini" @click="verify(scope.row, 2)">确认完成</el-button>
                      </div>
                    </div>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column label="稽核">
                <el-table-column prop="checkPlanTime" label="计划时间" sortable></el-table-column>
                <el-table-column label="稽核人员" :filter-method="filterPlanCheck" :filters="filterData">
                  <template slot-scope="scope">
                    <div v-if="scope.row.checkUsers !== null">
                      <div v-for="(item, i) in scope.row.checkUsers" :key="i">
                        {{ item.con_name }}
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="checkActualTime" label="完成时间"></el-table-column>
              </el-table-column>
              <el-table-column label="操作" fixed="right" width="150">
                <template slot-scope="scope">
                  <div v-if="scope.row.authPlanTime === null">
                    <el-row>
                      <el-col :span="24">
                        <el-button type="primary" plain size="mini" @click="settingPlan(scope.row)">设定计划送审时间</el-button>
                      </el-col>
                    </el-row>
                    <el-row v-if="scope.row.actualTime === null">
                      <el-col :span="24">
                        <el-button type="warning" plain size="mini" @click="updatePlan(scope.row, 1)">修改计划</el-button>
                      </el-col>
                      <el-col :span="24">
                        <el-button type="warning" plain size="mini" @click="delPlan(scope.row)">删除计划</el-button>
                      </el-col>
                    </el-row>
                  </div>
                  <div v-else-if="scope.row.checkPlanTime === null">
                    <el-row>
                      <el-col :span="24">
                        <el-button type="primary" plain size="mini" @click="addAuthPlan(scope.row)">设定稽核计划时间</el-button>
                      </el-col>
                    </el-row>
                    <el-row v-if="scope.row.authActualTime === null">
                      <el-col :span="24">
                        <el-button type="warning" plain size="mini" @click="updatePlan(scope.row, 2)">修改认证计划时间</el-button>
                      </el-col>
                    </el-row>
                  </div>
                  <div v-else-if="scope.row.checkActualTime === null">
                    <el-row>
                      <el-col :span="24">
                        <el-button type="primary" plain size="mini" @click="pass(scope.row)">稽核通过</el-button>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24">
                        <el-button type="warning" plain size="mini" @click="updatePlan(scope.row, 3)">修改稽核计划时间</el-button>
                      </el-col>
                    </el-row>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>

        <el-tab-pane label="设备操作规范" name="fourth">
          <div>
            <el-table
              :data="tabTableData"
              style="width: 100%"
              border
              :cell-style="cellStyleTab"
              :header-cell-style="tabTableHeaderColor"
            >
              <el-table-column type="index" label="No" width="40"></el-table-column>
              <el-table-column prop="content" label="认证项目"></el-table-column>
              <el-table-column label="收集资料">
                <el-table-column prop="depPrincipal" label="被收集单位"></el-table-column>
                <el-table-column prop="planTime" label="计划完成时间" sortable></el-table-column>
                <el-table-column width="100" label="实际完成时间">
                  <template slot-scope="scope">
                    <div v-if="scope.row.planTime !== null">
                      {{ scope.row.actualTime }}
                      <div v-if="scope.row.actualTime === null && scope.row.planTime !== null">
                        <el-button type="primary" plain size="mini" @click="verify(scope.row, 1)">确认完成</el-button>
                      </div>
                    </div>
                  </template>
                </el-table-column>

                <el-table-column prop="gatherUsername" label="收集资料组长"></el-table-column>
                <el-table-column prop="gatherPlanTime" label="计划送审时间" sortable></el-table-column>
              </el-table-column>
              <el-table-column label="审核认证">
                <el-table-column prop="authPlanTime" label="计划时间" sortable></el-table-column>
                <el-table-column label="认证人员" :filter-method="filterPlanAuth" :filters="filterData">
                  <template slot-scope="scope">
                    <div v-if="scope.row.authUsers !== null">
                      <div v-for="(item, i) in scope.row.authUsers" :key="i">
                        {{ item.con_name }}
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="完成时间" width="100">
                  <template slot-scope="scope">
                    <div v-if="scope.row.authPlanTime !== null">
                      {{ scope.row.authActualTime }}
                      <div
                        v-if="scope.row.authActualTime === null && scope.row.authPlanTime !== null"
                      >
                        <el-button type="primary" plain size="mini" @click="verify(scope.row, 2)">确认完成</el-button>
                      </div>
                    </div>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column label="稽核">
                <el-table-column prop="checkPlanTime" label="计划时间" sortable></el-table-column>
                <el-table-column label="稽核人员" :filter-method="filterPlanCheck" :filters="filterData">
                  <template slot-scope="scope">
                    <div v-if="scope.row.checkUsers !== null">
                      <div v-for="(item, i) in scope.row.checkUsers" :key="i">
                        {{ item.con_name }}
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="checkActualTime" label="完成时间"></el-table-column>
              </el-table-column>
              <el-table-column label="操作" fixed="right" width="150">
                <template slot-scope="scope">
                  <div v-if="scope.row.authPlanTime === null">
                    <el-row>
                      <el-col :span="24">
                        <el-button type="primary" plain size="mini" @click="settingPlan(scope.row)">设定计划送审时间</el-button>
                      </el-col>
                    </el-row>
                    <el-row v-if="scope.row.actualTime === null">
                      <el-col :span="24">
                        <el-button type="warning" plain size="mini" @click="updatePlan(scope.row, 1)">修改计划</el-button>
                      </el-col>
                      <el-col :span="24">
                        <el-button type="warning" plain size="mini" @click="delPlan(scope.row)">删除计划</el-button>
                      </el-col>
                    </el-row>
                  </div>
                  <div v-else-if="scope.row.checkPlanTime === null">
                    <el-row>
                      <el-col :span="24">
                        <el-button type="primary" plain size="mini" @click="addAuthPlan(scope.row)">设定稽核计划时间</el-button>
                      </el-col>
                    </el-row>
                    <el-row v-if="scope.row.authActualTime === null">
                      <el-col :span="24">
                        <el-button type="warning" plain size="mini" @click="updatePlan(scope.row, 2)">修改认证计划时间</el-button>
                      </el-col>
                    </el-row>
                  </div>
                  <div v-else-if="scope.row.checkActualTime === null">
                    <el-row>
                      <el-col :span="24">
                        <el-button type="primary" plain size="mini" @click="pass(scope.row)">稽核通过</el-button>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24">
                        <el-button type="warning" plain size="mini" @click="updatePlan(scope.row, 3)">修改稽核计划时间</el-button>
                      </el-col>
                    </el-row>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>

        <el-tab-pane label="品管作业指导书" name="fifth">
          <div>
            <el-table
              :data="tabTableData"
              style="width: 100%"
              border
              :cell-style="cellStyleTab"
              :header-cell-style="tabTableHeaderColor"
            >
              <el-table-column type="index" label="No" width="40"></el-table-column>
              <el-table-column prop="content" label="认证项目"></el-table-column>
              <el-table-column label="收集资料">
                <el-table-column prop="depPrincipal" label="被收集单位"></el-table-column>
                <el-table-column prop="planTime" label="计划完成时间" sortable></el-table-column>
                <el-table-column width="100" label="实际完成时间">
                  <template slot-scope="scope">
                    <div v-if="scope.row.planTime !== null">
                      {{ scope.row.actualTime }}
                      <div v-if="scope.row.actualTime === null && scope.row.planTime !== null">
                        <el-button type="primary" plain size="mini" @click="verify(scope.row, 1)">确认完成</el-button>
                      </div>
                    </div>
                  </template>
                </el-table-column>

                <el-table-column prop="gatherUsername" label="收集资料组长"></el-table-column>
                <el-table-column prop="gatherPlanTime" label="计划送审时间" sortable></el-table-column>
              </el-table-column>
              <el-table-column label="审核认证">
                <el-table-column prop="authPlanTime" label="计划时间" sortable></el-table-column>
                <el-table-column label="认证人员" :filter-method="filterPlanAuth" :filters="filterData">
                  <template slot-scope="scope">
                    <div v-if="scope.row.authUsers !== null">
                      <div v-for="(item, i) in scope.row.authUsers" :key="i">
                        {{ item.con_name }}
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="完成时间" width="100">
                  <template slot-scope="scope">
                    <div v-if="scope.row.authPlanTime !== null">
                      {{ scope.row.authActualTime }}
                      <div
                        v-if="scope.row.authActualTime === null && scope.row.authPlanTime !== null"
                      >
                        <el-button type="primary" plain size="mini" @click="verify(scope.row, 2)">确认完成</el-button>
                      </div>
                    </div>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column label="稽核">
                <el-table-column prop="checkPlanTime" label="计划时间" sortable></el-table-column>
                <el-table-column label="稽核人员" :filter-method="filterPlanCheck" :filters="filterData">
                  <template slot-scope="scope">
                    <div v-if="scope.row.checkUsers !== null">
                      <div v-for="(item, i) in scope.row.checkUsers" :key="i">
                        {{ item.con_name }}
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="checkActualTime" label="完成时间"></el-table-column>
              </el-table-column>
              <el-table-column label="操作" fixed="right" width="150">
                <template slot-scope="scope">
                  <div v-if="scope.row.authPlanTime === null">
                    <el-row>
                      <el-col :span="24">
                        <el-button type="primary" plain size="mini" @click="settingPlan(scope.row)">设定计划送审时间</el-button>
                      </el-col>
                    </el-row>
                    <el-row v-if="scope.row.actualTime === null">
                      <el-col :span="24">
                        <el-button type="warning" plain size="mini" @click="updatePlan(scope.row, 1)">修改计划</el-button>
                      </el-col>
                      <el-col :span="24">
                        <el-button type="warning" plain size="mini" @click="delPlan(scope.row)">删除计划</el-button>
                      </el-col>
                    </el-row>
                  </div>
                  <div v-else-if="scope.row.checkPlanTime === null">
                    <el-row>
                      <el-col :span="24">
                        <el-button type="primary" plain size="mini" @click="addAuthPlan(scope.row)">设定稽核计划时间</el-button>
                      </el-col>
                    </el-row>
                    <el-row v-if="scope.row.authActualTime === null">
                      <el-col :span="24">
                        <el-button type="warning" plain size="mini" @click="updatePlan(scope.row, 2)">修改认证计划时间</el-button>
                      </el-col>
                    </el-row>
                  </div>
                  <div v-else-if="scope.row.checkActualTime === null">
                    <el-row>
                      <el-col :span="24">
                        <el-button type="primary" plain size="mini" @click="pass(scope.row)">稽核通过</el-button>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24">
                        <el-button type="warning" plain size="mini" @click="updatePlan(scope.row, 3)">修改稽核计划时间</el-button>
                      </el-col>
                    </el-row>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>

        <el-tab-pane label="已完成" name="sixth">
          <div>
            <el-table :data="finishTableData" style="width: 100%" border :header-cell-style="tabTableHeaderColor">
              <el-table-column type="index" label="No" width="40"></el-table-column>
              <el-table-column prop="content" label="认证内容"></el-table-column>
              <el-table-column label="收集资料">
                <el-table-column prop="depPrincipal" label="被收集单位"></el-table-column>
                <el-table-column prop="planTime" sortable label="计划完成时间"></el-table-column>
                <el-table-column prop="actualTime" sortable label="实际完成时间"> </el-table-column>
                <el-table-column
                  prop="users.username"
                  label="收集资料组长"
                  :filters="filterData"
                  :filter-method="filterPlanGather"
                ></el-table-column>
                <el-table-column
                  prop="gatherPlanTime"
                  sortable
                  label="计划送审时间"
                  width="136"
                ></el-table-column>
              </el-table-column>
              <el-table-column label="审核认证">
                <el-table-column prop="authPlanTime" sortable label="计划时间" width="136"></el-table-column>
                <el-table-column label="认证人员" :filters="filterData" :filter-method="filterPlanAuth">
                  <template slot-scope="scope">
                    <div v-if="scope.row.authUsers !== null">
                      <div v-for="(item, i) in scope.row.authUsers" :key="i">
                        {{ item.con_name }}
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="authActualTime" sortable label="完成时间" width="100">
                </el-table-column>
              </el-table-column>
              <el-table-column label="稽核">
                <el-table-column prop="checkPlanTime" sortable label="计划时间" width="136"></el-table-column>
                <el-table-column label="稽核人员" :filters="filterData" :filter-method="filterPlanCheck">
                  <template slot-scope="scope">
                    <div v-if="scope.row.checkUsers !== null">
                      <div v-for="(item, i) in scope.row.checkUsers" :key="i">
                        {{ item.con_name }}
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="checkActualTime" sortable label="完成时间"></el-table-column>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>

        <el-tab-pane label="本人未完成计划" name="seventh">
          <div>
            <el-table
              :data="todoTodayList"
              style="width: 100%"
              border
              :cell-style="cellStyleTab"
              :header-cell-style="tabTableHeaderColor"
            >
              <el-table-column prop="directory.dirName" label="四大标准"></el-table-column>
              <el-table-column prop="content" label="认证项目"></el-table-column>
              <el-table-column label="收集资料">
                <el-table-column prop="depPrincipal" label="被收集单位"></el-table-column>
                <el-table-column prop="planTime" label="计划完成时间" sortable></el-table-column>
                <el-table-column width="100" label="实际完成时间">
                  <template slot-scope="scope">
                    <div v-if="scope.row.planTime !== null">
                      {{ scope.row.actualTime }}
                      <div v-if="scope.row.actualTime === null && scope.row.planTime !== null">
                        <el-button type="primary" plain size="mini" @click="verify(scope.row, 1)">确认完成</el-button>
                      </div>
                    </div>
                  </template>
                </el-table-column>

                <el-table-column prop="gatherUsername" label="收集资料组长"></el-table-column>
                <el-table-column prop="gatherPlanTime" label="计划送审时间" sortable></el-table-column>
              </el-table-column>
              <el-table-column label="审核认证">
                <el-table-column prop="authPlanTime" label="计划时间" sortable></el-table-column>
                <el-table-column label="认证人员" :filter-method="filterPlanAuth" :filters="filterData">
                  <template slot-scope="scope">
                    <div v-if="scope.row.authUsers !== null">
                      <div v-for="(item, i) in scope.row.authUsers" :key="i">
                        {{ item.con_name }}
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="完成时间" width="100">
                  <template slot-scope="scope">
                    <div v-if="scope.row.authPlanTime !== null">
                      {{ scope.row.authActualTime }}
                      <div
                        v-if="scope.row.authActualTime === null && scope.row.authPlanTime !== null"
                      >
                        <el-button type="primary" plain size="mini" @click="verify(scope.row, 2)">确认完成</el-button>
                      </div>
                    </div>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column label="稽核">
                <el-table-column prop="checkPlanTime" label="计划时间" sortable></el-table-column>
                <el-table-column label="稽核人员" :filter-method="filterPlanCheck" :filters="filterData">
                  <template slot-scope="scope">
                    <div v-if="scope.row.checkUsers !== null">
                      <div v-for="(item, i) in scope.row.checkUsers" :key="i">
                        {{ item.con_name }}
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="checkActualTime" label="完成时间"></el-table-column>
              </el-table-column>
              <el-table-column label="操作" fixed="right" width="150">
                <template slot-scope="scope">
                  <div v-if="scope.row.authPlanTime === null">
                    <el-row>
                      <el-col :span="24">
                        <el-button type="primary" plain size="mini" @click="settingPlan(scope.row)">设定计划送审时间</el-button>
                      </el-col>
                    </el-row>
                    <el-row v-if="scope.row.actualTime === null">
                      <el-col :span="24">
                        <el-button type="warning" plain size="mini" @click="updatePlan(scope.row, 1)">修改计划</el-button>
                      </el-col>
                      <el-col :span="24">
                        <el-button type="warning" plain size="mini" @click="delPlan(scope.row)">删除计划</el-button>
                      </el-col>
                    </el-row>
                  </div>
                  <div v-else-if="scope.row.checkPlanTime === null">
                    <el-row>
                      <el-col :span="24">
                        <el-button type="primary" plain size="mini" @click="addAuthPlan(scope.row)">设定稽核计划时间</el-button>
                      </el-col>
                    </el-row>
                    <el-row v-if="scope.row.authActualTime === null">
                      <el-col :span="24">
                        <el-button type="warning" plain size="mini" @click="updatePlan(scope.row, 2)">修改认证计划时间</el-button>
                      </el-col>
                    </el-row>
                  </div>
                  <div v-else-if="scope.row.checkActualTime === null">
                    <el-row>
                      <el-col :span="24">
                        <el-button type="primary" plain size="mini" @click="pass(scope.row)">稽核通过</el-button>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24">
                        <el-button type="warning" plain size="mini" @click="updatePlan(scope.row, 3)">
                          修改稽核计划时间
                        </el-button>
                      </el-col>
                    </el-row>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>

      </el-tabs>
    </div>

    <div>
      <!-- 修改时间 -->
      <el-dialog :title="title" :visible.sync="timeUpdateShow" width="40%" :show-close="false">
        <div>
          <el-form ref="form" :model="formUpdate">
            <el-form-item label="选择日期时间">
              <el-date-picker
                v-model="formUpdate.time"
                type="datetime"
                placeholder="选择日期时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                :picker-options="expireTimeOption"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="人员">
              <el-select v-model="formUpdate.checkUsers" multiple filterable placeholder="请选择">
                <el-option v-for="item in userList" :key="item.id" :label="item.con_name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelUpdateChose">取 消</el-button>
          <el-button type="primary" @click="submitUpdateChose">提 交</el-button>
        </span>
      </el-dialog>
      <!-- 设定稽核计划 -->
      <el-dialog :title="title" :visible.sync="timeChoseShow" width="40%" :show-close="false">
        <div>
          <el-form ref="form" :model="formChoose">
            <el-form-item label="选择稽核人员">
              <el-select v-model="formChoose.checkUsers" multiple filterable placeholder="请选择">
                <el-option v-for="item in userList" :key="item.id" :label="item.con_name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择日期时间">
              <el-date-picker
                v-model="formChoose.time"
                type="datetime"
                placeholder="选择日期时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                :picker-options="expireTimeOption"
              >
              </el-date-picker>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelChose">取 消</el-button>
          <el-button type="primary" @click="submitChose">提 交</el-button>
        </span>
      </el-dialog>
      <!-- 添加认证计划 -->
      <el-dialog title="填写资料" :visible.sync="planGatherShow" width="40%">
        <div>
          <el-form ref="form" :model="gatherForm" label-width="100px">
            <el-form-item label="选择审核人员">
              <el-select v-model="gatherForm.authUsers" multiple filterable placeholder="请选择">
                <el-option v-for="item in userList" :key="item.id" :label="item.con_name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="计划资料送审时间">
              <el-date-picker
                v-model="gatherForm.gatherTime"
                type="datetime"
                placeholder="选择日期时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                :picker-options="expireTimeOption"
              >
              </el-date-picker>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="gatherCancel">取 消</el-button>
          <el-button type="primary" @click="gatherSubmit">提 交</el-button>
        </span>
      </el-dialog>
      <!-- 添加计划 -->
      <el-dialog title="添加计划" :visible.sync="planShow" width="40%">
        <div>
          <el-form ref="form" :model="form" label-width="140px">
            <el-form-item label="认证项目">
              <el-input v-model="form.content"></el-input>
            </el-form-item>
            <el-form-item label="四大标准">
              <el-select v-model="form.dirId" filterable placeholder="请选择">
                <el-option v-for="item in directory" :key="item.id" :label="item.dirName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="被收集单位负责人">
              <el-input v-model="form.depPrincipal"></el-input>
            </el-form-item>
            <el-form-item label="计划完成时间">
              <el-date-picker
                v-model="form.gatherTime"
                type="datetime"
                placeholder="选择日期时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                :picker-options="expireTimeOption"
              >
              </el-date-picker>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submit">提 交</el-button>
        </span>
      </el-dialog>
      <el-dialog title="修改计划" :visible.sync="updatePlanShow" width="40%">
        <div>
          <el-form ref="form" :model="updatePlanForm" label-width="140px">
            <el-form-item label="认证项目">
              <el-input v-model="updatePlanForm.content"></el-input>
            </el-form-item>
            <el-form-item label="四大标准">
              <el-select v-model="updatePlanForm.dirId" filterable placeholder="请选择">
                <el-option v-for="item in directory" :key="item.id" :label="item.dirName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="被收集单位负责人">
              <el-input v-model="updatePlanForm.depPrincipal"></el-input>
            </el-form-item>
            <el-form-item label="计划完成时间">
              <el-date-picker
                v-model="updatePlanForm.planTime"
                type="datetime"
                placeholder="选择日期时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                :picker-options="expireTimeOption"
              >
              </el-date-picker>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="updatePlanCancel">取 消</el-button>
          <el-button type="primary" @click="updatePlanSubmit">提 交</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import dcsApi from '@/api/dcs'
import { getUserAuthAllInfo, getUsersByGroupCode } from '@/api/user'
import { hasRole } from '@/utils/permissions'

export default {
  data () {
    return {
      updatePlanShow: false,
      updatePlanForm: {
        id: '',
        content: '',
        dirId: '',
        depPrincipal: '',
        planTime: ''
      },
      numFirst: 0,
      numSecond: 0,
      numThird: 0,
      numFourth: 0,
      numFifth: 0,
      numSixth: 0,
      activeName: 'first',
      title: '',
      visible: false,
      timeUpdateShow: false,
      timeChoseShow: false,
      planShow: false,
      planGatherShow: false,
      formUpdate: {
        time: '',
        planId: '',
        userId: '',
        operaId: '',
        checkUsers: []
      },
      formChoose: {
        time: '',
        planId: '',
        userId: '',
        operaId: '',
        checkUsers: []
      },
      form: {
        content: '',
        dirId: '',
        gatherTime: '',
        depPrincipal: ''
      },
      gatherForm: {
        planId: '',
        gatherTime: '',
        authUsers: []
      },
      directory: [],
      userData: [],
      tableData: [],
      userList: [],
      expireTimeOption: {
        disabledDate (date) {
          // disabledDate 文档上：设置禁用状态，参数为当前日期，要求返回 Boolean
          return date.getTime() < Date.now() - 24 * 60 * 60 * 1000
        }
      },
      tabIndex: 0,
      tabTableData: [],
      filterData: [],
      finishTableData: [],
      sort: ['descending'],
      todoTodayList: []
    }
  },
  created () {
    this.activeName = 'first'
    // 获取登录用户及其权限
    this.userData = this.$store.state.user.info
    getUserAuthAllInfo(this.userData.id).then(res => {
      this.userData.role = res.data
    })
    // 初始化页面数据
    this.initData()
    this.initNum(1)
    this.initNum(2)
    this.initNum(3)
    this.initNum(4)
    dcsApi.getDir().then(res => {
      this.directory = res.data
    })

    dcsApi.getFinishedPlan().then(res => {
      this.finishTableData = res.data
      this.numSixth = res.data.length
    })

    // 获取模块所有相关用户
    getUsersByGroupCode('DCS').then(res => {
      this.userList = res.data
      res.data.forEach((item) => {
        this.filterData.push({
          text: item.con_name,
          value: item.id
        })
      })
    })
  },
  methods: {
    filterPlanGather (value, row) {
        if (row.gUserId === value) {
          return true
        }
    },
    // 认证人过滤
    filterPlanAuth (value, row) {
      if (row.authUsers !== null) {
        if (row.authUsers.length !== 0) {
          for (var i = 0; i < row.authUsers.length; i++) {
            if (row.authUsers[i].id === value) {
              return true
            }
          }
        }
      }
    },
    // 稽查人过滤
    filterPlanCheck (value, row) {
      if (row.checkUsers !== null) {
        if (row.checkUsers.length !== 0) {
          for (var i = 0; i < row.checkUsers.length; i++) {
            if (row.checkUsers[i].id === value) {
              return true
            }
          }
        }
      }
    },
    // 标签页点击事件
    handleClick (tab) {
      this.tabIndex = tab.index

      switch (tab.index) {
        case '0':
          this.initData()
          break
        case '5':
          dcsApi.getFinishedPlan().then(res => {
            this.finishTableData = res.data
            this.numSixth = res.data.length
          })
          break
        case '6':
          this.initUserPlan(this.userData.id)
          break
        default:
          this.initDataDir(this.tabIndex)
      }
    },
    // 确认完成的三个方法 index === 1 代表 收集资料 2 代表认证
    verify (row, index) {
      this.$confirm('是否确认完成?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        switch (index) {
          case 1:
            // 收集资料阶段, 可确认完成的人为： 计划发起人 或 系统管理员
            if (row.gUserId === this.userData.id || hasRole('susys')) {
              this.sure(row.id, this.userData.id, index)
            }
            break
          case 2:
            // 审核阶段，可确认完成的人：  指定的核查人员 或 系统管理员
            if ((row.aUserId.indexOf(this.userData.id.toString() + ',') > -1) || hasRole('susys')) {
              this.sure(row.id, this.userData.id, index)
            }
            break
        }

        this.$message('无权限操作')
      })
    },
    // 确认完成 请求后台方法
    sure (id, userId, index) {
      dcsApi.verify(id, userId, index).then(res => {
        if (res.code === 0) {
          this.$message.success('操作成功')
        } else {
          this.$message.error('操作失败')
        }

        if (this.tabIndex !== 0 && this.tabIndex !== 6) {
          this.initDataDir(this.tabIndex)
          return true
        } else if (this.tabIndex === 6) {
          this.initUserPlan(this.userData.id)
          return true
        } else {
          this.initData()
          return true
        }
      })
    },
    // 稽核通过的方法
    pass (row) {
      const that = this
      const form = {
        planId: row.id,
        userId: this.userData.id
      }
      if (hasRole('susys') || hasRole(['dcs_chk1', 'dcs_chk2', 'dcs_chk3', 'dcs_chk4'])) {
        that.operaPassCheck(form)
      }
      that.$message('无权限操作')
    },
    operaPassCheck (form) {
      const that = this
      dcsApi.checkPass(form).then(res => {
        this.$message({
          message: res.data,
          type: 'success'
        })
        if (that.tabIndex !== 0 && that.tabIndex !== 6) {
          that.initDataDir(that.tabIndex)
          return true
        } else if (that.tabIndex === 6) {
          that.initUserPlan(that.userData.user.id)
          return true
        } else {
          that.initData()
        }
      })
    },
    // 删除计划
    delPlan (row) {
      if (hasRole('susys') || row.gUserId === this.userData.id) {
        this.$confirm('是否确认完成?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          dcsApi.delPlan(row.id).then(res => {
            if (res.code === 0) {
              this.$message.success(res.msg)
              this.initData()
              if (this.tabIndex !== 0 && this.tabIndex !== 6) {
                this.initDataDir(this.tabIndex)
                return
              }
              this.initUserPlan(this.userData.id)
            } else {
              this.$message.error(res.msg)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
        return
      }
      this.$message('无权限操作')
    },
    updatePlanCancel () {
      this.updatePlanForm = {
        id: '',
        content: '',
        dirId: '',
        depPrincipal: '',
        planTime: ''
      }
      this.updatePlanShow = false
    },
    updatePlanSubmit () {
      dcsApi.updatePlan(this.updatePlanForm).then(res => {
        if (res.code === 0) {
          this.$message.success(res.msg)
        } else {
          this.$message.error(res.msg)
        }
        if (this.tabIndex !== 0 && this.tabIndex !== 6) {
          this.initDataDir(this.tabIndex)
        } else {
          this.initData()
        }
        this.initUserPlan(this.userData.id)
        this.updatePlanForm = {
          id: '',
          content: '',
          dirId: '',
          depPrincipal: '',
          planTime: ''
        }
        this.updatePlanShow = false
      })
    },
    // 修改计划时间弹框的所需三个方法
    updatePlan (row, index) {
      const that = this
      this.formUpdate.planId = row.id
      this.formUpdate.userId = this.userData.id
      this.formUpdate.operaId = index
      const planAuthUsers = []
      const planCheckUsers = []
      if (row.authUsers !== null) {
        for (const key in row.authUsers) {
          planAuthUsers.push(row.authUsers[key].id)
        }
      }
      if (row.checkUsers !== null) {
        for (const key in row.checkUsers) {
          planCheckUsers.push(row.checkUsers[key].id)
        }
      }
      if (index === 1) {
        // 修改计划内容
        if (hasRole('susys') || this.gUserId === this.userData.id) {
          this.updatePlanForm.id = row.id
          this.updatePlanForm.content = row.content
          this.updatePlanForm.dirId = row.dirId
          this.updatePlanForm.depPrincipal = row.depPrincipal
          this.updatePlanForm.planTime = row.planTime
          this.updatePlanShow = true
        }
        this.$message('无权限操作')
      } else if (index === 2) {
        // 修改计划审核认证时间
        if (hasRole('susys') || row.aUserId.indexOf(this.userData.id.toString() + ',')) {
          this.formUpdate.checkUsers = planAuthUsers
          this.title = '修改计划审核认证时间'
          this.timeUpdateShow = true
          return
        }
        this.$message({
          message: '无法操作'
        })
      } else if (index === 3) {
        // 修改计划稽核
        if (hasRole('susys') || hasRole(['dcs_chk1', 'dcs_chk2', 'dcs_chk3', 'dcs_chk4'])) {
          that.formUpdate.checkUsers = planCheckUsers
          this.title = '修改计划稽核时间'
          this.timeUpdateShow = true
          return
        }
        this.$message({
          message: '无法操作'
        })
      }
    },
    submitUpdateChose () {
      const that = this
      const index = this.formUpdate.operaId
      const form = {
        time: this.formUpdate.time,
        planId: this.formUpdate.planId,
        userId: this.formUpdate.userId,
        checkUsers: this.formUpdate.checkUsers
      }
      if (form.time === null || form.time === '') {
        this.$message({
          message: '请选择计划时间',
          type: 'warning'
        })
        return true
      }
      if (form.checkUsers.length <= 0) {
        this.$message({
          message: '请选择人员',
          type: 'warning'
        })
        return true
      }
      if (index === 2) {
        dcsApi.updatePlanAuth(form).then(res => {
          this.$message({
            message: res.data,
            type: 'success'
          })
          that.timeUpdateShow = false
          that.initForm()
          if (that.tabIndex !== 0 && that.tabIndex !== 6) {
            that.initDataDir(that.tabIndex)
            return true
          }
          that.initData()
          that.initUserPlan(that.userData.user.id)
        })
      } else if (index === 3) {
        dcsApi.updatePlanCheck(form).then(res => {
          this.$message({
            message: res.data,
            type: 'success'
          })
          that.timeUpdateShow = false
          that.initForm()
          if (that.tabIndex !== 0 && that.tabIndex !== 6) {
            that.initDataDir(that.tabIndex)
            return true
          }
          that.initUserPlan(that.userData.user.id)
          that.initData()
        })
      }
    },
    cancelUpdateChose () {
      this.initForm()
      this.timeUpdateShow = false
    },
    // index 代表点击的什么按钮 1.审核认证 2.稽核
    // 添加稽核计划弹框的所需三个方法
    addAuthPlan (row) {
      this.formChoose.planId = row.id
      this.formChoose.userId = this.userData.id

      if (row.authActualTime === null) {
        this.$message({
          message: '请确认完成审核认证',
          type: 'warning'
        })
        return
      }

      if (hasRole('susys') || hasRole(['dcs_chk1', 'dcs_chk2', 'dcs_chk3', 'dcs_chk4'])) {
        this.timeChoseShow = true
        return
      }
      this.$message('无权限操作')
    },
    cancelChose () {
      this.initForm()
      this.timeChoseShow = false
    },
    submitChose () {
      const that = this
      const form = {
        time: this.formChoose.time,
        planId: this.formChoose.planId,
        userId: this.formChoose.userId,
        checkUsers: this.formChoose.checkUsers
      }
      if (form.time === null || form.time === '') {
        this.$message({
          message: '请选择计划时间',
          type: 'warning'
        })
        return true
      }
      if (form.checkUsers.length === 0) {
        this.$message({
          message: '请选择稽核人员',
          type: 'warning'
        })
        return true
      }
      dcsApi.addPlanCheck(form).then(res => {
        this.$message({
          message: res.data,
          type: 'success'
        })
        that.timeChoseShow = false
        that.initForm()
        that.initData()
        if (that.tabIndex !== 0 && that.tabIndex !== 6) {
          that.initDataDir(that.tabIndex)
          return true
        }
        that.initUserPlan(that.userData.id)
      })
    },
    // 添加计划弹框的所需三个方法
    addPlan () {
      // 权限判断
      if (hasRole('susys') || hasRole(['dcs_dir1', 'dcs_dir2', 'dcs_dir3', 'dcs_dir4'])) {
        this.planShow = true
        return
      }
      this.$message('无权操作')
    },
    cancel () {
      this.initForm()
      this.planShow = false
    },
    submit () {
      const form = {
        dirId: this.form.dirId,
        content: this.form.content.trim(),
        userId: this.userData.id,
        time: this.form.gatherTime,
        depPrincipal: this.form.depPrincipal.trim()
      }

      if (form.content === '' || form.content === null) {
        this.$message({
          message: '请填写认证内容',
          type: 'warning'
        })
        return true
      }
      if (form.dirId === 0 || form.dirId === '') {
        this.$message({
          message: '请选择认证项目',
          type: 'warning'
        })
        return true
      }
      if (form.depPrincipal === null || form.depPrincipal === '') {
        this.$message({
          message: '请选择部门负责人',
          type: 'warning'
        })
        return true
      }
      if (form.time === null || form.time === '') {
        this.$message({
          message: '请选择计划时间',
          type: 'warning'
        })
        return true
      }

      dcsApi.addPlan(form).then(res => {
        this.$message({
          message: res.msg,
          type: (res.code === 0) ? 'success' : 'error'
        })
        this.planShow = false
        this.initData()
        this.initForm()
      })
    },
    // 添加收集计划并设定认证计划时间弹框所需方法
    settingPlan (row) {
      if (row.actualTime === null) {
        this.$message({
          message: '请确认完成收集资料',
          type: 'warning'
        })
        return true
      }
      // 指定送审时间权限： 超管 或者 计划发起人
      if (hasRole('susys') || row.gUserId === this.userData.id) {
        this.planGatherShow = true
        this.gatherForm.planId = row.id
        return
      }
      this.$message({
        message: '无法操作'
      })
    },
    gatherSubmit () {
      const that = this
      const form = {
        userId: this.userData.id,
        time: this.gatherForm.gatherTime,
        authUsers: this.gatherForm.authUsers,
        planId: this.gatherForm.planId
      }

      if (form.authUsers.length === 0) {
        this.$message({
          message: '请选择审核人员',
          type: 'warning'
        })
        return true
      }
      if (form.time === null || form.time === '') {
        this.$message({
          message: '请选择计划送审时间',
          type: 'warning'
        })
        return true
      }
      dcsApi.addPlanAuth(form).then(res => {
        this.$message({
          message: res.data,
          type: 'success'
        })
        that.planGatherShow = false
        that.initData()
        that.initForm()
        if (that.tabIndex !== 0 && that.tabIndex !== 6) {
          that.initDataDir(that.tabIndex)
          return true
        }
        that.initUserPlan(that.userData.id)
      })
    },
    gatherCancel () {
      this.initForm()
      this.planGatherShow = false
    },

    // 初始化数据
    initData () {
      dcsApi.getPlan().then(res => {
        this.tableData = res.data
        this.tableData.forEach(item => {
          item['dirName'] = item.directory.dirName
        })
        // 合并单元格
        this.tableData = this.mergeTableRow(this.tableData, ['dirName'])
        this.numFirst = res.count
      })
    },
    initDataDir (index) {
      dcsApi.getPlan(index).then(res => {
        this.tabTableData = res.data
      })
    },
    initNum (index) {
      dcsApi.countPlan(index).then(res => {
        if (index === 1) {
          this.numSecond = res.num
        } else if (index === 2) {
          this.numThird = res.num
        } else if (index === 3) {
          this.numFourth = res.num
        } else if (index === 4) {
          this.numFifth = res.num
        }
      })
    },
    initUserPlan (userId) {
      dcsApi.getUserPlan(userId).then(res => {
        this.todoTodayList = res.data
      })
    },
    // 将表单的值重置
    initForm () {
      this.formUpdate = {
        time: '',
        planId: '',
        userId: '',
        operaId: '',
        checkUsers: []
      }
      this.formChoose = {
        time: '',
        planId: '',
        userId: '',
        operaId: '',
        checkUsers: []
      }
      this.form = {
        content: '',
        dirId: '',
        gatherTime: '',
        depPrincipal: ''
      }
      this.gatherForm = {
        planId: '',
        gatherTime: '',
        authUsers: []
      }
    },
    // 合并单元格
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      const span = column['property'] + '-span'
      if (row[span]) {
        return row[span]
      }
    },
    mergeTableRow (data, merge) {
      if (!merge || merge.length === 0) {
        return data
      }
      merge.forEach(m => {
        const mList = {}
        data = data.map((v, index) => {
          const rowVal = v[m]
          if (mList[rowVal] && mList[rowVal].newIndex === index) {
            mList[rowVal]['num']++
            mList[rowVal]['newIndex']++
            data[mList[rowVal]['index']][m + '-span'].rowspan++
            v[m + '-span'] = {
              rowspan: 0,
              colspan: 0
            }
          } else {
            mList[rowVal] = { num: 1, index: index, newIndex: index + 1 }
            v[m + '-span'] = {
              rowspan: 1,
              colspan: 1
            }
          }
          return v
        })
      })
      return data
    },
    // 设置单元格样式
    cellStyle ({ row, columnIndex }) {
      if (columnIndex === 4) {
        if (row.planTime !== null && row.actualTime === null) {
          if (this.calendarLt(row.planTime)) {
            return 'background-color: #F56C6C'
          } else if (this.calendarSame(row.planTime)) {
            return 'background-color: #67C23A'
          }
          return null
        }
      }
      if (columnIndex === 8) {
        if (row.authPlanTime !== null && row.authActualTime === null) {
          if (this.calendarLt(row.authPlanTime)) {
            return 'background-color: #F56C6C'
          } else if (this.calendarSame(row.authPlanTime)) {
            return 'background-color: #67C23A'
          }
          return null
        }
      }
      if (columnIndex === 11) {
        if (row.checkPlanTime !== null) {
          if (this.calendarLt(row.checkPlanTime)) {
            return 'background-color: #F56C6C'
          } else if (this.calendarSame(row.checkPlanTime)) {
            return 'background-color: #67C23A'
          }
          return null
        }
      }
    },
    // 其他tab中的数据操作
    cellStyleTab ({ row, columnIndex }) {
      if (columnIndex === 3) {
        if (row.planTime !== null && row.actualTime === null) {
          if (this.calendarLt(row.planTime)) {
            return 'background-color: #F56C6C'
          } else if (this.calendarSame(row.planTime)) {
            return 'background-color: #67C23A'
          }
          return null
        }
      }
      if (columnIndex === 7) {
          if (row.authPlanTime !== null && row.authActualTime === null) {
            if (this.calendarLt(row.authPlanTime)) {
              return 'background-color: #F56C6C'
            } else if (this.calendarSame(row.authPlanTime)) {
              return 'background-color: #67C23A'
            }
            return null
          }
      }
      if (columnIndex === 10) {
        if (row.checkPlanTime !== null) {
          if (this.calendarLt(row.checkPlanTime)) {
            return 'background-color: #F56C6C'
          } else if (this.calendarSame(row.checkPlanTime)) {
            return 'background-color: #67C23A'
          }
          return null
        }
      }
    },
    // 表头颜色
    tableHeaderColor ({ row, rowIndex, columnIndex }) {
      if (rowIndex === 0 && columnIndex === 3) {
        return 'background-color: #20D7A0;text-align:center;font-size:16;color:black;'
      } else if (rowIndex === 0 && columnIndex === 4) {
        return 'background-color: #ffff66;text-align:center;font-size:16;color:black;'
      } else if (rowIndex === 0 && columnIndex === 5) {
        return 'background-color: #AD89A7;text-align:center;font-size:16;color:black;'
      }
      if (rowIndex === 1 && columnIndex === 0) {
        return 'background-color: #20D7A0;text-align:center;font-size:16;color:black;'
      } else if (rowIndex === 1 && columnIndex === 1) {
        return 'background-color: #20D7A0;text-align:center;font-size:16;color:black;'
      } else if (rowIndex === 1 && columnIndex === 2) {
        return 'background-color: #20D7A0;text-align:center;font-size:16;color:black;'
      } else if (rowIndex === 1 && columnIndex === 3) {
        return 'background-color: #20D7A0;text-align:center;font-size:16;color:black;'
      } else if (rowIndex === 1 && columnIndex === 4) {
        return 'background-color: #20D7A0;text-align:center;font-size:16;color:black;'
      } else if (rowIndex === 1 && columnIndex === 5) {
        return 'background-color: #ffff66;text-align:center;font-size:16;color:black;'
      } else if (rowIndex === 1 && columnIndex === 6) {
        return 'background-color: #ffff66;text-align:center;font-size:16;color:black;'
      } else if (rowIndex === 1 && columnIndex === 7) {
        return 'background-color: #ffff66;text-align:center;font-size:16;color:black;'
      } else if (rowIndex === 1 && columnIndex === 8) {
        return 'background-color: #AD89A7;text-align:center;font-size:16;color:black;'
      } else if (rowIndex === 1 && columnIndex === 9) {
        return 'background-color: #AD89A7;text-align:center;font-size:16;color:black;'
      } else if (rowIndex === 1 && columnIndex === 10) {
        return 'background-color: #AD89A7;text-align:center;font-size:16;color:black;'
      }
    },
    tabTableHeaderColor ({ row, rowIndex, columnIndex }) {
      if (rowIndex === 0 && columnIndex === 2) {
        return 'background-color: #20D7A0;text-align:center;font-size:16;color:black;'
      } else if (rowIndex === 0 && columnIndex === 3) {
        return 'background-color: #ffff66;text-align:center;font-size:16;color:black;'
      } else if (rowIndex === 0 && columnIndex === 4) {
        return 'background-color: #AD89A7;text-align:center;font-size:16;color:black;'
      }
      if (rowIndex === 1 && columnIndex === 0) {
        return 'background-color: #20D7A0;text-align:center;font-size:16;color:black;'
      } else if (rowIndex === 1 && columnIndex === 1) {
        return 'background-color: #20D7A0;text-align:center;font-size:16;color:black;'
      } else if (rowIndex === 1 && columnIndex === 2) {
        return 'background-color: #20D7A0;text-align:center;font-size:16;color:black;'
      } else if (rowIndex === 1 && columnIndex === 3) {
        return 'background-color: #20D7A0;text-align:center;font-size:16;color:black;'
      } else if (rowIndex === 1 && columnIndex === 4) {
        return 'background-color: #20D7A0;text-align:center;font-size:16;color:black;'
      } else if (rowIndex === 1 && columnIndex === 5) {
        return 'background-color: #ffff66;text-align:center;font-size:16;color:black;'
      } else if (rowIndex === 1 && columnIndex === 6) {
        return 'background-color: #ffff66;text-align:center;font-size:16;color:black;'
      } else if (rowIndex === 1 && columnIndex === 7) {
        return 'background-color: #ffff66;text-align:center;font-size:16;color:black;'
      } else if (rowIndex === 1 && columnIndex === 8) {
        return 'background-color: #AD89A7;text-align:center;font-size:16;color:black;'
      } else if (rowIndex === 1 && columnIndex === 9) {
        return 'background-color: #AD89A7;text-align:center;font-size:16;color:black;'
      } else if (rowIndex === 1 && columnIndex === 10) {
        return 'background-color: #AD89A7;text-align:center;font-size:16;color:black;'
      }
    },
    // 日期判断 超过红色，当天绿色，其他无色
    calendarLt (str) {
      var date = new Date(str)
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var day = date.getDate()

      var calendar = new Date()
      var calYear = calendar.getFullYear()
      var calMonth = calendar.getMonth() + 1
      var calDay = calendar.getDate()

      if (year < calYear) {
        return true
      } else if (year === calYear && month < calMonth) {
        return true
      } else if (year === calYear && month === calMonth && day < calDay) {
        return true
      }

      return false
    },
    calendarSame (str) {
      var date = new Date(str)
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var day = date.getDate()

      var calendar = new Date()
      var calYear = calendar.getFullYear()
      var calMonth = calendar.getMonth() + 1
      var calDay = calendar.getDate()

      return year === calYear && month === calMonth && day === calDay
    }
  }
}
</script>

<style>
.num {
  text-align: center;
  font-weight: bolder;
  color: #67c23a;
}
.title {
  text-align: center;
  font-size: 14px;
  font-weight: bolder;
  /* color: #E6A23C; */
}
.el-scrollbar__view {
  max-height: 200px;
}
.el-card__body {
  padding: 0px;
}
.el-table .cell {
  color: black;
}
</style>
