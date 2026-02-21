const express = require('express');
const router = express.Router();
const db = require('../db/pool');


// ==========================
// 1️⃣ Create Course
// ==========================
router.post('/', async (req, res) => {
    try {
        const { course_name, description } = req.body;

        if (!course_name) {
            return res.status(400).json({ message: "Course name is required" });
        }

        const [result] = await db.query(
            "INSERT INTO courses (course_name, description) VALUES (?, ?)",
            [course_name, description]
        );

        res.status(201).json({
            message: "Course created successfully",
            id: result.insertId
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// ==========================
// 2️⃣ Get All Courses
// ==========================
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM courses ORDER BY id DESC"
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// ==========================
// 3️⃣ Get Course By ID
// ==========================
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM courses WHERE id = ?",
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.json(rows[0]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// ==========================
// 4️⃣ Update Course
// ==========================
router.put('/:id', async (req, res) => {
    try {
        const { course_name, description } = req.body;

        if (!course_name) {
            return res.status(400).json({ message: "Course name is required" });
        }

        const [result] = await db.query(
            "UPDATE courses SET course_name = ?, description = ? WHERE id = ?",
            [course_name, description, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.json({ message: "Course updated successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// ==========================
// 5️⃣ Delete Course
// ==========================
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query(
            "DELETE FROM courses WHERE id = ?",
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.json({ message: "Course deleted successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;