const express = require('express');
const router = express.Router();

router.get('/create',(req,res) => {
    res.render('register');
});

module.exports = router;