const express= require('express');
const usersControllers= require('../controllers/users-controllers')


const router= express.Router()


router.patch('/social',usersControllers.socialogin)
router.patch('/resetpass',usersControllers.resetpas)
router.patch('/changepass',usersControllers.changepass)
router.post('/forget',usersControllers.forget)
router.get('/admin',usersControllers.demo)
router.post('/signup', usersControllers.signup)
router.post('/login', usersControllers.login)
router.get('/',usersControllers.demo)


module.exports= router;