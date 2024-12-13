//默认浏览器打开链接
export const openLink = (url) => {
  window.ipcRenderer.send('OPEN_LINK', url)
}

