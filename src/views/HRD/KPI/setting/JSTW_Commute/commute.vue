<!--
 * @Author: yanbuw1911
 * @Date: 2021-06-03 11:06:47
 * @LastEditors: yanbuw1911
 * @LastEditTime: 2021-06-18 11:33:12
 * @Description: 考勤代扣
 * @FilePath: /sverp-front/src/views/HRD/KPI/setting/JSTW_Commute/commute.vue
-->
<template>
  <div>
    <a-space>
      <a-select
        v-model="datetime"
        style="width: 160px"
        placeholder="历史版本查询"
        :loading="loading"
        @change="handleChange"
      >
        <a-select-option v-for="version in versions" :key="version" :value="version">
          {{ version }}
        </a-select-option>
        <a-select-option value="now">
          当前（新建）
        </a-select-option>
      </a-select>
      <a-button type="primary" ghost v-if="isShowSync" title="如数据异常，点击按钮来更新数据。">同步数据</a-button>
    </a-space>
    <a-divider v-if="isShowGrid" orientation="left">修改完成后，点击保存按钮提交给后台保存当前版本。</a-divider>
    <sv-grid v-bind="gridOptions" v-on="gridEvts" ref="grid" v-if="isShowGrid">
      <template #joinDate="{row, column}">
        {{ row[column.property] | datefmt }}
      </template>
      <template #jcd_estimated_labor_insurance="{row, column}">
        <a-auto-complete
          style="width: 100%;"
          :defaultOpen="true"
          :dropdown-style="{ width: '100%' }"
          v-model="row[column.property]"
          :filterOption="filterOption"
          @change="handleAutoComp"
        >
          <template #dataSource>
            <a-select-option
              v-for="(deduction, idx) in deductions"
              :key="idx"
              :title="deduction.jci_employee_bear_labor_insurance"
              :value="`${deduction.jci_section} - ${deduction.jci_employee_bear_labor_insurance}`"
            >
              {{ `${deduction.jci_section} - ${deduction.jci_employee_bear_labor_insurance}` }}
            </a-select-option>
          </template>
        </a-auto-complete>
      </template>
      <template #jcd_estimated_health_insurance="{row, column}">
        <a-auto-complete
          style="width: 100%;"
          :defaultOpen="true"
          :dropdown-style="{ width: '100%' }"
          v-model="row[column.property]"
          :filterOption="filterOption"
          @change="handleAutoComp"
        >
          <template #dataSource>
            <a-select-option
              v-for="(deduction, idx) in deductions"
              :key="idx"
              :title="deduction.jci_employee_bear_health_insurance"
              :value="`${deduction.jci_section} - ${deduction.jci_employee_bear_health_insurance}`"
            >
              {{ `${deduction.jci_section} - ${deduction.jci_employee_bear_health_insurance}` }}
            </a-select-option>
          </template>
        </a-auto-complete>
      </template>
      <template #jcd_estimated_dismiss_obtain="{row, column}">
        <a-auto-complete
          style="width: 100%;"
          :defaultOpen="true"
          :dropdown-style="{ width: '100%' }"
          v-model="row[column.property]"
          :filterOption="filterOption"
          @change="handleAutoComp"
        >
          <template #dataSource>
            <a-select-option
              v-for="(deduction, idx) in deductions"
              :key="idx"
              :title="deduction.jci_employer_bear_pension"
              :value="`${deduction.jci_section} - ${deduction.jci_employer_bear_pension}`"
            >
              {{ `${deduction.jci_section} - ${deduction.jci_employer_bear_pension}` }}
            </a-select-option>
          </template>
        </a-auto-complete>
      </template>
    </sv-grid>
  </div>
</template>

<script>
import { getInsuranceDeduction, saveDetailedDeductionOpt } from '@/api/jstw'

import moment from 'moment'

export default {
  filters: {
    datefmt (val) {
      return moment(val).format('YYYY/MM/DD')
    }
  },
  data () {
    return {
      datetime: void 0,
      loading: false,
      isShowGrid: false,
      isShowSync: false,
      versions: [],
      deductions: [],
      gridOptions: {
        align: 'center',
        height: 600,
        showOverflow: false,
        showHeaderOverflow: false,
        toolDropdown: true,
        loading: false,
        handleSaveOpt: saveDetailedDeductionOpt,
        data: [],
        columnConfig: {
          width: 90
        },
        columns: [
          {
            title: 'JSTW 核薪考勤代扣款月明細',
            children: [
              {
                title: '應出勤天數：',
                children: [
                  {
                    type: 'seq',
                    width: 60
                  },
                  {
                    field: 'jcd_staff_no',
                    title: '員工編號'
                  },
                  {
                    field: 'jcd_staff_name',
                    title: '姓名'
                  },
                  {
                    field: 'jcd_join_date',
                    title: '到職日期',
                    slots: {
                      default: 'joinDate'
                    },
                    editRender: {
                      name: '$input',
                      props: {
                        type: 'date',
                        placeholder: '请选择日期'
                      }
                    }
                  }
                ]
              },
              {
                title: '',
                children: [
                  {
                    field: 'jcd_join_date_month',
                    title: '當月到職日',
                    editRender: {
                      name: '$input',
                      props: {
                        type: 'date',
                        placeholder: '请选择日期'
                      }
                    }
                  },
                  {
                    field: 'jcd_leave_date',
                    title: '當月離職日',
                    editRender: {
                      name: '$input',
                      props: {
                        type: 'date',
                        placeholder: '请选择日期'
                      }
                    }
                  },
                  {
                    field: 'jcd_position_rank',
                    title: '職級',
                    editRender: {
                      name: 'input'
                    }
                  },
                  {
                    field: 'jcd_employ_status',
                    title: '直間',
                    editRender: {
                      name: 'input'
                    }
                  },
                  {
                    field: 'jcd_commute_days',
                    title: '本月在崗天數',
                    editRender: {
                      name: 'input',
                      attrs: {
                        type: 'number'
                      }
                    }
                  }
                ]
              },
              {
                title: '本月調班天數：',
                children: [
                  {
                    title: '加班前2H時數薪資(A)',
                    children: [
                      {
                        field: 'jcd_first2h_overtime',
                        title: '時數',
                        editRender: {
                          name: 'input',
                          attrs: {
                            type: 'number'
                          }
                        }
                      }
                    ]
                  },
                  {
                    title: '加班後2H時數薪資(B)',
                    children: [
                      {
                        field: 'jcd_later2h_overtime',
                        title: '時數',
                        editRender: {
                          name: 'input',
                          attrs: {
                            type: 'number'
                          }
                        }
                      }
                    ]
                  },
                  {
                    title: '假日加班8小時(前)',
                    children: [
                      {
                        field: 'jcd_dayoff_overtime',
                        title: '時數',
                        editRender: {
                          name: 'input',
                          attrs: {
                            type: 'number'
                          }
                        }
                      }
                    ]
                  },
                  {
                    title: '國定假日加班8小時',
                    children: [
                      {
                        field: 'jcd_holiday_overtime',
                        title: '時數',
                        editRender: {
                          name: 'input',
                          attrs: {
                            type: 'number'
                          }
                        }
                      }
                    ]
                  },
                  {
                    title: '特休換薪',
                    children: [
                      {
                        field: 'jcd_rest_overtime',
                        title: '時數',
                        editRender: {
                          name: 'input',
                          attrs: {
                            type: 'number'
                          }
                        }
                      }
                    ]
                  }
                ]
              },
              {
                title: '',
                children: [
                  {
                    title: '請假扣款明細(所得扣項)',
                    children: [
                      {
                        field: 'jcd_leave_time',
                        title: '事假時數',
                        editRender: {
                          name: 'input',
                          attrs: {
                            type: 'number'
                          }
                        }
                      },
                      {
                        field: 'jcd_sick_time',
                        title: '病假時數',
                        editRender: {
                          name: 'input',
                          attrs: {
                            type: 'number'
                          }
                        }
                      },
                      {
                        field: 'jcd_rest_time',
                        title: '特休',
                        editRender: {
                          name: 'input',
                          attrs: {
                            type: 'number'
                          }
                        }
                      },
                      {
                        field: 'jcd_paid_leave',
                        title: '有薪假',
                        editRender: {
                          name: 'input',
                          attrs: {
                            type: 'number'
                          }
                        }
                      },
                      {
                        field: 'jcd_unpaid_leave',
                        title: '無薪假時數',
                        editRender: {
                          name: 'input',
                          attrs: {
                            type: 'number'
                          }
                        }
                      }
                    ]
                  }
                ]
              },
              {
                field: 'jcd_meal_deduction',
                title: '餐費扣款',
                editRender: {
                  name: 'input',
                  attrs: {
                    type: 'number'
                  }
                }
              },
              {
                field: 'jcd_other_deduction',
                title: '其它扣項',
                editRender: {
                  name: 'input',
                  attrs: {
                    type: 'number'
                  }
                }
              },
              {
                field: 'jcd_dismiss_deduction',
                title: '勞退6%扣項',
                editRender: {
                  name: 'input',
                  attrs: {
                    type: 'number'
                  }
                }
              },
              {
                field: 'jcd_estimated_labor_insurance',
                title: '預估自付勞保費',
                editRender: {
                  name: 'input',
                  attrs: {
                    type: 'number'
                  }
                },
                slots: {
                  edit: 'jcd_estimated_labor_insurance'
                }
              },
              {
                field: 'jcd_labor_insurance',
                title: '實際自付勞保費',
                editRender: {
                  name: 'input',
                  attrs: {
                    type: 'number'
                  }
                }
              },
              {
                field: 'jcd_estimated_health_insurance',
                title: '預估自付健保費',
                editRender: {},
                slots: {
                  edit: 'jcd_estimated_health_insurance'
                }
              },
              {
                field: 'jcd_family_health_insurance',
                title: '健保費-眷屬',
                editRender: {
                  name: 'input',
                  attrs: {
                    type: 'number'
                  }
                }
              },
              {
                field: 'jcd_health_insurance',
                title: '實際自付健保費',
                editRender: {
                  name: 'input',
                  attrs: {
                    type: 'number'
                  }
                }
              },
              {
                field: 'jcd_estimated_dismiss_obtain',
                title: '預估勞退自提',
                editRender: {
                  name: 'input',
                  attrs: {
                    type: 'number'
                  }
                },
                slots: {
                  edit: 'jcd_estimated_dismiss_obtain'
                }
              },
              {
                field: 'jcd_dismiss_obtain',
                title: '實際自提勞退費',
                editRender: {
                  name: 'input',
                  attrs: {
                    type: 'number'
                  }
                }
              },
              {
                field: 'jcd_insured_amount',
                title: '投保金額',
                editRender: {
                  name: 'input',
                  attrs: {
                    type: 'number'
                  }
                }
              },
              {
                field: 'jcd_insured_days',
                title: '投保天數',
                editRender: {
                  name: 'input',
                  attrs: {
                    type: 'number'
                  }
                }
              },
              {
                field: 'jcd_remark',
                title: '備註',
                editRender: {
                  name: 'input'
                }
              }
            ]
          }
        ]
      },
      gridEvts: {
        refresh: this.getData
      }
    }
  },
  methods: {
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0
    },
    async handleChange (v) {
      if (!this.isShowGrid) {
        this.isShowGrid = true
      }
      if (v === 'now') {
        this.isShowSync = true
      }
    },
    async getData () {
      this.gridOptions.loading = true
      const invisiblePersons = ['JS0212', 'JS0016', 'JS0127', 'JS0153']
      await this.$axios
        .post('http://192.168.123.51:9600/webApi/test/dbfreader', this.$qs.stringify({ loc: 'JS' }))
        .then(res => {
          this.gridOptions.data = res
            .sort((a, b) => a.staffNo.substr(2) - b.staffNo.substr(2))
            .filter(e => !invisiblePersons.includes(e.staffNo))
            .map(e => {
              const o = {}
              o.jcd_staff_no = e.staffNo
              o.jcd_staff_name = e.name
              o.jcd_position_rank = e.positionRankCode
              return o
            })
        })
        .catch(() => {
          this.gridOptions.loading = false
        })
      this.gridOptions.loading = false
    },
    handleAutoComp (v) {
      const deduction = this.deductions.find(e => e.jci_section === v.split(' - ')[0])
      if (deduction) {
        this.$refs.grid.currRow.jcd_estimated_labor_insurance = `${deduction.jci_section} - ${deduction.jci_employee_bear_labor_insurance}`
        this.$refs.grid.currRow.jcd_estimated_health_insurance = `${deduction.jci_section} - ${deduction.jci_employee_bear_health_insurance}`
        this.$refs.grid.currRow.jcd_estimated_dismiss_obtain = `${deduction.jci_section} - ${deduction.jci_employer_bear_pension}`
      }
    }
  },
  async mounted () {
    await getInsuranceDeduction().then(({ result, data }) => {
      result && (this.deductions = data)
    })
  }
}
</script>
