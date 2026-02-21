const express = require('express');
const router = express.Router();
const db = require('../db/pool');


// ==========================
// 1️⃣ Create Batch
// ==========================
router.post('/', async (req, res) => {
    try {
        const {
            course_id,
            batch_name,
            fee,
            capacity,
            location_mode,
            start_date,
            end_date
        } = req.body;

        if (!course_id || !batch_name || !fee || !capacity || !location_mode) {
            return res.status(400).json({ message: "Required fields missing" });
        }

        // Check if course exists
        const [course] = await db.query(
            "SELECT id FROM courses WHERE id = ?",
            [course_id]
        );

        if (course.length === 0) {
            return res.status(404).json({ message: "Course not found" });
        }

        const [result] = await db.query(
            `INSERT INTO batches 
            (course_id, batch_name, fee, capacity, location_mode, start_date, end_date)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [course_id, batch_name, fee, capacity, location_mode, start_date, end_date]
        );

        res.status(201).json({
            message: "Batch created successfully",
            id: result.insertId
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// ==========================
// 2️⃣ Get All Batches (with Course Name)
// ==========================
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT b.*, c.course_name 
            FROM batches b
            JOIN courses c ON b.course_id = c.id
            ORDER BY b.id DESC
        `);

        res.json(rows);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// ==========================
// 3️⃣ Get Batch By ID
// ==========================
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT b.*, c.course_name
            FROM batches b
            JOIN courses c ON b.course_id = c.id
            WHERE b.id = ?
        `, [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Batch not found" });
        }

        res.json(rows[0]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// ==========================
// 4️⃣ Update Batch
// ==========================
router.put('/:id', async (req, res) => {
    try {
        const {
            course_id,
            batch_name,
            fee,
            capacity,
            location_mode,
            start_date,
            end_date
        } = req.body;

        const [result] = await db.query(
            `UPDATE batches 
             SET course_id = ?, batch_name = ?, fee = ?, capacity = ?, 
                 location_mode = ?, start_date = ?, end_date = ?
             WHERE id = ?`,
            [course_id, batch_name, fee, capacity, location_mode, start_date, end_date, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Batch not found" });
        }

        res.json({ message: "Batch updated successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// ==========================
// 5️⃣ Delete Batch
// ==========================
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query(
            "DELETE FROM batches WHERE id = ?",
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Batch not found" });
        }

        res.json({ message: "Batch deleted successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;