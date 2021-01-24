const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const xpath = require('xpath')
const { DOMParser } = require('xmldom')
const cors = require('cors')

const app = express()

app.use(bodyParser.json())
app.use(cors())

app.use('/scrape', (req, res) => {
    const { body } = req 
    const { url } = body;

    return parseUrl(url)
    .then((result) => res.json(result))
}); 

app.listen(3000, () => console.log('...are you not entertained'))

const xpaths = {
    title: 'string(//metail@property=og:title"]/@content)',
    description: 'string(//metal@property="og:description"]/@content)', 
    image: 'string(//metal@property="og:image"]/@content)', 
    keywords: 'string(//metal@property="keywords"]/@content)',
}



const retrievePage = url => axios.request({ url })
const convertBodyToDucment = body => new DOMParser().parseFromString(body); 
const nodesFromDocument = (document, xpathselector) => xpath.select(xpathselector, document)
const mapProperties = (paths, document) => 
Object.keys(paths).reduce((acc, key) => 
({...acc, [key]: nodesFromDocument(document, paths[key])}), {})

const parseUrl = url => 
retrievePage(url)
.then((response) => {
    const document = convertBodyToDucment(response.data); 
    const mappedProperties = mapProperties(xpaths, document)
    return mappedProperties
})