const path = require("path");

const express = require("express");

const appController = require("../controllers/app-functions");

const router = express.Router();

router.get("/", appController.getIndexPage);

router.post("/", appController.getIndexPage);

router.post("/validate", appController.validateUser);

router.get("/login", appController.getLoginPage);

router.post("/signup", appController.postSignup);

router.get("/signup", appController.getSignUp);

router.get("/book-lab", appController.getBookLabPage);

router.post("/book-lab", appController.postBookLabPage);

router.get("/consult", appController.getConsultPage);

router.get("/about", appController.getAbout);

router.get("/blog", appController.getBlog);

router.get("/contact", appController.getContact);

router.get("/logout", appController.logOut);

router.get("/slot-avail", appController.getSlotPage);

router.post("/bookAppointment", appController.postBookAppointment);

router.post("/validateAdmin", appController.validateAdmin);

router.get("/admin-login", appController.getAdminLoginPage);

router.get("/admin", appController.getAdminPage);

module.exports = router;
