export default {
  bind(el) {
    for (const attr of 'width,height,background,font-size,color'.split(',')) {
      if (attr in el.attributes) {
        const property = el.getAttribute(attr)
        el.style[attr] = property

        el.removeAttribute(attr)
      }
    }
  },
}
