// Import dependencies
const express = require('express')
const fs = require('fs')
const path = require('path')

// Define port and app
const PORT = process.env.PORT || 3001
const app = express()

// Initialize the db.json file if it doesn't exit
if (!fs.existsSync('db.json')) {
    const notes = []
    fs.writeFileSync('db.json', JSON.stringify(notes), (err) => console.log(err));
}

// Initialize app
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use(express.static(__dirname));

// Request main page
app.get('/', (req, res) => {
    console.log('Sending index.html');
    res.sendFile(path.join(__dirname, 'index.html'))
})

// Request notes page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'notes.html'))
})

// GET for api notes
app.get('/api/notes', (req, res) => {
    let notes_ = JSON.parse(fs.readFileSync('db.json'))
    console.log('pulling files');
    return res.json(notes_)
})

// POST for api notes
app.post('/api/notes', (req, res) => {
    let new_note = req.body
    let notes_ = JSON.parse(fs.readFileSync('db.json'))
    new_note.id = notes_.length + 1
    notes_.push(new_note)
    fs.writeFileSync('db.json', JSON.stringify(notes_), (err) => console.log(err))
    console.log('Returning notes from POST');
    return res.json(notes_)
})

// DELETE note
app.delete('/api/notes/:id', (req, res) => {
    let del_id = req.params.id
    // let del_id = req.body
    let notes_ = JSON.parse(fs.readFileSync('db.json'))

    // Loop through all notes and delete if it matches ID
    for (var i=0; i<notes_.length; i++) {
        if (del_id == notes_[i].id) {
            notes_.splice(i,1)
        } 
    }
    fs.writeFileSync('db.json', JSON.stringify(notes_), (err) => console.log(err))
    console.log('Returning notes from DELETE');
    return res.json(notes_)
})

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))