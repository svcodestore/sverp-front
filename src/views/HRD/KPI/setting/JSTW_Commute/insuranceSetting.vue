<!--
 * @Author: yanbuw1911
 * @Date: 2021-06-03 11:09:07
 * @LastEditors: yanbuw1911
 * @LastEditTime: 2021-06-03 15:59:22
 * @Description: 劳保设置
 * @FilePath: /sverp-front/src/views/HRD/KPI/setting/JSTW_Commute/insuranceSetting.vue
-->
<template>
  <div>
    <sv-grid v-bind="gridOptions" v-on="gridEvts"></sv-grid>
  </div>
</template>

<script>
export default {
  data () {
    return {
      gridOptions: {
        align: 'center',
        loading: false,
        data: [],
        columns: [
          {
            type: 'seq',
            width: 60
          },
          {
            filed: 'jci_level',
            title: '級數',
            editRender: {
              name: 'input'
            }
          },
          {
            field: 'jci_section',
            title: '投保級距',
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
                filed: 'jci_employer_bear_fund',
                title: '雇主負擔',
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
                editRender: {
                  name: 'input',
                  attrs: {
                    type: 'number'
                  }
                }
              },
              {
                field: 'jci_employer_bear_sum',
                title: '雇主負擔',
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
      gridEvts: {}
    }
  }
}
</script>
