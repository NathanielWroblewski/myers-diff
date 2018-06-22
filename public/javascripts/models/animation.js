namespace('App.Models')

class Animation {
  constructor ({ source, destination, diff, index }) {
    const [_, history, activePaths, diffHistory] = diff(source, destination)

    this.source = source
    this.destination = destination
    this.history = history
    this.activePaths = activePaths
    this.diffHistory = diffHistory
    this.index = index
    this._on = {
      change: []
    }
  }

  step () {
    this.index++

    if (!this.history[this.index]) this.index = 1

    const [lastX, lastY] = this.history[this.index]
    const visible = lastX <= this.source.length && lastY <= this.destination.length

    visible ? this.trigger('change') : this.step()
  }

  trigger (event) {
    this._on[event].map(callback => callback())
  }

  on (event, callback) {
    this._on[event].push(callback)
  }

  _diff () {
    const currentDiff = this.diffHistory[this.index] || '';
    const offset = currentDiff.split('\n').slice(0, -1).filter(line => {
      return line[0] !== '+'
    }).length
    const tail = this.source.map(line => `  ${line}`).slice(offset).join('\n')

    return currentDiff + tail
  }

  toJSON () {
    return {
      source: this.source,
      destination: this.destination,
      history: this.history.slice(0, this.index + 1),
      activePath: this.activePaths[this.index - 1] || [],
      diff: this._diff(),
    }
  }
}

App.Models.Animation = Animation
