const express = require('express');
const cookieParser = require('cookie-parser');
const router = express.Router();


const User = require('../models/user');
const Log = require('../models/log');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
router.use(cookieParser());
router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.get('/users', (req, res) => {
    const userData = [
        { name: 'jazz', instrument: 'piano' }
    ];
    res.send(userData);
});

router.post('/records', async(req,res) => {
    console.log('lets update the records');
    let right = req.body.right;
    let wrong = req.body.wrong;
    let time = req.body.time;
    let date = req.body.date;
    let alpha = new Log({
        assigned:'6536a43743c4f57d495f134c',
        date,
        time,
        right,
        wrong
    })
    console.log(alpha);
    alpha = await alpha.save();
})

router.post('/protected', async (req,res) => {
    //grab cookie
    console.log('lets check cookie for the protected route');
    const token = req.cookies['token'];
    console.log(token);
    if(token){
        let decode = await jwt.verify(token,'lololo')
        console.log(decode)
        // await Matrix.find({assigned:user})
        res.json({msg:decode.user})
        // .then(e => res.json({msg:"hi"}));
    }
})

router.post('/newuser', async (req, res) => {
    let { firstname, lastname, username, pword } = req.body;

    let salt = await bcrypt.genSalt(10);
    let pass = await bcrypt.hash(pword, salt);

    console.log('made it to the newuser endpoint');
    let alpha = new User({
        firstName: firstname,
        lastName: lastname,
        userName: username,
        password: pass
    });
    console.log(alpha);
    alpha = await alpha.save();
});

router.post('/results', async (req, res) => {
    console.log('results route');

    // Access specific cookies by name
    const token = req.cookies['token'];
    if (token) {
        console.log('Token:', token);
        // Additional logic for token verification or processing
        let decode = await jwt.verify(token,'lololo')
        console.log(decode);

        await Log.find()
        .then(e => res.json(e));
        
    } else {
        console.log('Token not found in cookies');
    }

});

router.post('/login', async (req, res) => {
    let { username, password } = req.body;
    console.log('user', username);
    let check = await User.find({ userName: username });

    if (check.length === 0) {
        console.log('no user found');
    }
    if (check.length === 1) {
        console.log('we have found you');
        let dbpass = check[0].password;

        let by = await bcrypt.compare(password, dbpass);
        console.log(by);//returns true or false

        let load = {
            user: 'division'
        };

        const token = await jwt.sign(load, 'lololo');

        res.status(202)
            .cookie('token', token, 
            {
                sameSite: 'strict',
                path: '/',
                expires: new Date(new Date().getTime() + 60 * 5000),
                httpOnly: true
            })
            .send('cookie initialized');
    }
    
});

module.exports = router;
