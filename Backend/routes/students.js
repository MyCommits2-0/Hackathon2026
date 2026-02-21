const express = require('express');
const router = express.Router();
const db = require('../db/pool');


// ==========================
// 1️⃣ Create Student
// ==========================
router.post('/', async (req, res) => {
    try {
        const { name, email, phone } = req.body;

        if (!name || !email || !phone) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const [result] = await db.query(
            "INSERT INTO students (name, email, phone) VALUES (?, ?, ?)",
            [name, email, phone]
        );

        res.status(201).json({
            message: "Student created successfully",
            id: result.insertId
        });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: "Email already exists" });
        }

        res.status(500).json({ error: error.message });
    }
});


// ==========================
// 2️⃣ Get All Students
// ==========================
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM students ORDER BY id DESC"
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// ==========================
// 3️⃣ Get Student By ID
// ==========================
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM students WHERE id = ?",
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json(rows[0]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// ==========================
// 4️⃣ Update Student
// ==========================
router.put('/:id', async (req, res) => {
    try {
        const { name, email, phone } = req.body;

        if (!name || !email || !phone) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const [result] = await db.query(
            "UPDATE students SET name = ?, email = ?, phone = ? WHERE id = ?",
            [name, email, phone, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json({ message: "Student updated successfully" });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: "Email already exists" });
        }

        res.status(500).json({ error: error.message });
    }
});


// ==========================
// 5️⃣ Delete Student
// ==========================
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query(
            "DELETE FROM students WHERE id = ?",
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json({ message: "Student deleted successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;