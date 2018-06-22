!function () {
  const CLASS_NAMES = {
    '+': 'add',
    '-': 'remove',
    ' ': 'noop'
  }

  const fig1 = document.querySelector('.diff')
  const [diff,] = App.Utilities.diff(
    App.Data.EMPTY_BOTTLES.split("\n"),
    App.Data.MONKEY_STOPS_WHISTLING.split("\n")
  )
  new App.Views.Diff({
    el: fig1,
    diff,
    delimiter: '\n',
    format (text) {
      if (text.length) {
        return `<p class="text ${CLASS_NAMES[text[0]]}"><span class="op">${text[0]}</span>${text.slice(1)}</p>`
      } else {
        return '';
      }
    }
  }).render()

  const fig2 = document.querySelector('.edit-graph')
  const frozen = new App.Models.Animation({
    source: ['d', 'r', 'i', 'f', 't', 'w', 'o', 'o', 'd'],
    destination: ['a', 'r', 't', 'w', 'o', 'r', 'k'],
    diff: App.Utilities.diff,
    index: 0
  })
  new App.Views.EditGraph({
    el: fig2,
    model: frozen
  }).render()

  const fig3 = document.querySelector('.animation')
  const fig3diff = document.querySelector('.animated-diff')
  const animation = new App.Models.Animation({
    source: ['d', 'r', 'i', 'f', 't', 'w', 'o', 'o', 'd'],
    destination: ['a', 'r', 't', 'w', 'o', 'r', 'k'],
    diff: App.Utilities.diff,
    index: 1
  })
  new App.Views.EditGraph({
    el: fig3,
    model: animation
  }).render()
  new App.Views.Diff({
    el: fig3diff,
    diff: animation.toJSON().diff,
    delimiter: '\n',
    format (text) {
      if (text.length) {
        return `
          <span class="letter-${CLASS_NAMES[text[0]]}">
            ${text.slice(1)}
          </span>
        `
      } else {
        return '';
      }
    }
  }).render()

  setInterval(() => {
    animation.step()

    new App.Views.Diff({
      el: fig3diff,
      diff: animation.toJSON().diff,
      delimiter: '\n',
      format (text) {
        if (text.length) {
          return `
            <span class="letter-${CLASS_NAMES[text[0]]}">
              ${text.slice(1)}
            </span>
          `
        } else {
          return '';
        }
      }
    }).render()
  }, 500)
}()
