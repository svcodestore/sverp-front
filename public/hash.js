/*
 * @Author: yanbuw1911
 * @Date: 2021-01-05 10:44:58
 * @LastEditTime: 2021-01-05 10:45:06
 * @LastEditors: yanbuw1911
 * @Description:
 * @FilePath: \client\public\hash.js
 */
self.importScripts('/spark-md5.min.js') // 导入脚本

// 生成文件 hash
self.onmessage = e => {
  const { fileChunkList } = e.data
  const spark = new self.SparkMD5.ArrayBuffer()
  let percentage = 0
  let count = 0
  const loadNext = index => {
    const reader = new FileReader()
    reader.readAsArrayBuffer(fileChunkList[index].file)
    reader.onload = e => {
      count++
      spark.append(e.target.result)
      if (count === fileChunkList.length) {
        self.postMessage({
          percentage: 100,
          hash: spark.end()
        })
        self.close()
      } else {
        percentage += 100 / fileChunkList.length
        self.postMessage({
          percentage
        })
        loadNext(count)
      }
    }
  }
  loadNext(0)
}
