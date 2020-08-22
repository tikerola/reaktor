const express = require('express')
const { parseFile } = require('./utils/parseFile')
const path = require('path')

const app = express()
const port = process.env.PORT || 3001
let state

app.set('view engine', 'ejs')

//const file = path.normalize(path.join('/var/lib/dpkg', 'status'))
const file = path.join(__dirname, 'status.txt')


/* Get state data */

parseFile(file)
    .then(stateData => state = stateData)
    .catch(error => console.log(error))

/* Home route */

app.get('/', (req, res) => {
    res.render('pages/index', { packages: state.packages.sort() })
})

/* Route for individual packages */

app.get('/package/:packageName', (req, res) => {
    const packageName = req.params.packageName

    res.render('pages/package', {
        packageName,
        packageData: state[packageName],
        state
    })
})


app.listen(port, () => console.log(`Opening on port ${port}`))

