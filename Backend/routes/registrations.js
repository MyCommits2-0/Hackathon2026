const express = require('express');
const router = express.Router();
const db = require('../db/pool');
const DiscountEngine = require("../utils/discount-engine/DiscountEngine");

function generateRegistrationCode() {
    const random = Math.floor(1000 + Math.random() * 9000);
    return `REG-${Date.now()}-${random}`;
}

router.post('/', async (req, res) => {

    const connection = await db.getConnection();

    try {
        const { student_id, batch_id } = req.body;

        if (!student_id || !batch_id) {
            return res.status(400).json({
                message: "student_id and batch_id are required"
            });
        }

        await connection.beginTransaction();

        // 1️⃣ Validate student
        const [student] = await connection.query(
            "SELECT id FROM students WHERE id = ?",
            [student_id]
        );
        if (student.length === 0) throw new Error("Student not found");

        // 2️⃣ Validate batch
        const [batch] = await connection.query(
            "SELECT * FROM batches WHERE id = ?",
            [batch_id]
        );
        if (batch.length === 0) throw new Error("Batch not found");

        const batchData = batch[0];

        // 3️⃣ Duplicate registration check
        const [existing] = await connection.query(
            "SELECT id FROM registrations WHERE student_id = ? AND batch_id = ?",
            [student_id, batch_id]
        );
        if (existing.length > 0)
            throw new Error("Student already registered in this batch");

        // 4️⃣ Capacity check
        const [count] = await connection.query(
            "SELECT COUNT(*) AS total FROM registrations WHERE batch_id = ? AND status = 'ACTIVE'",
            [batch_id]
        );
        if (count[0].total >= batchData.capacity)
            throw new Error("Batch capacity full");

        let original_fee = Number(batchData.fee);
        let discount_amount = 0;
        let final_amount = original_fee;
        let applied_discount_id = null;

        const today = new Date().toISOString().split('T')[0];

        // 5️⃣ Fetch active discounts
        const [discounts] = await connection.query(
            `SELECT * FROM discounts
             WHERE is_active = 1
             AND (start_date IS NULL OR start_date <= ?)
             AND (end_date IS NULL OR end_date >= ?)`,
            [today, today]
        );

        let bestDiscount = null;
        let bestAmount = 0;
        let bestPriority = 0; // 2 = student, 1 = batch

        for (const discount of discounts) {

            // Check student mapping
            const [studentMap] = await connection.query(
                "SELECT id FROM discount_students WHERE discount_id = ? AND student_id = ?",
                [discount.id, student_id]
            );

            // Check batch mapping
            const [batchMap] = await connection.query(
                "SELECT id FROM discount_batches WHERE discount_id = ? AND batch_id = ?",
                [discount.id, batch_id]
            );

            let priority = 0;

            if (studentMap.length > 0) priority = 2;
            else if (batchMap.length > 0) priority = 1;
            else continue;

            // 🔥 ENGINE INTEGRATION
            const registrationData = {
                fee: original_fee,
                student_id: student_id,
                batch_id: batch_id
            };

            const discountData = {
                type: discount.value_type, // FLAT / PERCENTAGE / EARLY_BIRD
                value: Number(discount.discount_value),
                start_date: discount.start_date,
                end_date: discount.end_date
            };

            const calculatedAmount = DiscountEngine.calculate(
                registrationData,
                discountData
            );

            // Select best discount
            if (
                priority > bestPriority ||
                (priority === bestPriority && calculatedAmount > bestAmount)
            ) {
                bestDiscount = discount;
                bestAmount = calculatedAmount;
                bestPriority = priority;
            }
        }

        // Apply best discount
        if (bestDiscount) {
            discount_amount = bestAmount;
            final_amount = original_fee - discount_amount;
            if (final_amount < 0) final_amount = 0;
            applied_discount_id = bestDiscount.id;
        }

        const registration_code = generateRegistrationCode();

        const [result] = await connection.query(
            `INSERT INTO registrations
            (registration_code, student_id, batch_id, original_fee, discount_amount, final_amount, status)
            VALUES (?, ?, ?, ?, ?, ?, 'ACTIVE')`,
            [
                registration_code,
                student_id,
                batch_id,
                original_fee,
                discount_amount,
                final_amount
            ]
        );

        const registration_id = result.insertId;

        if (applied_discount_id) {
            await connection.query(
                `INSERT INTO registration_discounts
                (registration_id, discount_id, discount_amount)
                VALUES (?, ?, ?)`,
                [registration_id, applied_discount_id, discount_amount]
            );
        }

        await connection.commit();
        connection.release();

        res.status(201).json({
            message: "Registration successful",
            registration_code,
            original_fee,
            discount_applied: applied_discount_id,
            discount_amount,
            final_amount
        });

    } catch (err) {
        await connection.rollback();
        connection.release();
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;