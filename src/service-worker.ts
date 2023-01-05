import { skipWaiting, clientsClaim } from 'workbox-core'
import { Prefetcher, prefetch } from '@edgio/prefetch/sw'
import DeepFetchPlugin, { DeepFetchCallbackParam } from '@edgio/prefetch/sw/DeepFetchPlugin'

skipWaiting()
clientsClaim()

new Prefetcher({
  plugins: [
    new DeepFetchPlugin([
      {
        selector: 'script',
        maxMatches: 20,
        attribute: 'src',
        as: 'script',
        callback: deepFetchAssets,
      },
      {
        selector: '[rel="stylesheet"]',
        maxMatches: 20,
        attribute: 'href',
        as: 'style',
        callback: deepFetchAssets,
      },
      {
        selector: '[rel="preload"]',
        maxMatches: 20,
        attribute: 'href',
        as: 'style',
        callback: deepFetchAssets,
      },
    ]),
  ],
}).route()
// .cache(/^https:\/\/(.*?)\.com\/.*/)
// .cache(/^https:\/\/(.*?)\.net\/.*/)

function deepFetchAssets({ $el, el, $ }: DeepFetchCallbackParam) {
  let urlTemplate = $(el).attr('href')
  if (urlTemplate) {
    console.log(`\n[][][][]\nPrefetching Asset: ${urlTemplate}\n[][][][]\n`)
    prefetch(urlTemplate)
  }
  urlTemplate = $(el).attr('src')
  if (urlTemplate) {
    console.log(`\n[][][][]\nPrefetching Asset: ${urlTemplate}\n[][][][]\n`)
    prefetch(urlTemplate)
  }
}
