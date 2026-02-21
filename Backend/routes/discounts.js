const express = require('express');
const router = express.Router();
const db = require('../db/pool');



router.post('/', async (req, res) => {
    try {
        const {
            discount_name,
            discount_type_id,
            value_type,
            discount_value,
            start_date,
            end_date
        } = req.body;

        if (!discount_name || !discount_type_id || !value_type || !discount_value) {
            return res.status(400).json({ message: "Required fields missing" });
        }

        if (!['FLAT', 'PERCENTAGE'].includes(value_type)) {
            return res.status(400).json({ message: "Invalid value_type" });
        }

        const [result] = await db.query(
            `INSERT INTO discounts
            (discount_name, discount_type_id, value_type, discount_value, start_date, end_date)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [discount_name, discount_type_id, value_type, discount_value, start_date, end_date]
        );

        res.status(201).json({
            message: "Discount created successfully",
            id: result.insertId
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM discounts ORDER BY id DESC"
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM discounts WHERE id = ?",
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Discount not found" });
        }

        res.json(rows[0]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



router.put('/:id', async (req, res) => {
    try {
        const {
            discount_name,
            discount_type_id,
            value_type,
            discount_value,
            start_date,
            end_date,
            is_active
        } = req.body;

        const [result] = await db.query(
            `UPDATE discounts SET
                discount_name = ?,
                discount_type_id = ?,
                value_type = ?,
                discount_value = ?,
                start_date = ?,
                end_date = ?,
                is_active = ?
             WHERE id = ?`,
            [
                discount_name,
                discount_type_id,
                value_type,
                discount_value,
                start_date,
                end_date,
                is_active,
                req.params.id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Discount not found" });
        }

        res.json({ message: "Discount updated successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query(
            "DELETE FROM discounts WHERE id = ?",
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Discount not found" });
        }

        res.json({ message: "Discount deleted successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch('/:id/toggle', async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT is_active FROM discounts WHERE id = ?",
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Discount not found" });
        }

        const newStatus = rows[0].is_active ? 0 : 1;

        await db.query(
            "UPDATE discounts SET is_active = ? WHERE id = ?",
            [newStatus, req.params.id]
        );

        res.json({ message: "Discount status updated", is_active: newStatus });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;