const sqlClient = require("../dbConnection").db
const { validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
sqlClient.getConnection((err, result) => {

})
exports.postUserLogin = (req, res, next) => {
    const { email, password } = req.body
    const errorMessage = validationResult(req)
    const response_message = {
        success: false,
        message: "user login"
    }

    if (!errorMessage.isEmpty()) {
        const errorMsg = errorMessage.array()[0].msg
        response_message.success = false
        response_message.message = errorMsg
        res.json(response_message)
    } else {
        sqlClient.execute("SELECT * FROM `users` WHERE `email`=?", [email])
            .then(([sqlResult, mata]) => {
                console.log(sqlResult)
                if (sqlResult.length <= 0) {
                    response_message.success = false
                    response_message.message = "Email or Password is incorrect!"
                    res.json(response_message)
                } else {
                    console.log(password)
                    if (password != undefined || sqlResult[0].Password != undefined) {
                        bcrypt.compare(password, sqlResult[0].Password)
                            .then(result => {
                                if (result) {
                                    //password is correct
                                    const JWTData = {
                                        user_id: sqlResult[0].UID,
                                        firstName: sqlResult[0].firstName,
                                        lastName: sqlResult[0].lastName,
                                        email: sqlResult[0].email
                                    }

                                    const user_jwt = jwt.sign(JWTData, process.env.JWT_KEY, {
                                        expiresIn: "30m"
                                    })

                                    const cookie_option = {
                                        expires: new Date(Date.now() + process.env.COOKIE_EXPIRED * 60 * 1000)
                                    }
                                    response_message.success = true
                                    response_message.message = "user logined in"
                                    res.cookie("auth", user_jwt, cookie_option)
                                    res.json(response_message)

                                } else {
                                    response_message.success = false
                                    response_message.message = "Email or Password is incorrect!"
                                    res.json(response_message)
                                }
                            })
                            .catch(err => {
                                console.log(err)
                            })
                    } else {
                        console.log("pw is empty")
                    }

                }
            })
            .catch(err => {
                console.log(err)
            })
    }



}

exports.postUserSignUp = (req, res, next) => {
    const { email, password, firstName, lastName } = req.body
    const errorMessage = validationResult(req)
    const response_message = {
        success: false,
        message: ""
    }

    if (!errorMessage.isEmpty()) {
        console.log(errorMessage)
        const errMsg = errorMessage.array()[0].msg
        console.log(errMsg)
        response_message.success = false
        response_message.message = errMsg
        res.json(response_message)
    } else {
        //bcrypt password and insert into database
        bcrypt.hash(password, 10)
            .then(value => {
                console.log(value)
                return sqlClient.execute("INSERT INTO `users`(`Email`,`Password`,`FirstName`,`LastName`) VALUES(?,?,?,?)", [email, value, firstName, lastName])
            })
            .then(([sqlResult, meta]) => {
                console.log(sqlResult)
                response_message.success = true
                response_message.message = "siginup succeed"
                res.json(response_message)

            })
            .catch(err => {
                console.log(err)
            })
    }


}

exports.postUserLogOut = (req, res, next) => {
    const response_message = {
        success: true,
        message: "user logout"
    }

    res.json(response_message)
}