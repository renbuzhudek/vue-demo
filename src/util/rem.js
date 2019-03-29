(function flexible (win) {
  const doc = win.document
  const docEl = doc.documentElement
  let tid
  let dpr = 0
  let scale = 0
  const metaEl = doc.querySelector('meta[name="viewport"]')

  if (metaEl) {
    const match = metaEl.getAttribute('content').match(/initial-scale=(\d\..+)/)
    if (match) {
      scale = parseFloat(match[1])
      dpr = parseInt(1 / scale)
    }
  }

  const isIphone = win.navigator.appVersion.match(/iphone/gi)
  const devicePixelRatio = win.devicePixelRatio
  if (isIphone) {
    if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {
      dpr = 3
    } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)) {
      dpr = 2
    } else {
      dpr = 1
    }
  }

  docEl.setAttribute('data-dpr', dpr)

  const refreshRem = function refreshRem () {
    let width = docEl.getBoundingClientRect().width
    if (width > 750) {
      width = 750
    } else if (width < 320) {
      width = 320
    }
    const rem = width / 3.75
    docEl.style.fontSize = rem + 'px'
  }

  win.addEventListener('resize', () => {
    clearTimeout(tid)
    tid = setTimeout(refreshRem, 300)
  }, false)

  win.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      clearTimeout(tid)
      tid = setTimeout(refreshRem, 300)
    }
  }, false)

  if (doc.readyState === 'complete') {
    doc.body.style.fontSize = '14px'
  } else {
    doc.addEventListener('DOMContentLoaded', () => {
      doc.body.style.fontSize = '14px'
    }, false)
  }

  refreshRem()
}(window))
