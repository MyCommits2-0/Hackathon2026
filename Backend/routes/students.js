const express = require('express');
const router = express.Router();
const db = require('../db/pool');



// router.post('/', async (req, res) => {
//     try {
//         const { name, email, phone } = req.body;

//         if (!name || !email || !phone) {
//             return res.status(400).json({ message: "All fields are required" });
//         }

//        // 1️⃣ Check if user already exists
// const [user] = await db.query(
//     "SELECT * FROM users WHERE email = ?",
//     [email]
// );

// if (user.length === 0) {
//     const password = "sunbeam";
//     const role = "student";

//     await db.query(
//         "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
//         [email, password, role]
//     );
// }

// // 2️⃣ Insert into students table
// const [result] = await db.query(
//     "INSERT INTO students (name, email, phone) VALUES (?, ?, ?)",
//     [name, email, phone]
// );
//         res.status(201).json({
//             message: "Student created successfully",
//             id: result.insertId
//         });

//     } catch (error) {
//         if (error.code === 'ER_DUP_ENTRY') {
//             return res.status(400).json({ message: "Email already exists" });
//         }

//         res.status(500).json({ error: error.message });
//     }
// });

router.post('/', async (req, res) => {
    const connection = await db.getConnection();

    try {
        const { name, email, phone } = req.body;

        if (!name || !email || !phone) {
            return res.status(400).json({ message: "All fields are required" });
        }

        await connection.beginTransaction();

        // 1️⃣ Check if user exists
        const [user] = await connection.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (user.length === 0) {
            const password = "sunbeam";
            const role = "student";

            await connection.query(
                "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
                [email, password, role]
            );
        }

        // 2️⃣ Check if student already exists
        const [existingStudent] = await connection.query(
            "SELECT * FROM students WHERE email = ?",
            [email]
        );

        if (existingStudent.length > 0) {
            await connection.rollback();
            connection.release();

            return res.status(400).json({
                message: "Student already exists"
            });
        }

        // 3️⃣ Insert student
        const [result] = await connection.query(
            "INSERT INTO students (name, email, phone) VALUES (?, ?, ?)",
            [name, email, phone]
        );

        await connection.commit();
        connection.release();

        res.status(201).json({
            message: "Student created successfully",
            id: result.insertId
        });

    } catch (error) {
        await connection.rollback();
        connection.release();

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: "Email already exists" });
        }

        res.status(500).json({ error: error.message });
    }
});


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