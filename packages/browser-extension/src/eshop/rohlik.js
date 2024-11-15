const { observe } = require('../observer')

function setup (highlight) {
  if (document.location.href.includes('rohlik')) {
    observe('body', () => {
      highlight.matchText('.whispererProductLink', '.Whisperer_productName')
      highlight.matchText('.productCard__wrapper', 'h4')
      highlight.matchText('#productDetail')
    })
  }
}

module.exports = {
  setup
}
