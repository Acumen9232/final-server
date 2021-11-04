const express = require('express')
const route = express.Router()
const controller = require('../controller/userController')
const { check, body } = require('express-validator')
const sqlClient = require(`../dbConnection`).db

sqlClient.getConnection((err) => {
    if (err) {
        console.log(err)
    }
})

route.post("/login", [check(`email`)
    .isEmail()
    .withMessage("Your account must be a email")
    .trim()
    .normalizeEmail(),
    body("password")
    .trim()
    .isAlphanumeric()
    .withMessage("The password contains only letters and numbers")
    .isLength({ min: 8 })
    .withMessage("The password is too short. The Password must be at least 8 characters.")
    .isLength({ max: 16 })
    .withMessage("The password is too long. The Password must be at most 16 characters.")
], controller.postUserLogin)

route.post("/signup", [check('email')
    .trim()
    .isEmail()
    .withMessage("your email is invald")
    .normalizeEmail()
    .custom(value => {
        return sqlClient.execute("SELECT COUNT(`email`) > 0 AS exist FROM `users` WHERE `email` = ?", [value])
            .then(([sqlResil, mata]) => {
                if (sqlResil[0].exist) {
                    return Promise.reject("Email is already in use")
                }
            })
    }),
    body('password')
    .trim()
    .isAlphanumeric()
    .withMessage("The password contains only letters and numbers")
    .isLength({ min: 8 })
    .withMessage("The password is too short. The Password must be at least 8 characters.")
    .isLength({ max: 16 })
    .withMessage("The password is too long. The Password must be at most 16 characters."),

    body('confirmPassword')
    .trim()
    .custom((value, { req }) => {
        if (value != req.body.password) {
            throw Error("The confirm password does not match your password")
        }
        return true
    }),
    // body('firstName')
    // .trim()
    // .isAlphanumeric()
    // .withMessage("FirstName contains only letters and numbers")
    // .isLength({ max: 12 })
    // .withMessage("Your First Name is too long. FirstName must be at most 12 characters."),

    // body("lastName")
    // .trim()
    // .isAlphanumeric()
    // .withMessage("LastName contains only letters and numbers")
    // .isLength({ max: 12 })
    // .withMessage("Your LirstName is too long. FirstName must be at most 12 characters.")
], controller.postUserSignUp)
route.post("/signout", controller.postUserLogOut)

route.post("/checkAuth", controller.checkAuth)

route.post("/logout", (req, res, next) => {

    res.clearCookie("auth")
    res.json({
        success: true,
        message: "user is logout"
    })
})

module.exports = route