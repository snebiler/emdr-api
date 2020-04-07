const Sessions = require("../models/Sessions");
const ErrorResponse = require('../utils/errorResponse');
/**
 * @desc get Session list - not implemented
 * @route GET /api/v1/sessions
 * @access Private
 */
exports.getSessions = (req, res, next) => {
  res.status(200).send("Hello ");
};

/**
 * @desc get single session
 * @route GET /api/v1/session/:id
 * @access Public
 */
exports.getSessionById = async (req, res, next) => {
  console.log("<<<<<<REQ BODY>>>");
  console.log(req.params);

  const session = await Sessions.findOne({ sessionId: req.params.id });

  if (!session) {
    return next(
      new ErrorResponse(`Seans No hatalı. Aranan Seans No: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: session,
  });
};

/**
 * @desc create single session
 * @route POST /api/v1/session/id
 * @access Private
 */
exports.createSession = async (req, res, next) => {
  // res.status(200).send("session created")

  console.log(req.body);

  const session = await Sessions.create(req.body);

  res.status(200).json({
    success: true,
    data: session,
  });
};

/**
 * @desc update a session
 * @route PUT /api/v1/session/id
 * @access Private
 */
exports.updateSession = async (req, res, next) => {
  console.log("<<<<<<REQ BODY>>>");
  console.log(req.body);
  // console.log(req);

  const session = await Sessions.findById(req.body._id);

  if (!session) {
    return next(
      new ErrorResponse(`Seans No hatalı. Aranan Seans No: ${req.params.id}`, 404)
    );
  }

//   console.log("<<<<<<BEFORE UPDATE:>>>");
//   console.log(session);

  for (const key of Object.keys(req.body)) {
    session[key] = req.body[key];
  }

  let io = req.app.get("io");
  // console.log(io);

  io.on("react", (data) => console.log(data));
  io.emit("fromServer", { hasSessionChanged: true });

//   console.log("<<<<<<AFTER UPDATE:>>>");
//   console.log(session);
  session.save();
  res.status(200).json({ success: true, data: session });
};
/**
 * @desc delete session
 * @route DELETE /api/v1/session/:id
 * @access Private
 */
exports.deleteSession = async (req, res, next) => {
  console.log(req.body);

  const sessionDeleted = await Sessions.findByIdAndDelete(req.body._id);
  if (!sessionDeleted) {
    return next(
      new ErrorResponse(`Seans No hatalı. Aranan Seans No: ${req.params.id}`, 404)
    );
  }
//   console.log(sessionDeleted);

  res.status(200).json({ success: true, data: sessionDeleted });
};
