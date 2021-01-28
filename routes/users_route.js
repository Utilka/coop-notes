const express = require('express');
const router  = express.Router();


router.get('/', (req,res)=>{
  res.render('welcome');
})

router.get('/login',(req,res)=>{
  res.render('login');
})
router.get('/register',(req,res)=>{
  res.render('register')
})

router.post('/login',(req,res,next)=>{
})
router.post('/register',(req,res)=>{
})

//logout
router.get('/logout',(req,res)=>{
})

module.exports = router; 