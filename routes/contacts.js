const _ = require("lodash");
const jwt = require("jsonwebtoken");
const config = require("config");
const router = require("express").Router();
const { Contact, validate } = require("../models/contact");
const auth = require("../middleware/auth");
const validateID = require("../middleware/validateID");
const catchError = require("../middleware/catchError");

router.get(
  "/",
  auth,
  catchError(async (req, res) => {
    const pageSize =
      parseInt(req.query.pageSize) || config.get("pagination.pageSize");
    const pageNumber =
      parseInt(req.query.pageNumber) || config.get("pagination.pageNumber");
    const total = await Contact.find({
      "user._id": req.user._id
    }).countDocuments();
    if (total === 0) res.status(404).send("No contacts found!!!");

    const pages = Math.ceil(total / pageSize);
    if (pageNumber > pages) res.status(404).send("Invalid page number!!");

    const contacts = await Contact.find({ "user._id": req.user._id })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .select("-__v -user")
      .sort("name");
    const response = {
      total,
      pages,
      current: pageNumber,
      pageSize,
      contacts
    };

    res.send(response);
  })
);

router.post(
  "/",
  auth,
  catchError(async (req, res) => {
    const error = validate(req.body);
    if (error) return res.status(400).send(error);

    const contact = new Contact(_.pick(req.body, ["name", "phone"]));
    contact.user = { _id: req.user._id, name: req.user.name };
    await contact.save();
    res.send(_.pick(contact, ["name", "phone", "_id"]));
  })
);

router.put(
  "/:id",
  [auth, validateID],
  catchError(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact)
      return res.status(404).send("Not found a contact with the given id");

    const error = validate(req.body);
    if (error) return res.status(400).send(error);

    contact.name = req.body.name;
    contact.phone = req.body.phone;
    await contact.save();

    res.send(_.pick(contact, ["name", "phone", "_id"]));
  })
);

module.exports = router;
