const router = require("express").Router();
const Forum = require("../models/forum/forum");

router.route("/create").post(async (req, res) => {
    //route for creating database insertion
    const {
        profileId,
        challengeId,
        name,
        solution,
        time
    } = req.body;

    const profile = new Forum({
        profileId,
        challengeId,
        name,
        solution,
        time
    });

    await profile
        .save()
        .then(() => res.status(200).json({ success: true }))
        .catch((error) => res.status(500).json({ success: false, error: error })); // else save to the db
});

router.route("/").get(async (req, res) => {
    //route for fetching al the data
    await Forum.find()
        .then((Profile) => res.json(Profile))
        .catch((error) => res.status(500).json({ success: false, error: error }));
});

router.route("/get/:id").get(async (req, res) => {
    //route for getting a relavant document using id
    const { id } = req.params;

    await Forum.findById(id) //find by the document by id
        .then((todo) => res.json(todo))
        .catch((error) => res.status(500).json({ success: false, error: error }));
});

router.route("/delete/:id").delete(async (req, res) => {
    //route for deleting a relavant document using id
    const { id } = req.params;

    await Forum.findByIdAndDelete(id) //find by the document by id and delete
        .then(() => res.json({ message: "Successfully Deleted" }))
        .catch((error) => res.status(500).json({ success: false, error: error }));
});

router.route("/update/:id").put(async (req, res) => {
    //route for updating a relavant document using id
    //backend route for updating relavant data and passing back
    const { id } = req.params;
    const {
        profileId,
        challengeId,
        name,
        solution,
        time
    } = req.body;

    await Forum.findByIdAndUpdate(id, {
        profileId,
        challengeId,
        name,
        solution,
        time
    }) //find the document by and update the relavant data
        .then(() => res.json({ success: true }))
        .catch((error) => res.json({ success: false, Error: error }));
});


module.exports = router;
