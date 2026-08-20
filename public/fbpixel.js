/* Meta pixel bootstrap — BlackWater Web Pixel (1723469588699987).
   Kept as an external file rather than the inline snippet Meta hands you,
   because the site's CSP has no 'unsafe-inline' in script-src and an inline
   pixel would be blocked without any visible error. Same approach as
   leadpipe.js.

   Events:
     PageView — here, on load
     Lead     — fired from ApplyModal.jsx on a successful application submit
*/
!(function (f, b, e, v, n, t, s) {
  if (f.fbq) return
  n = f.fbq = function () {
    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
  }
  if (!f._fbq) f._fbq = n
  n.push = n
  n.loaded = !0
  n.version = '2.0'
  n.queue = []
  t = b.createElement(e)
  t.async = !0
  t.src = v
  s = b.getElementsByTagName(e)[0]
  s.parentNode.insertBefore(t, s)
})(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')

fbq('init', '1723469588699987')
fbq('track', 'PageView')
