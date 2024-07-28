const express= require('express');
const usersControllers= require('../controllers/users-controllers')
const historyControllers=require('../controllers/history-controllers')
const adminControllers=require('../controllers/admin-controllers')


const router= express.Router()


router.patch('/social',usersControllers.socialogin)
router.patch('/resetpass',usersControllers.resetpas)
router.patch('/changepass',usersControllers.changepass)
router.post('/forget',usersControllers.forget)
router.post('/signup', usersControllers.signup)
router.post('/login', usersControllers.login)
router.get('/',usersControllers.demo)
router.post('/subscribe',usersControllers.subscribe)
router.get('/history', historyControllers.demo)
router.post('/createnote', historyControllers.createnote)
router.post('/historynotes', historyControllers.alldata)
router.post('/deletenote', historyControllers.deletenote)
router.get('/admin',adminControllers.demo)
router.post('/admin/login', adminControllers.login)
router.post('/admin/forget',adminControllers.forget)
router.patch('/admin/resetpass',adminControllers.resetpass)
router.get('/admin/users',adminControllers.allusers)
router.post('/admin/deleteuser',adminControllers.deleteuser)
router.post('/admin/adduser',adminControllers.adduser)
router.post('/admin/edituser',adminControllers.edituser)
router.get('/admin/subscriptions',adminControllers.allsubscriptions)
router.post('/admin/changepass',adminControllers.changepass)
router.post('/admin/changename',adminControllers.changename)
router.post('/admin/changeemail',adminControllers.changeemail)
module.exports= router;