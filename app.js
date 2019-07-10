const express = require('express')
const app = express()
const Joi = require('@hapi/joi')
const port = 5000

app.use(express.json())

//local database using arrays
const users = []

const schema = Joi.object().keys({
    firstname: Joi.string().alphanum().min(3).max(30).required(),
    lastname: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email({ minDomainSegments: 2 }),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,15}$/),
})

app.post('/users', (req, res) => {
    //check the type of user input
    if (!req.is('application/json')) {
        res.status(400).send({
            status: 400,
            error: "input can only be in json format"
        })
    }
    else {
        // json input from the user
        const user = req.body

        // validation
        const result = Joi.validate(user, schema)
        if (result.error) {
            res.status(400).send({
                status: 400,
                error: result.error.details[0].message
            })
        }
        else {
            // add user to our database if there are no errors
            users.push(user)
            res.status(200).send({
                status: 200,
                message: "user created successfully",
                data: user
            })
        }

    }


})

app.get('/users', (req, res) => {
    //get created user if validation passes
    res.status(200).send({
        status: 200,
        message: "users fetched successfully",
        data: users
    })

})

app.listen(port, () => {
    console.log(`app running on port ${port}`)
})
