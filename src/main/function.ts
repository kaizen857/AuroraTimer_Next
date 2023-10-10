import {BrowserWindow, dialog,shell,screen,app,Notification} from "electron";
import os from "node:os";
import fs from 'fs'
import {join} from 'path'
import {checkAndMakeHomeDir, HomePath} from "../renderer/src/utils/LogUtil";
import {DefaultSetting, SettingFile} from "../renderer/src/utils/Setting";
import NotificationConstructorOptions = Electron.NotificationConstructorOptions;


let settingFilePath

let SettingObject

//stuip api
let windowState:boolean = false

export function windowOperate(event, op) {
  const webContents = event.sender
  const win = BrowserWindow.fromWebContents(webContents)
  switch (op) {
    case 'Min':
      if (!win.isMinimized())
        win.minimize();
      console.log('最小化')
      break;
    case 'Max':
      if( win.isFullScreen() ||windowState){
        win.setFullScreen(false)
        windowState = false
      }else {
        win.setFullScreen(true)
        windowState = true
      }
      break;
    case 'Close':
      win.close()
      console.log('关闭窗口')
      break
  }
}

export function loadSetting() {
  let curSetting:SettingFile
  settingFilePath = join(os.homedir(), '/AuroraTimer/setting.json')
  let buffer
  try{
    buffer = fs.readFileSync(settingFilePath)
  }catch (e) {
    if (e.errno === -4058){
      checkAndMakeHomeDir()
      try {
        //载入默认的用户信息和配置信息
        fs.writeFileSync(settingFilePath, JSON.stringify(DefaultSetting,null,2))
        buffer = SettingObject
      } catch (e) {
        console.error("创建文件失败",e)
        buffer = ''
      }
    }else {
      buffer = ''
    }
  }
  if(buffer){
    //加载出设置内容
    curSetting = JSON.parse(buffer.toString())
    if(!app.isPackaged){
      console.log(curSetting)
    }
    return curSetting
  }else return ''
}

export function SaveSetting(setting):boolean {
  try{
    fs.writeFileSync(settingFilePath,JSON.stringify(JSON.parse(setting),null,2))
  }catch (e) {
    console.error(e)
    return false
  }
  return true
}

export function openFile() {
  console.log("DIR:"+os.tmpdir())
  dialog.showOpenDialog({
    title: '请选择你喜欢的照片',
    //过滤文件后缀
    filters: [{
      name: 'img',
      extensions: ['jpg', 'png']
    }],
    //打开按钮
    buttonLabel: '确定',

    //回调结果渲染到img标签上
  }).then(result => {
    console.log(result)
    // fs.writeFileSync(os.homedir(),result.filePath[0])
  }).catch(err => {
    console.log(err)
  })
}

export function openBrowser(event,URL:string) {
  shell.openExternal(URL)
}

export function getMousePoint() {
  return screen.getCursorScreenPoint()
}
export function SysNotification(options?:NotificationConstructorOptions) {
  new Notification(options).show()
}




