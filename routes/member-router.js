const express = require('express')

const MemberCtrl = require('../controllers/member-ctrl')

const router = express.Router()

router.post('/member', MemberCtrl.createMember)
router.put('/member/:id', MemberCtrl.updateMember)
router.delete('/member/:id', MemberCtrl.deleteMember)
router.get('/member/:id', MemberCtrl.getMemberById)
router.get('/members', MemberCtrl.getMembers)

module.exports = router