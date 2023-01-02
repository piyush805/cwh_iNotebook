const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser")
const Note = require("../models/Note")
const { body, validationResult } = require('express-validator');

//ROUTE 1: Get all the notes using GET "api/notes/fetchallnotes" Login required 
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

//ROUTE 2: Add a new note using POST "api/notes/addnote" Login required 
router.post('/addnote', fetchuser,
    [
        body('title', 'Enter a valid title').isLength({ min: 3 }),
        body('description', 'Must be atleast 5 characters').isLength({ min: 5 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { title, description, tag } = req.body;
            const note = new Note({
                title: title,
                description: description,
                tag: tag,
                user: req.user.id
            });
            const savedNote = await note.save();
            res.send(savedNote);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    })

//ROUTE 3: Add a new note using PUT "api/notes/updatenote". Login required 
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        const { title, description, tag } = req.body
        //create new note from recived info
        const newNote = {};
        if (title) {
            newNote.title = title
        }
        if (description) {
            newNote.description = description
        }
        if (tag) {
            newNote.tag = tag
        }
        //check if valid target note and user
        let note = await Note.findById(req.params.id);
        if (!note) {
            res.status(404).send("Not Found");
        }
        if (note.user.toString() != req.user.id) {
            res.status(401).send("Not Allowed");
        }
        //Find the note to be updated and update it
        note = await Note.findByIdAndUpdate(req.params.id, {
            $set: newNote
        },
            { new: true }
        );

        res.send(note);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

//ROUTE 4: Delete an existing note using DELETE "api/notes/deletenote". Login required 
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        //check if valid target note and user
        let note = await Note.findById(req.params.id);
        if (!note) {
            res.status(404).send("Not Found");
        }
        if (note.user.toString() != req.user.id) {
            res.status(401).send("Not Allowed");
        }
        //Find the note to be deleted and delete it
        note = await Note.findByIdAndDelete(req.params.id)

        res.send({
            "Success": "This id has been deleted",
            note: note
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;