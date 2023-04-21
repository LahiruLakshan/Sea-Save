const router = require("express").Router();
const Profile = require("../models/profile/profile");

router.route("/create").post(async (req, res) => {
    //route for creating database insertion
    const {
        name,
        email,
        contactNo,
        password,
        type,
        adminApproval
    } = req.body;

    const profile = new Profile({
        name,
        email,
        contactNo,
        password,
        type,
        adminApproval
    });

    await profile
        .save()
        .then(() => res.status(200).json({ success: true }))
        .catch((error) => res.status(500).json({ success: false, error: error })); // else save to the db
});

router.route("/").get(async (req, res) => {
    //route for fetching al the data
    await Profile.find()
        .then((Profile) => res.json(Profile))
        .catch((error) => res.status(500).json({ success: false, error: error }));
});

router.route("/get/:id").get(async (req, res) => {
    //route for getting a relavant document using id
    const { id } = req.params;

    await Profile.findById(id) //find by the document by id
        .then((todo) => res.json(todo))
        .catch((error) => res.status(500).json({ success: false, error: error }));
});

router.route("/delete/:id").delete(async (req, res) => {
    //route for deleting a relavant document using id
    const { id } = req.params;

    await Profile.findByIdAndDelete(id) //find by the document by id and delete
        .then(() => res.json({ message: "Successfully Deleted" }))
        .catch((error) => res.status(500).json({ success: false, error: error }));
});

router.route("/update/:id").put(async (req, res) => {
    //route for updating a relavant document using id
    //backend route for updating relavant data and passing back
    const { id } = req.params;
    const {
        name,
        email,
        contactNo,
        password,
        type,
        adminApproval
    } = req.body;

    await Profile.findByIdAndUpdate(id, {
        name,
        email,
        contactNo,
        password,
        type,
        adminApproval
    }) //find the document by and update the relavant data
        .then(() => res.json({ success: true }))
        .catch((error) => res.json({ success: false, Error: error }));
});


module.exports = router;
