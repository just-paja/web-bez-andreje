const mainIcon = 'web-bez-andreje.png'

function getReplacementUrl () {
  if (typeof global.chrome !== 'undefined') {
    return global.chrome.extension.getURL(mainIcon)
  }
  if (typeof global.safari !== 'undefined') {
    return `${global.safari.extension.baseURI}${mainIcon}`
  }
  return mainIcon
}

const replacementImageUrl = getReplacementUrl()

function replaceImages (node, _matchingBrand) {
  const images = node.querySelectorAll('img')
  for (const image of images) {
    if (image.src !== replacementImageUrl) {
      image.src = replacementImageUrl
    }
    if (image.srcset) {
      image.removeAttribute('srcset')
    }
  }
}

function replaceSources (node, _matchingBrand) {
  const sources = node.querySelectorAll('source')
  for (const source of sources) {
    if (source.srcset !== replacementImageUrl) {
      source.srcset = replacementImageUrl
    }
  }
}

module.exports = {
  replaceImages,
  replaceSources
}
