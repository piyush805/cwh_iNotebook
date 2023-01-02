import React, { useContext, useState, useEffect, useRef } from 'react'
import noteContext from "../context/notes/noteContext";
import AddNote from './AddNote';
import Noteitem from './Noteitem'
import { useNavigate } from 'react-router-dom';

const Notes = (props) => {
    let navigate = useNavigate();
    const context = useContext(noteContext);
    const { notes, getNotes, editNote } = context;
    const [note, setNote] = useState({ id: "", etitle: "", edescription: "", etag: "default" })

    useEffect(() => {
        //On first time fetch all notes of the user, if the user is not logged in, redirect to login page
        if (localStorage.getItem('token')) {
            getNotes();
        } else {
            navigate("/login")
        }
        //eslint-disable-next-line
    }, []);

    const handleClick = (e) => {
        //Send input data editNote function in NoteState which makes api call, updates note in front end and sets in notestate
        editNote(note.id, note.etitle, note.edescription, note.etag)
        props.showAlert("Updated Successfully", "success");
        //close modal after successful operation
        refClose.current.click();
    }
    
    // whatever note state, set it to whatever user updated input to
    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value })
    }

    //Runs on 'Update Note' button in NoteItem
    const updateNote = (currentNote) => {
        ref.current.click(); //clicking edit icon, opens up note edit modal
        //Fill the values in modal: etitle, edescription, etag
        setNote({
            id: currentNote._id,
            etitle: currentNote.title,
            edescription: currentNote.description,
            etag: currentNote.tag
        });
    }
    
    const ref = useRef(null)
    const refClose = useRef(null)

    return (
        <>
            <AddNote showAlert={props.showAlert} />
            <button type="button" ref={ref} className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch demo modal
            </button>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Edit note</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Title</label>
                                    <input type="text" className="form-control" id="etitle" aria-describedby="emailHelp" onChange={onChange} name="etitle" value={note.etitle} required minLength={5} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="edescription" className="form-label" >Description</label>
                                    <input type="text" className="form-control" onChange={onChange} id="edescription" name="edescription" value={note.edescription} required minLength={5} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="etag" className="form-label" >Tag</label>
                                    <input type="text" className="form-control" onChange={onChange} id="etag" name="etag" value={note.etag} />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" ref={refClose}>Cancel</button>
                            <button type="button" className="btn btn-primary" onClick={handleClick} disabled={note.etitle.length < 5 || note.edescription.length < 5}>Update Note</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='row my-4'>
                <h2>Your Notes</h2>
                <div className="container mx-2">
                    {notes.length === 0 && 'No more notes to display'}
                </div>
                {notes.map((note) => {
                    return <Noteitem key={note._id} note={note} updateNote={updateNote} showAlert={props.showAlert} />
                })}
            </div>
        </>
    )
}

export default Notes