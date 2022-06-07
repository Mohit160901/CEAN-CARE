//mongo schemas
const Users = require("../models/Users");
const Labs = require("../models/Labs");
const Doctors = require("../models/Doctors");
const Tests = require("../models/Tests");
const Appointments = require("../models/Appointments");

exports.validateUser = (req, res, next) => {
  Users.find({ username: req.body.username, password: req.body.pass })
    .then((result) => {
      if (result.length > 0) {
        res.cookie("userData", 1, { overwrite: true });
        res.cookie("username", req.body.username, { overwrite: true });
        res.redirect("/");
      } else if (req.cookies.userData) {
        res.redirect("/");
      } else {
        res.redirect("/login");
      }
    })
    .catch((err) => {
      console.log(err);
    });

  // if (req.body.username != "" && req.body.pass == "123456") {
  //   res.cookie("userData", 1, { overwrite: true });
  //   res.cookie("username", req.body.username, { overwrite: true });
  //   res.redirect("/");
  // } else if (req.cookies.userData) {
  //   console.log("else if");
  //   res.redirect("/");
  // } else {
  //   console.log("else");
  //   res.redirect("/login");
  // }
};

exports.getIndexPage = (req, res, next) => {
  res.render("index", {
    pageTitle: "Index",
    props: req.cookies.username,
    path: "/index",
  });
};

exports.getLoginPage = (req, res, next) => {
  res.clearCookie('userData');
  res.clearCookie('username');
  res.render("login", {
    pageTitle: "Login",
    path: "/login",
  });
};

exports.getSignUp = (req, res, next) => {
  res.render("Signup", {
    pageTitle: "signup",
    path: "/signup",
  });
};

exports.getConsultPage = (req, res, next) => {
  if(req.cookies.userData){
    Doctors.find().then((docs) => {
      res.render("consult", {
        pageTitle: "consult",
        docs: docs,
        props: req.cookies.username,
        path: "/consult",
      });
    });
  } else {
    res.redirect("/login")
  }
};

exports.getBookLabPage = (req, res, next) => {
  if(req.cookies.userData){
    var test = "";
    var addr = "";
    var date = "";
    var city = "";
    Tests.find().then((lab_tests) => {
      Labs.find().then((labs) => {
        res.render("book-lab", {
          pageTitle: "book-lab",
          props: req.cookies.username,
          labs: labs,
          test: test,
          lab_tests: lab_tests,
          addr: addr,
          date: date,
          city: city,
          path: "/book-lab",
        });
      });
    });
  } else { 
    res.redirect("/login");
  }
};

exports.postBookLabPage = (req, res, next) => {
  if(req.cookies.userData){
    Tests.find().then((lab_tests) => {
      Labs.find({ addr_filter: req.body.city }).then((labs) => {
        res.render("book-lab", {
          pageTitle: "book-lab",
          props: req.cookies.username,
          labs: labs,
          lab_tests: lab_tests,
          test: req.body.searchbar,
          addr: req.body.address,
          date: req.body.date,
          city: req.body.city,
          path: "/book-lab",
        });
      });
    });
  } else {
    res.redirect("/login");
  }
};

exports.logOut = (req, res, next) => {
  res.clearCookie('userData');
  res.clearCookie('username');
  res.clearCookie('admin');
  res.redirect("/");
};

exports.getAbout = (req, res, next) => {
  res.render("About", {
    pageTitle: "About",
    props: req.cookies.username,
    path: "/about",
  });
};

exports.getBlog = (req, res, next) => {
  res.render("Blog", {
    pageTitle: "Blog",
    props: req.cookies.username,
    path: "/blog",
  });
};

exports.getContact = (req, res, next) => {
  res.render("contact", {
    pageTitle: "contact",
    props: req.cookies.username,
    path: "/contact",
  });
};

exports.postSignup = (req, res, next) => {
  // console.log(req.body.first_name);
  // console.log(req.body.last_name);
  // console.log(req.body.birthday);
  // console.log(req.body.gender);
  // console.log(req.body.email);
  // console.log(req.body.phone);
  // console.log(req.body.username);
  // console.log(req.body.password);
  // res.redirect("/login");
  const users = Users({
    firstname: req.body.first_name,
    lastname: req.body.last_name,
    dob: req.body.birthday,
    gender: req.body.gender,
    email: req.body.email,
    phoneno: req.body.phone,
    username: req.body.username,
    password: req.body.password,
  });

  users
    .save()
    .then((result) => {
      console.log("Registration succesfull");
      res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getSlotPage = (req, res, next) => {
  res.render("slot_avail", {
    pageTitle: "slot_avail",
    path: "/slot-avail",
  });
};

exports.postBookAppointment = (req, res, next) => {
  const id = req.body.labId;
  //console.log(id);
  Labs.find({ _id: id }).then((labs) => {
    //console.log("Booked lab is: ",result[0].labname);
    Users.find({ username: req.cookies.username }).then((users) => {
      const appointment = Appointments({
        user_id: req.cookies.username,
        username: users[0].firstname + " " + users[0].lastname,
        email: users[0].email,
        labname: labs[0].labname,
        lab_addr: labs[0].addr,
        testname: req.body.testId,
      });
      var username = users[0].firstname + " " + users[0].lastname;
      appointment.save().then((result) => {
        console.log("Appointment created succesfully");
        Appointments.find({ user_id: req.cookies.username }).then((appt) => {
          res.redirect("/generatePDF");
          //res.redirect("/book-lab");
        });
      });
    });
  });
};

exports.getAdminLoginPage = (req, res, next) => {
  if(req.cookies.admin){
    res.redirect("/admin");
  } else {
    res.render("admin-login", {
      pageTitle: "Admin-Login",
      props: req.cookies.username,
      path: "/admin-login",
    });
  }
};

exports.validateAdmin = (req, res, next) => {
  if (req.body.adminId == "admin" && req.body.pass == "admin") {
    res.cookie("admin", 1, { overwrite: true });
    res.redirect("/admin");
  }
  else {
    res.redirect("/admin-login");
  }
};

exports.getAdminPage = (req, res, next) => {
  if(req.cookies.admin){
    Appointments.find().sort({ updatedAt: -1 }).then((appt) => {
      res.render("admin", {
        pageTitle: "Admin",
        props: req.cookies.username,
        appt: appt,
        path: "/admin",
      });
    })  
  } else {
    res.redirect("/admin-login");
  }
  
};
