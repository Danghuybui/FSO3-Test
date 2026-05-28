import { useState, useEffect } from 'react'
import axios from 'axios'
import Note from './components/Note'
import noteService from './services/notes'
import './index.css'
import Notification from './components/notification'
import Footer from './components/Footer'

const App = () => {
  const [notes, setNotes] = useState([])

  const [newNote, setNewNote] = useState('a new note...') 

  const [showAll, setShowAll] = useState(true)

  const [errorMessage, setErrorMessage] = useState('some error happened...')
  
  const hook = () => {
    console.log('effect') 
    noteService
      .getAll()
      .then(intitialNotes  => {
        console.log('promise fulfilled')
        setNotes(intitialNotes)
        console.log(intitialNotes)
      })
  }

  useEffect(hook, [])

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
      //id: String(notes.length + 1)
    }
    //setNotes(notes.concat(noteObject))
    //setNewNote('')
    //console.log('button clicked', event.target)

    noteService
      .create(noteObject)
      .then(createdNote => {
        setNotes(notes.concat(createdNote))
        setNewNote('')
        console.log(createdNote)
      })    
  }

  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important === true)

  const toggleImportanceOf = (id) => {
    console.log(`importance of ${id} needs to be toggled`)
    const url = `http://localhost:3001/notes/${id}`
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then(changedNote => {
        setNotes(notes.map(note => note.id !== id ? changedNote : note))
      })
      .catch(error => {
        setErrorMessage(`the note '${note.content}' was already removed from server`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div> 
      <ul>
        {notesToShow.map(note => 
          <Note key={note.id} 
          note={note}
          toggleImportance={() => toggleImportanceOf(note.id)}
          />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange}/>
        <button type="submit">save</button>
      </form> 
      <Footer />
    </div>
  )
}

export default App 