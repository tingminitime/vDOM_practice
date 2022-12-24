import createElement from './createElement.js'
import render from './render.js'
import mount from './mount.js'
import diff from './diff.js'

// template
// const appDom = /* html */ `
// <div id="app">
//   <div class="container" style="display: flex; flex-direction: column; align-items: center;">
//     <button id="btn">Get a random number</button>
//     <div>Current count: {{ count }}</div>
//     <div class="imgContainer">
//       <!-- 隨機產生 0~10 個 image -->
//       <img src="./cat.jpg" alt="cat meme" style="width: 100px;">
//     </div>
//   </div>
// </div>
// `

// --- 使用 Proxy ---
const createVApp = function ({ count }) {
  return createElement('div', {
    attrs: {
      id: 'app',
      dataCount: count,
    },
    children: [
      createElement('div', {
        attrs: {
          class: 'container',
          style: 'display: flex; flex-direction: column; align-items: center;',
        },
        children: [
          createElement('button', {
            attrs: { id: 'btn', style: 'padding: 4px; font-size: 20px;' },
            children: [String('Get a random number')],
          }),
          createElement('div', {
            attrs: {
              style: 'padding: 12px 0; font-size: 20px;',
            },
            children: [String(`Current count: ${count}`)],
          }),
          createElement('div', {
            attrs: {
              class: 'imgContainer',
            },
            children: [
              ...Array.from({ length: count }, () =>
                createElement('img', {
                  attrs: {
                    src: './cat.jpg',
                    alt: 'cat meme',
                    style: 'width: 100px; margin: 4px 4px;',
                  },
                })
              ),
            ],
          }),
        ],
      }),
    ],
  })
}

const handler = {
  set: (obj, prop, value) => {
    obj[prop] = value

    const vNewApp = createVApp(obj)
    const patch = diff(vApp, vNewApp)
    $rootEl = patch($rootEl)
    vApp = vNewApp

    return true
  },
}

let data = { count: 0 }
const proxyData = new Proxy(data, handler)
console.log(proxyData)

// init
let vApp = createVApp(proxyData)
const $app = render(vApp)
let $rootEl = mount($app, document.getElementById('app'))

// Listener
const button = document.getElementById('btn')
button.addEventListener('click', () => {
  const newCount = Math.floor(Math.random() * 10)
  proxyData.count = newCount
})

// --- 使用 Timer ---
// const createVApp = function (count) {
//   // 產生最外層 id="app" 的 div 容器，所有更動都會掛載到這個 app 容器上
//   return createElement("div", {
//     attrs: {
//       id: "app",
//       'data-count': count,
//     },
//     children: [
//       // 產生一個容器 div
//       createElement("div", {
//         attrs: {
//           class: "container",
//           style: "display: flex; flex-direction: column; align-items: center;"
//         },
//         children: [
//           // 產生一個放文字的 div 容器
//           createElement("div", {
//             attrs: {
//               class: "countText",
//               style: "padding: 12px 0; font-size: 20px;"
//             },
//             children: [
//               // 產生一個描述圖片數量的文字
//               String(`Current count: ${count}`),
//             ]
//           }),
//           // 產生一個圖片 div 容器
//           createElement("div", {
//             attrs: {
//               class: "imgContainer"
//             },
//             children: [
//               // 產生 count 數量的 img DOM 物件
//               ...Array.from({ length: count }, (v, i) =>
//                 createElement("img", {
//                   attrs: {
//                     src: "./cat.jpg",
//                     alt: "cat meme",
//                     style: "width: 100px; margin: 4px 4px;",
//                     'data-index': i,
//                   }
//                 })
//               )
//             ]
//           }),
//         ]
//       }),
//     ]
//   })
// }

// let count = 0 // 預設 count 數量
// let vApp = createVApp(count) // 建立描述 DOM 物件
// const $app = render(vApp) // 將 DOM 物件轉換成實際的 Node
// let $rootEl = mount($app, document.getElementById("app")) // 將實際 Node 掛載到畫面上

// setInterval(() => {
//   count = Math.floor(Math.random() * 10) // 每秒隨機 0 ~ 10 數字
//   const vNewApp = createVApp(count) // 新的描述 DOM 物件
//   const patch = diff(vApp, vNewApp) // diff 回傳的函式用變數 patch 接住
//   $rootEl = patch($rootEl) // 使用 patch 函式更新 Node
//   // console.log($rootEl) // $rootEl 為實際 Node，是可以直接操作的
//   vApp = vNewApp // 更新描述 DOM 物件
// }, 3000)
