import { CACHE_ASSETS } from './cache'
import { Router } from '@layer0/core/router'
import shoppingFlowRouteHandler from './shoppingFlowRouteHandler'

export default new Router()

  // Layer0 files
  .match('/service-worker.js', ({ serviceWorker }) => serviceWorker('dist/service-worker.js'))
  .match('/l0_main.js', ({ serveStatic, cache }) => {
    cache(CACHE_ASSETS)
    serveStatic('dist/browser.js')
  })

  // Home page
  .match('/', shoppingFlowRouteHandler)
  .match('/:suffix/', shoppingFlowRouteHandler)

  // PLP page
  .match('/:suffix/w/:path*', shoppingFlowRouteHandler)
  .match('/w/:path*', shoppingFlowRouteHandler)

  // PDP page
  .match('/:suffix/launch/:path*', shoppingFlowRouteHandler)
  .match('/launch/:path*', shoppingFlowRouteHandler)

  // example route for cacheable assets:
  .match('/images/:path*', ({ cache, proxy }) => {
    cache(CACHE_ASSETS)
    return proxy('origin')
  })

  // .match('/l0-api/:path*', ({ cache, proxy }) => {
  //   cache(CACHE_ASSETS)
  //   proxy('api', {
  //     path: ':path*',
  //     transformResponse: (response) => {
  //       if (response.body){
  //         response.body = response.body
  //           .toString()
  //           .replace(/https:\/\/cdn\.imagecdn\.com/g, '/l0-image')
  //       }
  //     },
  //   })
  // })

  // If not found at any of above, but is an asset, cache it.
  .match(
    '/:path*/:file.:ext(js|mjs|css|png|ico|svg|jpg|jpeg|gif|ttf|woff|otf)',
    ({ cache, removeUpstreamResponseHeader, proxy, setResponseHeader }) => {
      setResponseHeader('cache-control', 'public, max-age=86400')
      removeUpstreamResponseHeader('set-cookie')
      cache(CACHE_ASSETS)
      proxy('origin')
    }
  )

  // fallback route for all other requests:
  .fallback(({ proxy }) => {
    proxy('origin')
  })
