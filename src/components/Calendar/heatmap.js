const HeatmapConfig = {
  defaultRadius: 40,
  defaultRenderer: 'canvas2d',
  defaultGradient: {
    0.25: 'rgb(0,0,255)',
    0.55: 'rgb(0,255,0)',
    0.85: 'yellow',
    1.0: 'rgb(255,0,0)',
  },
  defaultMaxOpacity: 1,
  defaultMinOpacity: 0,
  defaultBlur: 0.85,
  defaultXField: 'x',
  defaultYField: 'y',
  defaultValueField: 'value',
  plugins: {},
}

class Store {
  constructor(config) {
    this._coordinator = {}
    this._data = []
    this._radi = []
    this._min = 10
    this._max = 1
    this._xField = config.xField || config.defaultXField
    this._yField = config.yField || config.defaultYField
    this._valueField = config.valueField || config.defaultValueField
    this._cfgRadius = config.radius || undefined // 使用解构赋值
  }

  // when forceRender = false -> called from setData, omits renderall event
  _organiseData(dataPoint, forceRender) {
    const x = dataPoint[this._xField]
    const y = dataPoint[this._yField]
    const { _data: store, _radi: radi } = this
    const max = this._max
    const min = this._min
    const value = dataPoint[this._valueField] || 1
    const radius = dataPoint.radius || this._cfgRadius || HeatmapConfig.defaultRadius

    if (!store[x]) {
      store[x] = []
      radi[x] = []
    }

    if (!store[x][y]) {
      store[x][y] = value
      radi[x][y] = radius
    } else {
      store[x][y] += value
    }
    const storedVal = store[x][y]

    if (storedVal > max) {
      if (!forceRender) {
        this._max = storedVal
      } else {
        this.setDataMax(storedVal)
      }
      return false
    } else if (storedVal < min) {
      if (!forceRender) {
        this._min = storedVal
      } else {
        this.setDataMin(storedVal)
      }
      return false
    } else {
      return {
        x,
        y,
        value,
        radius,
        min,
        max,
      }
    }
  }

  _unOrganizeData() {
    const unorganizedData = []
    const { _data: data, _radi: radi } = this

    for (const x in data) {
      for (const y in data[x]) {
        unorganizedData.push({
          x,
          y,
          radius: radi[x][y],
          value: data[x][y],
        })
      }
    }
    return {
      min: this._min,
      max: this._max,
      data: unorganizedData,
    }
  }

  _onExtremaChange() {
    this._coordinator.emit('extremachange', {
      min: this._min,
      max: this._max,
    })
  }

  addData(...dataArr) {
    if (dataArr[0].length > 0) {
      dataArr[0].forEach(dataPoint => this.addData(dataPoint))
    } else {
      // add to store
      const organisedEntry = this._organiseData(dataArr[0], true)
      if (organisedEntry) {
        // if it's the first datapoint initialize the extremas with it
        if (this._data.length === 0) {
          this._min = this._max = organisedEntry.value
        }
        this._coordinator.emit('renderpartial', {
          min: this._min,
          max: this._max,
          data: [organisedEntry],
        })
      }
    }
    return this
  }

  setData(data) {
    const dataPoints = data.data
    const pointsLen = dataPoints.length

    // reset data arrays
    this._data = []
    this._radi = []

    for (let i = 0; i < pointsLen; i++) {
      this._organiseData(dataPoints[i], false)
    }
    this._max = data.max
    this._min = data.min || 0

    this._onExtremaChange()
    this._coordinator.emit('renderall', this._getInternalData())
    return this
  }

  setDataMax(max) {
    this._max = max
    this._onExtremaChange()
    this._coordinator.emit('renderall', this._getInternalData())
    return this
  }

  setDataMin(min) {
    this._min = min
    this._onExtremaChange()
    this._coordinator.emit('renderall', this._getInternalData())
    return this
  }

  setCoordinator(coordinator) {
    this._coordinator = coordinator
  }

  _getInternalData() {
    return {
      max: this._max,
      min: this._min,
      data: this._data,
      radi: this._radi,
    }
  }

  getData() {
    return this._unOrganizeData()
  }
}

class Canvas2dRenderer {
  constructor(config) {
    this.shadowCanvas = document.createElement('canvas')
    this.canvas = config.canvas || document.createElement('canvas')
    this.renderBoundaries = [10000, 10000, 0, 0]

    const computedStyle = getComputedStyle(config.container) || {}

    this.canvas.className = 'heatmap-canvas'
    this._width = this.canvas.width = this.shadowCanvas.width = config.width || +computedStyle.width.replace(/px/, '')
    this._height = this.canvas.height = this.shadowCanvas.height = config.height || +computedStyle.height.replace(/px/, '')

    this.shadowCtx = this.shadowCanvas.getContext('2d', {
      willReadFrequently: true,
    })

    this.ctx = this.canvas.getContext('2d')

    this.canvas.style.cssText = this.shadowCanvas.style.cssText = 'position: absolute; left: 0; top: 0;'
    this.canvas.style.pointerEvents = 'none'
    this.canvas.style.opacity = 0.8
    config.container.style.position = 'relative'
    // config.container.style.position = 'sticky' // safari 可以使用 sticky 替代 relative 失效
    config.container.appendChild(this.canvas)

    this._palette = Canvas2dRenderer._getColorPalette(config)
    this._templates = {}

    this._setStyles(config)
  }

  static _getColorPalette(config) {
    const gradientConfig = config.gradient || config.defaultGradient
    const paletteCanvas = document.createElement('canvas')
    const paletteCtx = paletteCanvas.getContext('2d')

    paletteCanvas.width = 256
    paletteCanvas.height = 1

    const gradient = paletteCtx.createLinearGradient(0, 0, 256, 1)
    for (const key in gradientConfig) {
      gradient.addColorStop(key, gradientConfig[key])
    }

    paletteCtx.fillStyle = gradient
    paletteCtx.fillRect(0, 0, 256, 1)

    return paletteCtx.getImageData(0, 0, 256, 1).data
  }

  static _getPointTemplate(radius, blurFactor) {
    const tplCanvas = document.createElement('canvas')
    const tplCtx = tplCanvas.getContext('2d')
    const x = radius
    const y = radius
    tplCanvas.width = tplCanvas.height = radius * 2

    if (blurFactor === 1) {
      tplCtx.beginPath()
      tplCtx.arc(x, y, radius, 0, 2 * Math.PI, false)
      tplCtx.fillStyle = 'rgba(0,0,0,1)'
      tplCtx.fill()
    } else {
      const gradient = tplCtx.createRadialGradient(x, y, radius * blurFactor, x, y, radius)
      gradient.addColorStop(0, 'rgba(0,0,0,1)')
      gradient.addColorStop(1, 'rgba(0,0,0,0)')
      tplCtx.fillStyle = gradient
      tplCtx.fillRect(0, 0, 2 * radius, 2 * radius)
    }

    return tplCanvas
  }

  static _prepareData(data) {
    const renderData = []
    const { min, max, radi, data: heatmapData } = data

    for (const xValue in heatmapData) {
      for (const yValue in heatmapData[xValue]) {
        const value = heatmapData[xValue][yValue]
        const radius = radi[xValue][yValue]

        renderData.push({
          x: xValue,
          y: yValue,
          value: value,
          radius: radius,
        })
      }
    }

    return { min, max, data: renderData }
  }

  renderPartial(data) {
    if (data.data.length > 0) {
      requestAnimationFrame(() => {
        this._drawAlpha(data)
        this._colorize()
      })
    }
  }

  renderAll(data) {
    this._clear()
    if (data.data.length > 0) {
      this._drawAlpha(Canvas2dRenderer._prepareData(data))
      this._colorize()
    }
  }

  _updateGradient(config) {
    this._palette = Canvas2dRenderer._getColorPalette(config)
  }

  updateConfig(config) {
    if (config.gradient) {
      this._updateGradient(config)
    }
    this._setStyles(config)
  }

  setDimensions(width, height) {
    this._width = width
    this._height = height
    this.canvas.width = this.shadowCanvas.width = width
    this.canvas.height = this.shadowCanvas.height = height
  }

  _clear() {
    this.shadowCtx.clearRect(0, 0, this._width, this._height)
    this.renderBoundaries = [10000, 10000, 0, 0]
  }

  _setStyles(config) {
    this._blur = config.blur === 0 ? 0 : config.blur || config.defaultBlur

    if (config.backgroundColor) {
      this.canvas.style.backgroundColor = config.backgroundColor
    }

    this._width = this.canvas.width = this.shadowCanvas.width = config.width || this._width
    this._height = this.canvas.height = this.shadowCanvas.height = config.height || this._height

    this._opacity = (config.opacity || 0) * 255
    this._maxOpacity = (config.maxOpacity || config.defaultMaxOpacity) * 255
    this._minOpacity = (config.minOpacity || config.defaultMinOpacity) * 255
    this._useGradientOpacity = !!config.useGradientOpacity
  }

  _drawAlpha(data) {
    const min = (this._min = data.min)
    const max = (this._max = data.max)
    const points = data.data || []
    let pointsLen = points.length
    const blur = 1 - this._blur

    while (pointsLen--) {
      const point = points[pointsLen]

      const x = point.x
      const y = point.y
      const radius = point.radius
      const value = Math.min(point.value, max)
      const rectX = x - radius
      const rectY = y - radius
      const shadowCtx = this.shadowCtx

      let tpl
      if (!this._templates[radius]) {
        this._templates[radius] = tpl = Canvas2dRenderer._getPointTemplate(radius, blur)
      } else {
        tpl = this._templates[radius]
      }

      // 计算透明度
      const templateAlpha = (value - min) / (max - min)
      shadowCtx.globalAlpha = templateAlpha < 0.01 ? 0.01 : templateAlpha

      shadowCtx.drawImage(tpl, rectX, rectY)

      // 更新渲染边界
      if (rectX < this.renderBoundaries[0]) {
        this.renderBoundaries[0] = rectX
      }
      if (rectY < this.renderBoundaries[1]) {
        this.renderBoundaries[1] = rectY
      }
      if (rectX + 2 * radius > this.renderBoundaries[2]) {
        this.renderBoundaries[2] = rectX + 2 * radius
      }
      if (rectY + 2 * radius > this.renderBoundaries[3]) {
        this.renderBoundaries[3] = rectY + 2 * radius
      }
    }
  }

  _colorize() {
    let [x, y, rectWidth, rectHeight] = this.renderBoundaries
    const maxWidth = this._width
    const maxHeight = this._height
    const opacity = this._opacity
    const maxOpacity = this._maxOpacity
    const minOpacity = this._minOpacity
    const useGradientOpacity = this._useGradientOpacity

    // 限制渲染区域在画布内
    if (x < 0) x = 0
    if (y < 0) y = 0
    if (x + rectWidth > maxWidth) {
      rectWidth = maxWidth - x
    }
    if (y + rectHeight > maxHeight) {
      rectHeight = maxHeight - y
    }

    const img = this.shadowCtx.getImageData(x, y, rectWidth, rectHeight)
    const imgData = img.data
    const len = imgData.length
    const palette = this._palette

    for (let i = 3; i < len; i += 4) {
      const alpha = imgData[i]
      const offset = alpha * 4

      if (!offset) {
        continue
      }

      const finalAlpha = opacity > 0 ? opacity : Math.min(Math.max(alpha, minOpacity), maxOpacity)

      imgData[i - 3] = palette[offset]
      imgData[i - 2] = palette[offset + 1]
      imgData[i - 1] = palette[offset + 2]
      imgData[i] = useGradientOpacity ? palette[offset + 3] : finalAlpha
    }

    this.ctx.putImageData(img, x, y)

    this.renderBoundaries = [1000, 1000, 0, 0]
  }

  getValueAt(point) {
    const img = this.shadowCtx.getImageData(point.x, point.y, 1, 1)
    const data = img.data[3]
    const max = this._max
    const min = this._min

    const value = (Math.abs(max - min) * (data / 255)) >> 0
    return value
  }

  getDataURL() {
    return this.canvas.toDataURL()
  }
}

class Renderer {
  static getRenderer(conf) {
    if (HeatmapConfig['defaultRenderer'] === 'canvas2d') {
      return new Canvas2dRenderer(conf)
    }
    return null
  }
}

class Util {
  static merge(...args) {
    const merged = {}

    for (const obj of args) {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          merged[key] = obj[key]
        }
      }
    }

    return merged
  }
}

class Coordinator {
  constructor() {
    this.cStore = {}
  }

  on(evtName, callback, scope) {
    if (!this.cStore[evtName]) {
      this.cStore[evtName] = []
    }
    this.cStore[evtName].push(data => callback.call(scope, data))
  }

  emit(evtName, data) {
    if (this.cStore[evtName]) {
      for (const callback of this.cStore[evtName]) {
        callback(data)
      }
    }
  }
}

const _connect = scope => {
  const { _renderer: renderer, _coordinator: coordinator, _store: store, _config: config } = scope

  coordinator.on('renderpartial', renderer.renderPartial, renderer)
  coordinator.on('renderall', renderer.renderAll, renderer)
  coordinator.on('extremachange', data => {
    if (config.onExtremaChange) {
      config.onExtremaChange({
        min: data.min,
        max: data.max,
        gradient: config.gradient || config.defaultGradient,
      })
    }
  })
  store.setCoordinator(coordinator)
}

class Heatmap {
  constructor(config = {}) {
    this._config = Util.merge(HeatmapConfig, config)
    this._coordinator = new Coordinator()

    if (this._config.plugin) {
      const pluginToLoad = this._config.plugin
      if (!HeatmapConfig.plugins[pluginToLoad]) {
        throw new Error(`Plugin '${pluginToLoad}' not found. Maybe it was not registered.`)
      } else {
        const plugin = HeatmapConfig.plugins[pluginToLoad]
        // set plugin renderer and store
        this._renderer = new plugin.renderer(this._config)
        this._store = new plugin.store(this._config)
      }
    } else {
      this._renderer = Renderer.getRenderer(this._config)
      this._store = new Store(this._config)
    }

    _connect(this)
  }

  addData(...args) {
    this._store.addData(...args)
    return this
  }

  removeData(...args) {
    if (this._store.removeData) {
      this._store.removeData(...args)
    }
    return this
  }

  setData(...args) {
    this._store.setData(...args)
    return this
  }

  setDataMax(...args) {
    this._store.setDataMax(...args)
    return this
  }

  setDataMin(...args) {
    this._store.setDataMin(...args)
    return this
  }

  configure(config) {
    this._config = Util.merge(this._config, config)
    this._renderer.updateConfig(this._config)
    this._coordinator.emit('renderall', this._store._getInternalData())
    return this
  }

  repaint() {
    this._coordinator.emit('renderall', this._store._getInternalData())
    return this
  }

  getData() {
    return this._store.getData()
  }

  getDataURL() {
    return this._renderer.getDataURL()
  }

  getValueAt(point) {
    if (this._store.getValueAt) {
      return this._store.getValueAt(point)
    } else if (this._renderer.getValueAt) {
      return this._renderer.getValueAt(point)
    } else {
      return null
    }
  }
}

export default {
  create(config) {
    return new Heatmap(config)
  },
  register(pluginKey, plugin) {
    HeatmapConfig.plugins[pluginKey] = plugin
  },
}
