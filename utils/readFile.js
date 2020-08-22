const fs = require('fs')
const readline = require('readline');

module.exports = fileName => {
    const fileStream = fs.createReadStream(fileName)

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    })

    return rl
}


