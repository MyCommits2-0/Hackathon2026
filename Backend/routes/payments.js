const express = require('express');
const router = express.Router();
const db = require('../db/pool');


// ==============================
// 1️⃣ Create Payment
// ==============================
router.post('/', async (req, res) => {

    const connection = await db.getConnection();

    try {
        const {
            registration_id,
            amount_paid,
            payment_mode,
            payment_status,
            transaction_reference
        } = req.body;

        if (!registration_id || !amount_paid || !payment_mode) {
            return res.status(400).json({ message: "Required fields missing" });
        }

        await connection.beginTransaction();

        // 1️⃣ Check registration exists
        const [registration] = await connection.query(
            "SELECT * FROM registrations WHERE id = ?",
            [registration_id]
        );

        if (registration.length === 0) {
            throw new Error("Registration not found");
        }

        const regData = registration[0];

        // 2️⃣ Get total successful payments so far
        const [payments] = await connection.query(
            `SELECT IFNULL(SUM(amount_paid), 0) AS total_paid
             FROM payments
             WHERE registration_id = ?
             AND payment_status = 'SUCCESS'`,
            [registration_id]
        );

        const totalPaid = Number(payments[0].total_paid);
        const finalAmount = Number(regData.final_amount);

        // 3️⃣ Prevent overpayment
        if (totalPaid + Number(amount_paid) > finalAmount) {
            throw new Error("Payment exceeds remaining amount");
        }

        // 4️⃣ Insert payment
        const [result] = await connection.query(
            `INSERT INTO payments
            (registration_id, amount_paid, payment_mode, payment_status, transaction_reference)
            VALUES (?, ?, ?, ?, ?)`,
            [
                registration_id,
                amount_paid,
                payment_mode,
                payment_status || 'SUCCESS',
                transaction_reference || null
            ]
        );

        // 5️⃣ Recalculate total after payment
        const [updatedPayments] = await connection.query(
            `SELECT IFNULL(SUM(amount_paid), 0) AS total_paid
             FROM payments
             WHERE registration_id = ?
             AND payment_status = 'SUCCESS'`,
            [registration_id]
        );

        const newTotal = Number(updatedPayments[0].total_paid);

        // 6️⃣ Auto mark registration COMPLETED
        if (newTotal >= finalAmount) {
            await connection.query(
                "UPDATE registrations SET status = 'COMPLETED' WHERE id = ?",
                [registration_id]
            );
        }

        await connection.commit();
        connection.release();

        res.status(201).json({
            message: "Payment recorded successfully",
            payment_id: result.insertId,
            total_paid: newTotal,
            remaining_amount: finalAmount - newTotal
        });

    } catch (error) {

        await connection.rollback();
        connection.release();

        res.status(400).json({ error: error.message });
    }
});


// ==============================
// 2️⃣ Get Payments by Registration
// ==============================
router.get('/registration/:registration_id', async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM payments WHERE registration_id = ? ORDER BY id DESC",
            [req.params.registration_id]
        );

        res.json(rows);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// ==============================
// 3️⃣ Get All Payments
// ==============================
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT p.*, r.registration_code
            FROM payments p
            JOIN registrations r ON p.registration_id = r.id
            ORDER BY p.id DESC
        `);

        res.json(rows);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// ==============================
// 4️⃣ Update Payment Status
// ==============================
router.patch('/:id/status', async (req, res) => {
    try {
        const { payment_status } = req.body;

        const [result] = await db.query(
            "UPDATE payments SET payment_status = ? WHERE id = ?",
            [payment_status, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Payment not found" });
        }

        res.json({ message: "Payment status updated successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
