namespace('App.Views')

class Diff {
  constructor ({ el, diff, delimiter, format }) {
    this.el = el
    this.diff = diff
    this.delimiter = delimiter
    this.format = format
  }

  template (diff, delimiter, format) {
    return diff.split(delimiter).reduce((html, text) => {
      return html += format(text)
    }, '')
  }

  render () {
    this.el.innerHTML = this.template(this.diff, this.delimiter, this.format)
  }
}

App.Views.Diff = Diff
