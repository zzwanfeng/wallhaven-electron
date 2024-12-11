// preload.js

const { ipcRenderer, contextBridge } = require('electron')

window.ipcRenderer = {
  // From render to main.
  send: (channel, args) => {
    ipcRenderer.send(channel, args);
  },
  on: (channel, listener) => {
    // Show me the prototype (use DevTools in the render thread)
    // Deliberately strip event as it includes `sender`.
    ipcRenderer.on(channel, (event, ...args) => listener(...args));
  },
  // From main to render.
  once: (channel, listener) => {
    // Show me the prototype (use DevTools in the render thread)
    // Deliberately strip event as it includes `sender`.
    ipcRenderer.once(channel, (event, ...args) => listener(...args));
  },
  // From render to main and back again.
  invoke: (channel, args) => {
    return ipcRenderer.invoke(channel, args);
  }
}

// // Exposed protected methods in the render process.
// contextBridge.exposeInMainWorld(
//   // Allowed 'ipcRenderer' methods.
//   'ipcRenderer', {
//   // From render to main.
//   send: (channel, args) => {
//     ipcRenderer.send(channel, args);
//   },
//   on: (channel, listener) => {
//     // Show me the prototype (use DevTools in the render thread)
//     // Deliberately strip event as it includes `sender`.
//     ipcRenderer.on(channel, (event, ...args) => listener(...args));
//   },
//   // From main to render.
//   once: (channel, listener) => {
//     // Show me the prototype (use DevTools in the render thread)
//     // Deliberately strip event as it includes `sender`.
//     ipcRenderer.once(channel, (event, ...args) => listener(...args));
//   },
//   // From render to main and back again.
//   invoke: (channel, args) => {
//     return ipcRenderer.invoke(channel, args);
//   }
// },
// );



// // 所有Node.js API都可以在预加载过程中使用。
// // 它拥有与Chrome扩展一样的沙盒。
// window.addEventListener('DOMContentLoaded', () => {
//   const replaceText = (selector, text) => {
//     const element = document.getElementById(selector)
//     if (element) element.innerText = text
//   }

//   for (const dependency of ['chrome', 'node', 'electron']) {
//     replaceText(`${dependency}-version`, process.versions[dependency])
//   }
// })