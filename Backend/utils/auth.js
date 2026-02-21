

// module.exports = { authUser, authorizeRoles }
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const config = require('./config')
const result = require('../utils/result')
const db = require('../db/pool')


// =====================================
// 1️⃣ LOGIN API
// =====================================
router.post('/login', async (req, res) => {

    const { email, password } = req.body

    try {

        const [rows] = await db.query(
            "SELECT * FROM users WHERE email = ? AND password = ?",
            [email, password]
        )

        if (rows.length === 0) {
            return res.status(401).send(
                result.createResult('Invalid email or password')
            )
        }

        const user = rows[0]

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            config.SECRET,
            { expiresIn: '8h' }
        )

        res.send(
            result.createResult(null, { token })
        )

    } catch (err) {
        res.status(500).send(
            result.createResult(err.message)
        )
    }
})


// =====================================
// 2️⃣ Authenticate Middleware
// =====================================
function authUser(req, res, next) {

    if (
        req.originalUrl.startsWith('/auth/login') ||
        req.originalUrl.startsWith('/common/health')
    ) {
        return next()
    }

    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).send(
            result.createResult('Authorization header missing')
        )
    }

    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).send(
            result.createResult('Invalid authorization format')
        )
    }

    const token = authHeader.split(' ')[1]

    try {
        const payload = jwt.verify(token, config.SECRET)

        req.user = {
            id: payload.id,
            email: payload.email,
            role: payload.role
        }

        next()

    } catch (err) {
        return res.status(401).send(
            result.createResult('Invalid or Expired Token')
        )
    }
}


// =====================================
// 3️⃣ Role Authorization
// =====================================
function authorizeRoles(...allowedRoles) {

    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).send(
                result.createResult('Not authenticated')
            )
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).send(
                result.createResult('Unauthorized Access')
            )
        }

        next()
    }
}


module.exports = { router, authUser, authorizeRoles }