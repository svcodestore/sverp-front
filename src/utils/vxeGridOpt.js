/*
 * @Author: yanbuw1911
 * @Date: 2020-11-10 11:11:58
 * @LastEditTime: 2020-12-07 08:23:28
 * @LastEditors: yanbuw1911
 * @Description:
 * @FilePath: \client\src\utils\vxeGridOpt.js
 */
const getVxeGridOpt = (ref, originData, insertFn, updateFn) => {
  const { getInsertRecords, getRemoveRecords, getUpdateRecords } = ref
  const insertRecords = getInsertRecords()
  const removeRecords = getRemoveRecords()
  const updateRecords = getUpdateRecords()

  const fmtInsertRecords = {
    A: insertRecords.map(insertItem => {
      if (typeof insertFn === 'function') {
        return insertFn(insertItem)
      }
      const o = Object.assign({}, insertItem)
      delete o.id
      return o
    })
  }

  const fmtRmRecords = { D: { id: removeRecords.map(e => e.id) } }

  const fmtUpdateRecords = { U: [] }
  const columns = Array.from(ref.getTableColumn().collectColumn).map(e => e.property)
  updateRecords.forEach(updateRecord => {
    let updateFields = {}
    if (typeof updateFn === 'function') {
      updateFields = updateFn(updateRecord, columns)
    } else {
      const originRecord = originData.find(e => e.id === updateRecord.id)
      columns.forEach(key => {
        if (updateRecord[key] !== originRecord[key]) {
          updateFields[key] = updateRecord[key]
        }
      })
      if (typeof updateFn === 'object' && !Array.isArray(updateFn)) {
        updateFields = Object.assign(updateFields, updateFn)
      }
    }
    fmtUpdateRecords.U.push({ [updateRecord.id]: updateFields })
  })

  const optData = Object.assign({}, fmtInsertRecords, fmtRmRecords, fmtUpdateRecords)
  if (!insertRecords.length && !removeRecords.length && !updateRecords.length) {
    return false
  }
  return optData
}

export { getVxeGridOpt }
