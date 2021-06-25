<!--
 * @Author: yanbuw1911
 * @Date: 2021-06-03 11:09:07
 * @LastEditors: yanbuw1911
 * @LastEditTime: 2021-06-18 10:08:49
 * @Description: 劳保设置
 * @FilePath: /sverp-front/src/views/HRD/KPI/setting/JSTW_Commute/insuranceSetting.vue
-->
<template>
  <div>
    <sv-grid v-bind="gridOptions" v-on="gridEvts">
      <template #num1="{row, column}">
        {{ row[column.property] | fmtNum }}
      </template>
      <template #num2="{row, column}">
        {{ row[column.property] | fmtNum }}
      </template>
      <template #num3="{row, column}">
        {{ row[column.property] | fmtNum }}
      </template>
      <template #num4="{row, column}">
        {{ row[column.property] | fmtNum }}
      </template>
      <template #num5="{row, column}">
        {{ row[column.property] | fmtNum }}
      </template>
      <template #num6="{row, column}">
        {{ row[column.property] | fmtNum }}
      </template>
      <template #num7="{row}">
        {{ employeeSum(row) | fmtNum }}
      </template>
      <template #num8="{row}">
        {{ employerSum(row) | fmtNum }}
      </template>
      <template #num9="{row, column}">
        {{ row[column.property] | fmtNum }}
      </template>
    </sv-grid>
  </div>
</template>

<script>
import { getInsuranceDeduction, saveInsuranceDeductionOpt } from '@/api/jstw'

export default {
  filters: {
    fmtNum (val) {
      if (!val) {
        return val
      }

      return String(val).replace(/\d{1,3}(?=(\d{3})+(\.|$))/g, '$&,')
    }
  },
  data () {
    return {
      gridOptions: {
        height: 600,
        align: 'center',
        loading: false,
        showOverflow: false,
        showHeaderOverflow: false,
        toolDropdown: true,
        handleSaveOpt: saveInsuranceDeductionOpt,
        data: [],
        columns: [
          {
            type: 'seq',
            width: 60
          },
          {
            field: 'jci_level',
            title: '級數',
            editRender: {
              name: 'input'
            }
          },
          {
            field: 'jci_section',
            title: '投保級距',
            slots: { default: 'num9' },
            editRender: {
              name: 'input',
              attrs: {
                type: 'number'
              }
            }
          },
          {
            title: '勞保費（含就業保險費）',
            children: [
              {
                title: '不含「職業災害保險費」',
                children: [
                  {
                    field: 'jci_employee_bear_labor_insurance',
                    title: '勞工負擔',
                    slots: { default: 'num1' },
                    editRender: {
                      name: 'input',
                      attrs: {
                        type: 'number'
                      }
                    }
                  },
                  {
                    field: 'jci_employer_bear_labor_insurance',
                    title: '雇主負擔',
                    slots: { default: 'num2' },
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
            title: '工資墊償基金',
            children: [
              {
                field: 'jci_employer_bear_fund',
                title: '雇主負擔',
                slots: { default: 'num3' },
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
            title: '健保費',
            children: [
              {
                field: 'jci_employee_bear_health_insurance',
                title: '勞工負擔',
                slots: { default: 'num4' },
                editRender: {
                  name: 'input',
                  attrs: {
                    type: 'number'
                  }
                }
              },
              {
                field: 'jci_employer_bear_health_insurance',
                title: '雇主負擔',
                slots: { default: 'num5' },
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
            title: '勞工退休金',
            children: [
              {
                field: 'jci_employer_bear_pension',
                title: '雇主負擔',
                slots: { default: 'num6' },
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
            title: '勞健保及勞退負擔費用合計',
            children: [
              {
                field: 'jci_employee_bear_sum',
                title: '勞工負擔',
                slots: { default: 'num7' }
              },
              {
                field: 'jci_employer_bear_sum',
                title: '雇主負擔',
                slots: { default: 'num8' }
              }
            ]
          },
          {
            field: 'jci_remark',
            title: '備註',
            editRender: {
              name: 'input'
            }
          }
        ]
      },
      gridEvts: {
        refresh: this.getData
      }
    }
  },
  methods: {
    employeeSum (row) {
      return Number(row.jci_employee_bear_health_insurance) + Number(row.jci_employee_bear_labor_insurance)
    },
    employerSum (row) {
      return (
        Number(row.jci_employer_bear_sum) +
        Number(row.jci_employer_bear_pension) +
        Number(row.jci_employer_bear_health_insurance) +
        Number(row.jci_employer_bear_fund) +
        Number(row.jci_employer_bear_labor_insurance)
      )
    },
    async getData () {
      this.gridOptions.loading = true
      await getInsuranceDeduction()
        .then(({ result, data }) => {
          result && (this.gridOptions.data = data)
        })
        .catch(() => {
          this.gridOptions.loading = false
        })
      this.gridOptions.loading = false
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
