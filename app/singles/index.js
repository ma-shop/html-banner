import window from 'window'
import 'iframify'
const iframify = window.iframify
import LazyShow from '../lazyshow'
import $ from 'jquery'

$(() => {
  const lazy = window.lazy = new LazyShow({
    selector: '.js-banner-container',
  })

  lazy.on('visible', function Visible() {
    const $obj = $(this)
    $obj.find('[data-banner-src], [data-banner-srcset]')
      .each(function Image() {
        const $img = $(this)
        $img
          .attr('src', $img.attr('data-banner-src'))
          .removeAttr('data-banner-src')
          .attr('srcset', $img.attr('data-banner-srcset'))
          .removeAttr('data-banner-srcset')
      })
    $obj.find('[data-banner-href]')
      .each(function Link() {
        const $link = $(this)
        $link
          .attr('href', $link.attr('data-banner-href'))
          .removeAttr('data-banner-href')
      })


    const html = $obj.html()
    $obj.html('')
    let iframe = $('<div></div>')[0]
    $obj.append(iframe)


    iframe = iframify(iframe, { bodyExtra: html })

    const $iframe = $(iframe)
      .addClass('c-banner-container__iframe')

    $obj.addClass('is-loading is-current')

    $iframe.on('load', () => {
      $iframe
        .contents()
        .find('.c-banner')
        .addClass('is-loaded is-current');
      $obj.addClass('is-loaded')
      setTimeout(() => $obj.removeClass('is-loading'), 1000)
      lazy.check()
    })
  })
})
