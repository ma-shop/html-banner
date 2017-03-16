import $ from 'jquery'
import 'peppermint'


$(() => {
  $('.peppermint').Peppermint({ // eslint-disable-line
    onSlideChange: update,
    onSetup() {
      update()
      setTimeout(update, 600)
      setTimeout(update, 800)
    }
  })
})


function update(i = 0) {
  // get all the frames
  const $banner_containers = $('.js-banner-container').removeClass('is-prev is-current is-next')
  const $current = $($banner_containers.get(i))
  $current.addClass('is-current')
  $current.prev().addClass('is-prev')
  $current.next().addClass('is-next')

  // loop through each of the banners and add the same classes to the iframes html element
  $banner_containers.each(function Frame() {
    const $obj = $(this);
    const $document = $obj.find('iframe').contents()
    const fn = () => {
      $obj.addClass('is-loaded')
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
      $document
        .find('figure')
        .addClass(this.className.replace(/-container/g, ''))
    }
    if ($document[0].readyState === 'complete') {
      fn()
    } else {
      $document.one('load', fn)
    }
  })
}
