/*
 * @Author: yanbuw1911
 * @Date: 2020-12-14 13:44:22
 * @LastEditTime: 2020-12-14 14:32:52
 * @LastEditors: yanbuw1911
 * @Description: 自动完成可编辑单元格
 * @FilePath: \client\src\components\VxeTableExtend\autocomplete.js
 */

export default function VxeTableEditExtend (VXETable) {
  VXETable.renderer.add('autocomplete', {
    // 激活时自动聚焦
    autofocus: '.ant-select-search__field',
    // 可编辑激活模板
    renderEdit (h, renderOpts, { row, column }) {
      console.log(renderOpts)
      return [
        <a-auto-complete
          style="width: 100%;"
          v-model={row[column.property]}
          dataSource={['Burns Bay Road', 'Downing Street', 'Wall Street']}
          filterOption={function (input, option) {
            return option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0
          }}
        />
      ]
      // return [<input class="my-cell" text="text" v-model={row[column.property]} />]
    },
    // 可编辑显示模板
    renderCell (h, renderOpts, { row, column }) {
      return [<span>{row[column.property]}</span>]
    }
    // 导出模板，例如导出插槽中自定义的内容
    // exportMethod (params) {
    //   const { row, column } = params
    //   return '自定义内容'
    // }
  })
}
