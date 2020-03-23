const express = require("express");
const router = express.Router();
const { 
    getSessions,
    getSessionById,
    createSession,
    updateSession,
    deleteSession,
 } = require('../controllers/sessionControllers');

router.route("/").get(getSessions).post(createSession);
router.route("/:id").get(getSessionById).put(updateSession).delete(deleteSession);

module.exports = router;