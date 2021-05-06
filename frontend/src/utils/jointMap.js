function union(setA, setB) {
    let _union = new Set(setA)
    for (let elem of setB) {
        _union.add(elem)
    }
    return _union
  }

// TODO: better way to do this...
const jointMap = (original, alternative) => {
  const joint = {}
  const originalKeys = new Set(Object.keys(original))
  const alternativeKeys = new Set(Object.keys(alternative))
  const allKeys = union(originalKeys, alternativeKeys)
  for (var k of allKeys) {
    joint[k] = {original: original[k], alternative: alternative[k]}
  }
  return joint
}

export {jointMap, union}
