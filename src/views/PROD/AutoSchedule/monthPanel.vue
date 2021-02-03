<!--
 * @Author: yanbuw1911
 * @Date: 2021-01-27 10:52:47
 * @LastEditTime: 2021-02-03 17:36:53
 * @LastEditors: yanbuw1911
 * @Description: 月看板
 * @FilePath: /sverp-front/src/views/PROD/AutoSchedule/monthPanel.vue
-->
<template>
  <div>
    <a-select placeholder="请选择生产线" style="width: 140px" v-model="prodLine">
      <a-select-option v-for="item in prodLines" :key="item.value" :value="item.value" :disabled="item.disabled">
        {{ item.label }}
      </a-select-option>
    </a-select>
    <a-month-picker placeholder="请选择月份" style="width: 120px" :disabled-date="disabledDate" v-model="prodDate" />
    <a-select v-model="schdMode">
      <a-select-option key="1" value="MAX_COST">最大耗时</a-select-option>
      <a-select-option key="2" value="SELF_COST">自身耗时</a-select-option>
    </a-select>
    <a-button
      title="查询"
      style="margin: 0 15px 0 8px;"
      shape="circle"
      type="primary"
      :loading="schdSearchLoading"
      :disabled="!prodLine || !prodDate"
      @click="handleSchdSearch"
    >
      <a-icon type="search" />
    </a-button>
    <gantt-elastic
      :options="options"
      :tasks="tasks"
      @tasks-changed="tasksUpdate"
      @options-changed="optionsUpdate"
      @dynamic-style-changed="styleUpdate"
      v-if="tasks.length"
    >
      <gantt-header slot="header" :options="options"></gantt-header>
    </gantt-elastic>
  </div>
</template>

<script>
import GanttElastic from 'gantt-elastic'
import GanttHeader from 'gantt-elastic-header'
import dayjs from 'dayjs'

import { autoSchedule } from '@/api/prod'

const taskListHeaderStyle = {
  'task-list-header-label': {
    'text-align': 'center',
    width: '100%'
  },
  'task-list-item-value-container': {
    'text-align': 'center',
    width: '100%'
  }
}
const options = {
  taskMapping: {
    progress: 'percent'
  },
  maxRows: 100,
  maxHeight: 600,
  title: {
    label: '',
    html: true
  },
  row: {
    height: 24
  },
  calendar: {
    hour: {
      display: true
    }
  },
  chart: {
    progress: {
      bar: true
    },
    expander: {
      display: true
    }
  },
  taskList: {
    expander: {
      straight: true
    },
    columns: [
      {
        id: 1,
        label: '序号',
        value: 'id',
        width: 60,
        style: taskListHeaderStyle
      },
      {
        id: 2,
        label: '名称',
        value: 'label',
        width: 200,
        expander: true,
        html: true,
        events: {
          click ({ data, column }) {
            alert('description clicked!\n' + data.label)
            console.log(column)
          }
        },
        style: taskListHeaderStyle
      },
      {
        id: 3,
        label: '开始于',
        html: true,
        value: task => task.start.substr(8),
        width: 90,
        style: taskListHeaderStyle
      },
      {
        id: 3,
        label: '完成于',
        html: true,
        value: task => task.end.substr(8),
        width: 90,
        style: taskListHeaderStyle
      },
      {
        id: 4,
        label: '类型',
        value: 'category',
        width: 68,
        style: taskListHeaderStyle
      },
      {
        id: 5,
        label: '%',
        value: 'progress',
        width: 35,
        style: taskListHeaderStyle
      }
    ]
  },
  locale: {
    name: 'zh',
    weekdays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    Now: '当前',
    'X-Scale': 'X轴缩放',
    'Y-Scale': 'Y轴缩放',
    'Task list width': '任务栏大小',
    'Before/After': '时间范围',
    'Display task list': '显示任务栏'
  }
}

export default {
  name: 'MonthPanel',
  components: {
    GanttElastic,
    GanttHeader
  },
  data () {
    return {
      tasks: [],
      options,
      dynamicStyle: {},
      prodLine: void 0,
      prodLines: [
        {
          label: '制八线皮带',
          value: 'N'
        },
        {
          label: '制九线皮夹',
          value: 'V'
        }
      ],
      schdSearchLoading: false,
      schdMode: 'MAX_COST',
      prodDate: null
    }
  },
  methods: {
    /**
     * @description: 禁止选择的日期
     * @param moment current
     * @return moment
     */
    disabledDate (current) {
      // 只能选择 ± 1
      return (
        current &&
        (current <
          dayjs()
            .add(-2, 'years')
            .endOf('year') ||
          current >
            dayjs()
              .add(1, 'years')
              .endOf('year'))
      )
    },
    async handleSchdSearch () {
      this.schdSearchLoading = true
      const date = dayjs(this.prodDate).format('YYYY-MM')
      this.options.title.label = `<span style="color: rgb(240, 40, 46, 0.747); text-shadow: 2px 5px 15px rgb(240, 9, 1, 0.547); text-decoration: underline; font-weight: 900; font-family: Tahoma, Helvetica, Arial, '\\5b8b\\4f53', sans-serif;">${date} ${
        this.prodLines.find(e => e.value === this.prodLine).label
      } 月看板</span>`

      await autoSchedule(this.prodLine, date, this.schdMode)
        .then(res => {
          if (res.result) {
            if (res.data.length) {
              const data = res.data
                .map((e, i) => {
                  return {
                    id: i + 1,
                    label: `${e.ppi_customer_no} - ${e.ppi_prd_item} - ${e.ppi_customer_pono}`,
                    start: e.phases[0].ppi_phs_start,
                    end: e.phases.pop().ppi_phs_complete,
                    duration:
                      dayjs(e.phases.pop().ppi_phs_complete).valueOf() - dayjs(e.phases[0].ppi_phs_start).valueOf(),
                    category: '生产项目',
                    type: 'project',
                    percent: 0,
                    collapsed: true,
                    phases: e.phases
                  }
                })
                .reduce((prev, curr) => {
                  const arr = curr.phases.map((e, i) => {
                    return {
                      id: `${curr.id} - ${i + 1}`,
                      parentId: curr.id,
                      label: e.map_ppi_phs || e.map_ppi_phs_desc,
                      start: e.ppi_phs_start,
                      end: e.ppi_phs_complete,
                      duration: dayjs(e.ppi_phs_complete).valueOf() - dayjs(e.ppi_phs_start).valueOf(),
                      category: '生产工站',
                      type: 'task',
                      percent: 0
                    }
                  })

                  delete curr.phases

                  return [...prev, curr, ...arr]
                }, [])
              this.tasks = data
            } else {
              this.$message.info('暂无数据')
            }
          }
        })
        .catch(() => {})
      this.schdSearchLoading = false
    },
    tasksUpdate (tasks) {
      this.tasks = tasks
    },
    optionsUpdate (options) {
      this.options = options
    },
    styleUpdate (style) {
      this.dynamicStyle = style
    }
  }
}
</script>
