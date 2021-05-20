<!--
 * @Author: yanbuw1911
 * @Date: 2021-05-14 15:30:15
 * @LastEditors: yanbuw1911
 * @LastEditTime: 2021-05-20 09:22:18
 * @Description: 评分规则
 * @FilePath: /sverp-front/src/views/HRD/KPI/setting/scoreRule/index.vue
-->
<template>
  <div>
    <sv-grid v-bind="gridOptions" v-on="gridEvents">
      <template #rule>
        <div>
          <template v-for="(tag, index) in tags">
            <a-tooltip v-if="tag.content.length > 20" :key="tag.content" :title="tag.content">
              <a-tag
                :key="tag.content"
                :closable="index !== 0"
                :color="tag.color"
                @close="() => handleClose(tag.content)"
              >
                {{ `${tag.content.slice(0, 20)}...` }}
              </a-tag>
            </a-tooltip>
            <a-tag
              v-else
              :key="tag.content"
              :closable="index !== 0"
              :color="tag.color"
              @close="() => handleClose(tag.content)"
            >
              {{ tag.content }}
            </a-tag>
          </template>
          <a-input
            v-if="inputVisible"
            ref="input"
            type="text"
            size="small"
            :style="{ width: '78px' }"
            :value="inputValue"
            @change="handleInputChange"
            @blur="handleInputConfirm"
            @keyup.enter="handleInputConfirm"
          />
          <a-tag v-else style="background: #fff; borderStyle: dashed;" @click="showInput">
            <a-icon type="plus" /> 添加规则
          </a-tag>
        </div>
      </template>
    </sv-grid>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tagColor: [
        '#1890ff',
        '#13c2c2',
        '#ffc53d',
        '#73d13d',
        '#5B8FF9',
        '#61DDAA',
        '#65789B',
        '#F6BD16',
        '#6F5EF9',
        '#78D3F8',
        '#9661BC',
        '#F6903D',
        '#FFE0C7',
        '#008685',
        '#F08BB4',
        'pink',
        'red',
        'orange',
        'green',
        'cyan',
        'blue',
        'purple'
      ],
      tags: [
        { content: '150:2.1', color: 'red' },
        { content: '130:2.0', color: 'yellow' },
        { content: '120:1.9', color: 'pink' },
        { content: '90:95%', color: 'purple' },
        { content: '80:按實際分計算', color: 'purple' }
      ],
      inputVisible: false,
      inputValue: '',
      gridOptions: {
        height: 850,
        loading: false,
        border: 'inner',
        desc: '评分规则表格',
        data: [{ a: 'K006', b: '全厂', c: '直接人均效益比' }],
        expandConfig: {
          expandAll: true,
          labelField: 'a'
        },
        columns: [
          {
            type: 'expand',
            field: 'a',
            title: 'KPI 项目',
            slots: {
              content: 'rule'
            }
          },
          {
            field: 'c',
            title: 'KPI 名称'
          },
          {
            field: 'b',
            title: '使用单位'
          }
        ]
      },
      gridEvents: {}
    }
  },
  methods: {
    handleClose (removedTag) {
      const tags = this.tags.filter(tag => tag.content !== removedTag)
      console.log(tags)
      this.tags = tags
    },

    showInput () {
      this.inputVisible = true
      this.$nextTick(function () {
        this.$refs.input.focus()
      })
    },

    handleInputChange (e) {
      this.inputValue = e.target.value
    },

    handleInputConfirm () {
      const inputValue = this.inputValue
      let tags = this.tags
      if (inputValue && !tags.find(tag => tag.content === inputValue)) {
        tags = [
          ...tags,
          { content: inputValue, color: this.tagColor[(Math.random() * this.tagColor.length).toFixed(0)] }
        ]
      }
      console.log(tags)
      Object.assign(this, {
        tags,
        inputVisible: false,
        inputValue: ''
      })
    }
  }
}
</script>
