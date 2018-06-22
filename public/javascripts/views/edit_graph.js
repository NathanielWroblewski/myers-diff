namespace('App.Views')

class EditGraph {
  constructor ({ el, model }) {
    this.el = el
    this.model = model
    this.setListeners()
  }

  setListeners () {
    this.model.on('change', () => this.render())
  }

  template ({ source, destination, history, activePath }) {
    let html = ''

    for (let y = 0; y <= destination.length; y++) {
      html += this._templateForRow({ source, destination, history, activePath, y })
    }

    html += this._templateForAxes()

    return html
  }

  render () {
    this.el.innerHTML = this.template(this.model.toJSON())
  }

  _templateForRow ({ source, destination, history, activePath, y }) {
    let html = '<div class="row">'

    for (let x = 0; x <= source.length; x++) {
      html += this._templateForCell({ source, destination, history, activePath, x, y, })
    }

    return html + '</div>'
  }

  _templateForCell ({ source, destination, history, activePath, x, y }) {
    const trace = this._trace({ source, destination, history, activePath, x, y })
    const diagonal = this._diagonal(source[x - 1], destination[y - 1], trace)

    if (!x && y) return `<div class="cell ${trace}">${destination[y - 1]}</div>`
    if (!y && x) return `<div class="cell ${trace}">${source[x - 1]}</div>`

    return `<div class="cell ${trace}">${diagonal}</div>`
  }

  _templateForAxes () {
    return `
      <div class="axes">
        <span class="x axis">source deletions &rarr;</span>
        <span class="y axis">&larr; destination insertions</span>
      </div>
    `
  }

  _diagonal (sourceElement, destinationElement, trace) {
    if (sourceElement && destinationElement && sourceElement === destinationElement) {
      return `<div class="diagonal ${trace === 'equivalence ' && trace}"></div>`
    } else {
      return ''
    }
  }

  _isLast ({ x, source, history, fromY }) {
    return (
      x === source.length &&
      !!history.find(coord => coord[0] === x && coord[1] === fromY + 1)
    )
  }

  _isBox ({ insertion, deletion, history }) {
    return (
      !!insertion &&
      !!deletion &&
      !!history.find(coord => (
        coord[0] === deletion[0] && coord[1] === deletion[1] - 1
      ))
    )
  }

  _trace ({ source, destination, history, activePath, x, y }) {
    const gridX = x - 1
    const gridY = y - 1
    let memo = ''

    for (let i = 0; i < history.length; i++) {
      const [fromX, fromY] = history[i]

      if (fromX !== gridX || fromY !== gridY) continue

      const insertion = history.find(coord => coord[0] === fromX && coord[1] === fromY + 1)
      const deletion = history.find(coord => coord[0] === fromX + 1 && coord[1] === fromY)
      const equivalence = history.find(coord => coord[0] === fromX + 1 && coord[1] === fromY + 1)
      const isBox = this._isBox({ insertion, deletion, history })
      const isLast = this._isLast({ x, source, history, fromY })
      const isActiveInsertion = !!activePath.find(([op, coord]) => (
        op === '+' && coord[0] === fromX && coord[1] === fromY + 1
      ))
      const isActiveDeletion = !!activePath.find(([op, coord]) => (
        op === '-' && coord[0] === fromX + 1 && coord[1] === fromY
      ))
      const isActiveEquivalence = !!activePath.find(([op, coord]) => (
        op === '=' && coord[0] === fromX + 1 && coord[1] === fromY + 1
      ))

      if (isLast) memo += 'right '
      if (insertion) memo += `${isActiveInsertion ? 'active-' : ''}insertion `
      if (deletion && !isBox) memo += `${isActiveDeletion ? 'active-' : ''}deletion `
      if (equivalence) memo += `${isActiveEquivalence ? 'active-' : ''}equivalence `
    }

    return memo
  }
}

App.Views.EditGraph = EditGraph
