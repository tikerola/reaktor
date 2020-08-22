const readFile = require('./readFile')
const {
  parsePackageTitleLine,
  lineStartsWithWhitespace,
  getReverseDependencies,
  parseDependencies
} = require('./parseHelpers')


/* This function will read the status-file and return parsed data */

const parseFile = async fileName => {

  /* State will eventually have parsed data and will be returned 
    state = {
      packages: ['python', 'libc6', ...],
      python: {
        depends: [],
        pre-depends: [],
        reverse-depends: []
      },
      libc6: { ... }
    }
  
  */

  let state = {
    packages: []
  }


  /* These refer to same/current package */

  let currentPackageName = ''
  let currentDescriptionTitle = ''
  let currentDescriptionBody = ''

  /* Let's read filestream */

  const fileStream = readFile(fileName)


  /* Let's go line by line */

  for await (let line of fileStream) {

    /*  Parse Package 
        Push packages to a state.packages array,
        Create object for current package
    */

    if (line.startsWith('Package:')) {
      currentPackageName = parsePackageTitleLine(line, 'Package:')
      state.packages.push(currentPackageName)
      state[currentPackageName] = {}

      state[currentPackageName]['depends'] = []
      state[currentPackageName]['pre-depends'] = []
      state[currentPackageName]['reverse-depends'] = []
    }


    /*  Parse Description 
        'Description:' line will hold the description title
    */

    else if (line.startsWith('Description:')) {
      currentDescriptionTitle = parsePackageTitleLine(line, 'Description:')

      state[currentPackageName]['description'] = {}
      state[currentPackageName]['description']['title'] = currentDescriptionTitle
    }

    /* If we have a title, that means we are in the description body  */

    else if (currentDescriptionTitle) {

      /* If a line starts with a white space, but is not empty, then continue build the body  */

      if (lineStartsWithWhitespace(line)) {
        currentDescriptionBody += line
      }

      /* Line is empty so let's put the body to state */

      else {
        state[currentPackageName]['description']['body'] = currentDescriptionBody.trim()
        currentDescriptionBody = ''
        currentDescriptionTitle = ''
      }
    }

    /* <<< End of parse Description >>> */

    /* Load dependencies to state */

    else if (line.startsWith('Pre-Depends:')) {
      state[currentPackageName]['pre-depends'] = parseDependencies(line, 'Pre-Depends:')
    }

    else if (line.startsWith('Depends')) {
      state[currentPackageName]['depends'] = parseDependencies(line, 'Depends:')
    }
  }

  /* Fill reverse dependencies after having parsed depends and pre-depends */

  getReverseDependencies(state)

  return state
}


module.exports = { parseFile }