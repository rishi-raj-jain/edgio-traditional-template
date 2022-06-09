import { CACHE_PAGES } from './cache'
// import transformResponse from './transform'
import { RouteHandler } from '@layer0/core/router/Router'

const handler: RouteHandler = async ({ cache, removeUpstreamResponseHeader, setResponseHeader, updateResponseHeader, proxy }) => {
  cache(CACHE_PAGES)

  // Remove set-cookie header to make pages cacheable,
  // feel free to uncomment in case this is what is preventing
  // pages from being cached on Layer0

  // removeUpstreamResponseHeader('set-cookie')

  // Remove cache-control header to make pages cacheable,
  // OR
  // Update the cache-control header to make pages cacheable,
  // feel free to uncomment in case this is what is preventing
  // pages from being cached on Layer0

  // removeUpstreamResponseHeader('cache-control')
  // setResponseHeader('cache-control', 'public, max-age=86400')

  // Updating origin headers to point on Layer0 for user error/redirects
  updateResponseHeader('location', /https:\/\/nike\.com\//gi, '/')
  updateResponseHeader('location', /https:\/\/www\.nike\.com\//gi, '/')

  // While transformResponse let's you play with response on the serverless,
  // it might lead you to 539 timeout errors, hence all the transformation,
  // in an ideal case shall be done on the origin itself

  // proxy('origin', { transformResponse })
  proxy('origin')
}

export default handler
