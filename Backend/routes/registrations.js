const express = require('express');
const router = express.Router();
const db = require('../db/pool');


// Utility: Generate Registration Code
function generateRegistrationCode() {
    const random = Math.floor(1000 + Math.random() * 9000);
    return `REG-${Date.now()}-${random}`;
}



router.post('/', async (req, res) => {

    const connection = await db.getConnection();

    try {
        const { student_id, batch_id, discount_id } = req.body;

        if (!student_id || !batch_id) {
            return res.status(400).json({ message: "student_id and batch_id are required" });
        }

        await connection.beginTransaction();

        // 1️⃣ Check student exists
        const [student] = await connection.query(
            "SELECT id FROM students WHERE id = ?",
            [student_id]
        );

        if (student.length === 0) {
            throw new Error("Student not found");
        }

        // 2️⃣ Get batch details
        const [batch] = await connection.query(
            "SELECT * FROM batches WHERE id = ?",
            [batch_id]
        );

        if (batch.length === 0) {
            throw new Error("Batch not found");
        }

        const batchData = batch[0];

        // 3️⃣ Check capacity
        const [count] = await connection.query(
            "SELECT COUNT(*) AS total FROM registrations WHERE batch_id = ? AND status = 'ACTIVE'",
            [batch_id]
        );

        if (count[0].total >= batchData.capacity) {
            throw new Error("Batch capacity full");
        }

        let original_fee = batchData.fee;
        let discount_amount = 0;
        let final_amount = original_fee;

        // 4️⃣ Apply Discount (if provided)
        if (discount_id) {

            const [discount] = await connection.query(
                `SELECT * FROM discounts 
                 WHERE id = ? AND is_active = 1`,
                [discount_id]
            );

            if (discount.length === 0) {
                throw new Error("Invalid or inactive discount");
            }

            const discountData = discount[0];

            // Check date validity
            const today = new Date().toISOString().split('T')[0];

            if (
                (discountData.start_date && today < discountData.start_date) ||
                (discountData.end_date && today > discountData.end_date)
            ) {
                throw new Error("Discount not valid for current date");
            }

            if (discountData.value_type === "FLAT") {
                discount_amount = Number(discountData.discount_value);
            } else if (discountData.value_type === "PERCENTAGE") {
                discount_amount = (original_fee * Number(discountData.discount_value)) / 100;
            }

            final_amount = original_fee - discount_amount;

            if (final_amount < 0) final_amount = 0;
        }

        // 5️⃣ Generate Registration Code
        const registration_code = generateRegistrationCode();

        // 6️⃣ Insert into registrations
        const [registrationResult] = await connection.query(
            `INSERT INTO registrations
            (registration_code, student_id, batch_id, original_fee, discount_amount, final_amount)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [registration_code, student_id, batch_id, original_fee, discount_amount, final_amount]
        );

        const registration_id = registrationResult.insertId;

        // 7️⃣ Insert into registration_discounts (if discount used)
        if (discount_id) {
            await connection.query(
                `INSERT INTO registration_discounts
                (registration_id, discount_id, discount_amount)
                VALUES (?, ?, ?)`,
                [registration_id, discount_id, discount_amount]
            );
        }

        await connection.commit();
        connection.release();

        res.status(201).json({
            message: "Registration successful",
            registration_code,
            original_fee,
            discount_amount,
            final_amount
        });

    } catch (error) {

        await connection.rollback();
        connection.release();

        res.status(400).json({ error: error.message });
    }
});


module.exports = router;