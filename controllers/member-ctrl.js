
const Member = require('../models/member-model')

createMember = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a member',
        })
    }

    const member = new Member(body)

    if (!member) {
        return res.status(400).json({ success: false, error: err })
    }

    member
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: member._id,
                message: 'Member created!',
            })
        })
        .catch(error => {
            console.log(error);
            return res.status(400).json({
                error,
                message: 'Member not created!',
            })
        })
}

updateMember = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Member.findOne({ _id: req.params.id }, (err, member) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Member not found!',
            })
        }
        member.name = body.name
        member.time = body.time
        member.rating = body.rating
        member
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: member._id,
                    message: 'Member updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Member not updated!',
                })
            })
    })
}

deleteMember = async (req, res) => {
    await Member.findOneAndDelete({ _id: req.params.id }, (err, member) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!member) {
            return res
                .status(404)
                .json({ success: false, error: `Member not found` })
        }

        return res.status(200).json({ success: true, data: member })
    }).catch(err => console.log(err))
}

getMemberById = async (req, res) => {
    await Member.findOne({ _id: req.params.id }, (err, member) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!member) {
            return res
                .status(404)
                .json({ success: false, error: `Member not found` })
        }
        return res.status(200).json({ success: true, data: member })
    }).catch(err => console.log(err))
}

getMembers = async (req, res) => {
    await Member.find({}, (err, members) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!members.length) {
            return res
                .status(404)
                .json({ success: false, error: `Member not found` })
        }
        return res.status(200).json({ success: true, data: members })
    }).catch(err => console.log(err))
}

module.exports = {
    createMember,
    updateMember,
    deleteMember,
    getMembers,
    getMemberById,
}