import * as cheerio from 'cheerio'
import Request from '@layer0/core/router/Request'
import Response from '@layer0/core/router/Response'

export default function transformResponse(response: Response, request: Request) {
  if (response.body) {
    const $ = cheerio.load(response.body)

    // Those 2 scripts are added using server side transformation just for Proof of Concept purposes.
    // For production these scripts should be included in original website base code.
    $('head').append(`
      <script src="/__layer0__/cache-manifest.js" defer="defer"></script>
      <script src="/__layer0__/main.js" defer="defer"></script>
    `)
    
    // Home
    if (request.path == '/') {
    }

    response.body = $.html()
      .replace(/\?layer0\_dt\_pf\=1/g, '')
      .replace(/\=\"\/\//g, '="https://')
    // .replace(/https?:\/\/www\.nike\.com\//g, '/')
    // .replace(/https?:\/\/images\.footballfanatics\.com\//g, '/l0-image/')
  }
}
