import { CACHE_ASSETS } from './cache'
import { Router } from '@layer0/core/router'
import shoppingFlowRouteHandler from './shoppingFlowRouteHandler'

export default new Router()

  // Layer0 Service Worker Files
  .match('/service-worker.js', ({ serviceWorker }) => {
    serviceWorker('dist/service-worker.js')
  })
  .match('/__layer0__/main.js', ({ serveStatic, cache }) => {
    cache(CACHE_ASSETS)
    serveStatic('dist/browser.js')
  })

  // Home page
  .match('/', shoppingFlowRouteHandler)

  // Matches pages nested to a one subroute
  // For e.g. /something/, /oops/
  .match('/:suffix/', shoppingFlowRouteHandler)

  // PLP page
  // Matches pages nested to any subroute inside /:suffix/w/
  // For e.g. /something/w/oops/haha/lol, /something/w/oops/haha/joking
  .match('/:suffix/w/:path*', shoppingFlowRouteHandler)

  // Matches pages nested to any subroute inside /w/
  // For e.g. //w/oops/haha/lol, /w/oops/haha/joking
  .match('/w/:path*', shoppingFlowRouteHandler)

  // PDP page
  .match('/:suffix/launch/:path*', shoppingFlowRouteHandler)
  .match('/launch/:path*', shoppingFlowRouteHandler)

  // Example route for cacheable assets
  .match('/images/:path*', ({ cache, proxy }) => {
    cache(CACHE_ASSETS)
    proxy('origin')
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

  // Matches any route that ends with js|mjs|css|png|ico|svg|jpg|jpeg|gif|ttf|woff|otf
  // Remove set-cookie (and updates cache-control) header to be able to cache these assets
  .match(
    '/:path*/:file.:ext(js|mjs|css|png|ico|svg|jpg|jpeg|gif|ttf|woff|otf)',
    ({ cache, proxy, removeUpstreamResponseHeader, setResponseHeader }) => {
      setResponseHeader('cache-control', 'public, max-age=86400')
      removeUpstreamResponseHeader('set-cookie')
      cache(CACHE_ASSETS)
      proxy('origin')
    }
  )

  // fallback route to origin for all other requests
  .fallback(({ proxy }) => {
    proxy('origin')
  })
