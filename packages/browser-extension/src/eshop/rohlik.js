const { observe } = require('../observer')

function setup (highlight) {
  if (document.location.href.includes('rohlik')) {
    observe('body', () => {
      highlight.matchText('div[data-test="whisperer-product-wrapper"]', 'div[data-test="whisperer-product-name"]')
      highlight.matchText('div[data-test^="productCard-AVAILABLE"]', '[data-test="productCard-body-name"]')
      highlight.matchText('div[data-test^="productCard-UNAVAILABLE"]', '[data-test="productCard-body-name"]')
      highlight.matchText('#productDetail')
    })
  }
}

module.exports = {
  setup
}
