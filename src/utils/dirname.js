import path from 'path'
import { fileURLToPath } from 'url'

// replacement for __dirname in ES modules
const getDirName = function (moduleUrl) {
    const filename = fileURLToPath(moduleUrl)
    return path.dirname(filename)
}

export {
    getDirName
}