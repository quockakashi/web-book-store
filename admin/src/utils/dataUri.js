const path = require('path');
const DatauriParser = require('datauri/parser');

const toDataUri = (file) => {
    const parser = new DatauriParser();
    const extName = path.extname(file.name).toString();
    let base64 = parser.format(extName, file.data);

    return base64.content;
}

module.exports = toDataUri;