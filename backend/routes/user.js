const express = require('express')
const zod = require('zod');
const router = express.Router()
const { User } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware")
const {Account} = require("../db");

const signupBody = zod.object({
    username: zod.string().email(),
	firstName: zod.string(),
	lastName: zod.string(),
	password: zod.string()
})

router.post("/signup", async (req, res) => {
    const validationResult = signupBody.safeParse(req.body);
    if (!validationResult.success) {
        return res.status(400).json({
            message: "Validation failed: Incorrect inputs"
        });
    }

    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
        return res.status(409).json({ 
            message: "Email already taken"
        });
    }

    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    });

    await Account.create({
        userId: user._id,
        balance: 1 + Math.random() * 10000
    });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token
    });
});


const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string()
})

router.post("/signin", async(req,res) => {
    const {success} = signinBody.safeParse(req.body)
    if(!success){
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }
    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    })

    if(user){
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);

        res.json({
            token: token
        })
        return;
    }

    res.status(411).json({
        message: "Error while loggin in"
    })

})

router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        const userInfo = {
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
        };

        res.json(userInfo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});


const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional()
})

router.post("/", authMiddleware, async (req,res)=>{
    const { success } = updateBody.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message: "Error while updating user information"
        })
    }

    await User.updateOne(req.body,{
        _id: req.userId
    })

    res.json({
        message: "Updated successfully"
    })
})

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

module.exports = router;