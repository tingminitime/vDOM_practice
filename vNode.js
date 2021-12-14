import createElement from "./createElement.js";
import render from "./render.js"
import mount from "./mount.js"
import diff from "./diff.js"

// Proxy
const createVApp = function ({ count }) {
  return createElement("div", {
    attrs: {
      id: "app",
      dataCount: count,
    },
    children: [
      createElement("button", {
        attrs: { id: "btn" },
        children: [String('Get a random number')]
      }),
      String(`Current count: ${count}`),
      ...Array.from({ length: count }, () =>
        createElement("img", {
          attrs: {
            src: "https://picsum.photos/200/200?random=1"
          }
        })
      )
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
//       createElement("input"),
//       String(`Current count: ${count}`),
//       ...Array.from({ length: count }, () =>
//         createElement("img", {
//           attrs: {
//             src: "https://picsum.photos/200/300?random=1"
//           }
//         })
//       )
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