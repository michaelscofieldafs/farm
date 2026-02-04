export function injectAnalytics() {
  if (typeof window === 'undefined') return

  /* ---------- Plausible ---------- */
  if (!window.plausible) {
    const ps = document.createElement('script')
    ps.async = true
    ps.src = 'https://plausible.io/js/pa-UH-j2ZwN6oMPAZmvM89sJ.js'
    document.head.appendChild(ps)

    window.plausible =
      window.plausible ||
      function () {
        ;(window.plausible.q = window.plausible.q || []).push(arguments)
      }

    window.plausible.init =
      window.plausible.init ||
      function (i) {
        window.plausible.o = i || {}
      }

    window.plausible.init()
  }

  /* ---------- Google Analytics ---------- */
  if (!window.gtag) {
    const gs = document.createElement('script')
    gs.async = true
    gs.src =
      'https://www.googletagmanager.com/gtag/js?id=G-FRGV9P05G6'
    document.head.appendChild(gs)

    window.dataLayer = window.dataLayer || []

    window.gtag = function () {
      window.dataLayer.push(arguments)
    }

    window.gtag('js', new Date())
    window.gtag('config', 'G-FRGV9P05G6')
  }
}
