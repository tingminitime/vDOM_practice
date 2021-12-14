import createElement from "./createElement.js";
import render from "./render.js"
import mount from "./mount.js"
import diff from "./diff.js"

const createVApp = function (count) {
  return createElement("div", {
    attrs: {
      id: "app",
      dataCount: count,
    },
    children: [
      createElement("input"),
      String(`Current count: ${count}`),
      ...Array.from({ length: count }, () =>
        createElement("img", {
          attrs: {
            src: "https://picsum.photos/200/300?random=1"
          }
        })
      )
    ]
  })
}

let count = 0
let vApp = createVApp(count)
const $app = render(vApp)
let $rootEl = mount($app, document.getElementById("app"))

setInterval(() => {
  count = Math.floor(Math.random() * 10)
  const vNewApp = createVApp(count)
  const patch = diff(vApp, vNewApp)
  $rootEl = patch($rootEl)
  vApp = vNewApp
}, 1000)