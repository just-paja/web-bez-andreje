const mainIcon = 'web-bez-andreje.png'

function getReplacementUrl () {
  if (typeof global.chrome !== 'undefined') {
    return "chrome-extension://__MSG_@@" + global.chrome.runtime.id + "/" + mainIcon
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

module.exports = {
  replaceImages
}
