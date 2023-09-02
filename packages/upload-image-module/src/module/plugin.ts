/*
 * @Author: haojiaping haojiaping@xiaohongshu.net
 * @Date: 2023-09-03 05:21:42
 * @LastEditors: haojiaping haojiaping@xiaohongshu.net
 * @LastEditTime: 2023-09-03 05:33:19
 * @FilePath: /wangEditor/packages/upload-image-module/src/module/plugin.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * @description editor 插件，重写 editor API
 * @author wangfupeng
 */

import { IDomEditor } from '@wangeditor/core'
import { isInsertImageMenuDisabled } from '@wangeditor/basic-modules'
import uploadImages from './upload-images'

function withUploadImage<T extends IDomEditor>(editor: T): T {
  const { insertData } = editor
  const newEditor = editor

  // 重写 insertData - 粘贴图片、拖拽上传图片
  newEditor.insertData = (data: DataTransfer) => {
    console.log('isInsertImageMenuDisabled(newEditor)----------->',isInsertImageMenuDisabled(newEditor))
    if (isInsertImageMenuDisabled(newEditor)) {
      insertData(data)
      return
    }

    // 如有 text ，则优先粘贴 text
    const text = data.getData('text/plain')
    console.log('data.getData(text/plain)--------->', text);
    
    if (text) {
      insertData(data)
      return
    }

    // 获取文件
    const { files } = data
    console.log('files------------>',files.length, files)
    if (files.length <= 0) {
      insertData(data)
      return
    }

    // 判断是否有图片文件（可能是其他类型的文件）
    const fileList = Array.prototype.slice.call(files)
    let _hasImageFiles = fileList.some(file => {
      const [mime] = file.type.split('/')
      return mime === 'image'
    })
    console.log('_hasImageFiles------------>', _hasImageFiles)
    if (_hasImageFiles) {
      // 有图片文件，则上传图片
      uploadImages(editor, files)
    } else {
      // 如果没有， 则继续 insertData
      insertData(data)
    }
  }

  // 返回 editor ，重要！
  return newEditor
}

export default withUploadImage
