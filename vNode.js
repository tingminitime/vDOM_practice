import createElement from "./createElement.js";
import render from "./render.js"
import mount from "./mount.js"
import diff from "./diff.js"

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

// Proxy
const createVApp = function ({ count }) {
  return createElement("div", {
    attrs: {
      id: "app",
      dataCount: count,
    },
    children: [
      createElement("div", {
        attrs: {
          class: "container",
          style: "display: flex; flex-direction: column; align-items: center;"
        },
        children: [
          createElement("button", {
            attrs: { id: "btn", style: "padding: 4px; font-size: 20px;" },
            children: [String('Get a random number')]
          }),
          createElement("div", {
            attrs: {
              style: "padding: 12px 0; font-size: 20px;"
            },
            children: [
              String(`Current count: ${count}`),
            ]
          }),
          createElement("div", {
            attrs: {
              class: "imgContainer"
            },
            children: [
              ...Array.from({ length: count }, () =>
                createElement("img", {
                  attrs: {
                    src: "./cat.jpg",
                    alt: "cat meme",
                    style: "width: 100px; margin: 4px 4px;"
                  }
                })
              )
            ]
          }),
        ]
      }),
    ]
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
  }
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


// Timer
// const createVApp = function (count) {
//   return createElement("div", {
//     attrs: {
//       id: "app",
//       dataCount: count,
//     },
//     children: [
//       createElement("div", {
//         attrs: {
//           class: "container",
//           style: "display: flex; flex-direction: column; align-items: center;"
//         },
//         children: [
//           createElement("button", {
//             attrs: { id: "btn", style: "padding: 4px; font-size: 20px;" },
//             children: [String('Get a random number')]
//           }),
//           createElement("div", {
//             attrs: {
//               style: "padding: 12px 0; font-size: 20px;"
//             },
//             children: [
//               String(`Current count: ${count}`),
//             ]
//           }),
//           createElement("div", {
//             attrs: {
//               class: "imgContainer"
//             },
//             children: [
//               ...Array.from({ length: count }, () =>
//                 createElement("img", {
//                   attrs: {
//                     src: "./cat.jpg",
//                     alt: "cat meme",
//                     style: "width: 100px; margin: 4px 4px;"
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

// let count = 0
// let vApp = createVApp(count)
// const $app = render(vApp)
// let $rootEl = mount($app, document.getElementById("app"))

// setInterval(() => {
//   count = Math.floor(Math.random() * 10)
//   const vNewApp = createVApp(count)
//   const patch = diff(vApp, vNewApp)
//   $rootEl = patch($rootEl)
//   vApp = vNewApp
// }, 1000)