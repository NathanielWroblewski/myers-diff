namespace('App.Utilities')

const diff = (source, destination) => {
  const n = source.length
  const m = destination.length
  const max = m + n
  const offset = max + 1
  const v = new Array(2 * max).fill(0)
  const paths = new Array(2 * max).fill('')
  const xyhistory = []
  const activePath = {}
  const activePaths = []
  const diffHistory = []

  for (let d = 0; d <= max; d++) {
    for (let k = -d; k <= d; k += 2) {
      let x, y, path, op

      if (k == -d || (k !== d) && v[k + max] < v[k + 1 + offset]) {
        // insertion, traversing downward
        x = v[k + 1 + offset]
        y = x - k
        path = paths[k + 1 + offset].slice()
        op = '+'

        if (y > 0 && y <= m) path += `${op} ${destination[y - 1]}\n`
      } else {
        // deletion, traversing rightward
        x = v[k + max] + 1
        y = x - k
        path = paths[k - 1 + offset].slice()
        op = '-'

        if (x > 0 && x <= n) path += `${op} ${source[x - 1]}\n`
      }

      xyhistory.push([x, y])
      diffHistory.push(path)

      if (path === '') {
        activePath[path] = []
      } else {
        const splitPath = path.split('\n')
        const lastPath = splitPath.slice(0, splitPath.length - 2).join('\n') + '\n'
        const pathHistory = (activePath[lastPath] || []).slice(0)
        pathHistory.push([op, [x, y]])
        activePath[path] = pathHistory
        activePaths.push(pathHistory)
      }

      while (x < n && y < m && source[x] === destination[y]) {
        // equivalence, traversing diagonally
        path += ` ${destination[y]}\n`
        op = '='
        x++
        y++
        xyhistory.push([x, y])
        diffHistory.push(path)

        const splitPath = path.split('\n')
        const lastPath = splitPath.slice(0, splitPath.length - 2).join('\n') + '\n'
        const pathHistory = (activePath[lastPath] || []).slice(0)
        pathHistory.push([op, [x, y]])
        activePath[path] = pathHistory
        activePaths.push(pathHistory)
      }

      v[k + offset] = x
      paths[k + offset] = path

      if (x >= n && y >= m) {
        return [path, xyhistory, activePaths, diffHistory]
      }
    }
  }
}

App.Utilities.diff = diff;
