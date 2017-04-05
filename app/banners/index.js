import window from 'window'
import 'iframify'
const iframify = window.iframify
import LazyShow from '../lazyshow'
import 'peppermint'
import $ from 'jquery'

$(() => {
  const lazy = window.lazy_iframify = new LazyShow({
    container: document.querySelector('.peppermint'),
    selector: '.js-banner-container',
  })

  $('.peppermint').Peppermint({ // eslint-disable-line
    onSlideChange(i) {
      // get all the frames
      const $banners = $('.js-banner-container').removeClass('is-prev is-current is-next')
      const $current = $($banners.get(i))
      $current.addClass('is-current')
      $current.prev().addClass('is-prev')
      $current.next().addClass('is-next')
      lazy.options.threshold = $banners.first().width()
      lazy.check()

      updateBanners()
    },
    onSetup() {
      lazy.check()
      updateBanners()
      setTimeout(updateBanners, 400)
    }
  })

  // loop through each of the banners and add the same classes to the iframes html element
  function updateBanners() {
    const $banners = $('.js-banner-container');
    // loop through each of the banners and add the same classes to the iframes html element
    $banners.each(function Frame() {
      $(this)
        .find('iframe')
        .contents()
        .find('.c-banner')
        .removeClass('is-prev is-current is-next')
        .addClass(this.className.replace(/-container/g, ''))
    })
  }

  lazy.on('visible', function Visible() {
    const $obj = $(this)
    const html = $obj.html()
    $obj.html('')
    let iframe = $('<div></div>')[0]
    $obj.append(iframe)


    iframe = iframify(iframe, { bodyExtra: html, htmlAttr: { class: 'c-banner-html' } })

    const $iframe = $(iframe)
      .addClass('c-banner-container__iframe')
      .attr('allowfullscreen', 'true')
      .attr('sandbox', 'allow-scripts allow-pointer-lock allow-same-origin allow-popups allow-modals allow-forms')
      .attr('allowtransparency', 'true')

    $obj.addClass('is-loading')

    $iframe.on('load', () => {
      const $document = $iframe.contents();
      $document.find('[data-banner-src], [data-banner-srcset]')
        .each(function Image() {
          const $img = $(this)
          $img
            .attr('src', $img.attr('data-banner-src'))
            .removeAttr('data-banner-src')
            .attr('srcset', $img.attr('data-banner-srcset'))
            .removeAttr('data-banner-srcset')
        })
      $document.find('[data-banner-href]')
        .each(function Link() {
          const $link = $(this)
          $link
            .attr('href', $link.attr('data-banner-href'))
            .removeAttr('data-banner-href')
        })
      $obj.addClass('is-loaded')
      setTimeout(() => $obj.removeClass('is-loading'), 1000)
      lazy.check()
    })
  })
})
