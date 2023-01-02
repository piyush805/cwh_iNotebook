import React, { useState, useContext } from 'react'
import noteContext from "../context/notes/noteContext";

function AddNote(props) {
    const context = useContext(noteContext);

    const [note, setNote] = useState({ title: "", description: "", tag: "" });

    const { addNote } = context;

    const handleClick = (e) => {
        e.preventDefault();
        addNote(note.title, note.description, note.tag);
        props.showAlert("Note added successfully", "success");
        setNote({ title: "", description: "", tag: "" });
    }
    const onChange = (e) => {
        //whatever current state of note, add input values to it
        setNote({
            ...note,
            [e.target.name]: e.target.value,
        })
    }
    return (
        <div>
            <h2>Add a note</h2>
            <form>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input type="text" className="form-control" id="title" aria-describedby="emailHelp" onChange={onChange} name="title" minLength={5} value={note.title} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label" >Description</label>
                    <input type="text" className="form-control" onChange={onChange} id="description" name="description" minLength={5} required value={note.description} />
                </div>
                <div className="mb-3">
                    <label htmlFor="tag" className="form-label" >Tag</label>
                    <input type="text" className="form-control" onChange={onChange} id="tag" name="tag" value={note.tag} />
                </div>
                <button disabled={note.title.length < 3 || note.description.length < 5} type="submit" className="btn btn-primary" onClick={handleClick}>Add Note</button>
            </form>
        </div>
    )
}

export default AddNote
