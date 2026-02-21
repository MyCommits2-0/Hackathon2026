const express = require('express');
const router = express.Router();
const db = require('../db/pool');


// =======================================
// 1️⃣ Dashboard Summary
// =======================================
router.get('/dashboard', async (req, res) => {
    try {
        const [[students]] = await db.query(
            "SELECT COUNT(*) AS total_students FROM students"
        );

        const [[registrations]] = await db.query(
            "SELECT COUNT(*) AS total_registrations FROM registrations"
        );

        const [[revenue]] = await db.query(
            `SELECT IFNULL(SUM(amount_paid),0) AS total_revenue
             FROM payments
             WHERE payment_status = 'SUCCESS'`
        );

        const [[pending]] = await db.query(
            `SELECT COUNT(*) AS pending_registrations
             FROM registrations
             WHERE status != 'COMPLETED'`
        );

        res.json({
            total_students: students.total_students,
            total_registrations: registrations.total_registrations,
            total_revenue: revenue.total_revenue,
            pending_registrations: pending.pending_registrations
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// =======================================
// 2️⃣ Batch-wise Revenue Report
// =======================================
router.get('/reports/batch-revenue', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                b.id AS batch_id,
                b.batch_name,
                IFNULL(SUM(p.amount_paid),0) AS revenue
            FROM batches b
            LEFT JOIN registrations r ON r.batch_id = b.id
            LEFT JOIN payments p 
                ON p.registration_id = r.id
                AND p.payment_status = 'SUCCESS'
            GROUP BY b.id
            ORDER BY revenue DESC
        `);

        res.json(rows);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// =======================================
// 3️⃣ Student Full History
// =======================================
router.get('/student/:student_id/history', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                s.name,
                r.registration_code,
                c.course_name,
                b.batch_name,
                r.final_amount,
                IFNULL(SUM(p.amount_paid),0) AS total_paid,
                r.status
            FROM students s
            JOIN registrations r ON r.student_id = s.id
            JOIN courses c ON r.course_id = c.id
            JOIN batches b ON r.batch_id = b.id
            LEFT JOIN payments p 
                ON p.registration_id = r.id
                AND p.payment_status = 'SUCCESS'
            WHERE s.id = ?
            GROUP BY r.id
        `, [req.params.student_id]);

        res.json(rows);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// =======================================
// 4️⃣ Dropdown Data (Courses & Batches)
// =======================================
router.get('/dropdowns', async (req, res) => {
    try {
        const [courses] = await db.query(
            "SELECT id, course_name FROM courses"
        );

        const [batches] = await db.query(
            "SELECT id, batch_name FROM batches"
        );

        res.json({
            courses,
            batches
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// =======================================
// 5️⃣ Health Check
// =======================================
router.get('/health', (req, res) => {
    res.json({
        status: "Server Running 🚀",
        timestamp: new Date()
    });
});


module.exports = router;