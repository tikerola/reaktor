
const parsePackageTitleLine = (line, separator) => line.split(separator)[1].trim()

const lineStartsWithWhitespace = line => line[0] === ' ' && line.trim()



const getReverseDependencies = state => {

  /* Let's go through packages */

  for (let currentPackage of state.packages) {

    for (let dependPackage of state.packages) {
      if (currentPackage === dependPackage)
        continue

      /* If dependPackage depends on currentPackage add it to the state  */

      if (state[dependPackage]['depends'] && state[dependPackage]['depends'].includes(currentPackage))
        state[currentPackage]['reverse-depends'].push(dependPackage)

      if (state[dependPackage]['pre-depends'] && state[dependPackage]['pre-depends'].includes(currentPackage))
        state[currentPackage]['reverse-depends'].push(dependPackage)
    }
  }
}


const parseDependencies = (line, dependencySeparator) => {
  dependencies = parsePackageTitleLine(line, dependencySeparator)

  /* Remove version numbers inside brackets  */

  dependencies = dependencies.replace(/\(.*?[^\)]\)/g, '')

  /* Remove whitespaces before commas and trim  */

  dependencies = dependencies.replace(/\s,/g, ',').trim()


  /* Return array of dependencies */

  return dependencies.split(', ')
}

module.exports = { parsePackageTitleLine, lineStartsWithWhitespace, getReverseDependencies, parseDependencies }