const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const flash = require("connect-flash");
var cookieParser = require("cookie-parser");
var session = require("express-session");
const nodemailer = require("nodemailer");

//pdf generator
const PDFDocument = require("pdfkit");
const fs = require("fs");
const Users = require("./models/Users");
const Labs = require("./models/Labs");
const Appointments = require("./models/Appointments");

const app = express();

app.use(cookieParser());
app.set("view engine", "ejs");
app.set("views", "views");

const varRoutes = require("./routes/health-care");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(flash());
app.use(
  session({
    cookie: { maxAge: 60000 },
    secret: "woot",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(varRoutes);

//cean-care mailing system
app.post("/sendMail", function (req, res) {

  var apptId = req.body.apptId;
  var email = req.body.email;
  var user_id = req.body.user_Id;
    

  //testing
  // console.log("appt id",apptId)
  // console.log("User ID : ",user_id)
  // console.log("Email : ",email)

   var path =  `./pdfs/${user_id}_${apptId}_report.pdf`
  // console.log(typeof email,"Email : ",email)
  // console.log(typeof path,"Path : ",path)
  
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ceancare@gmail.com",
      pass: "ceancare@00",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  let mailoptions = {
    from: "ceancare@gmail.com",
    to: email, // take value from database to send
    subject: "Report",
    text: "Thank you for using our services and coorporating with our procedures",
    attachments: [
      {
        path: path,
      },
    ],
  };

  transporter.sendMail(mailoptions, function (err, success) {
    if (err) {
      console.log(err);
    } else {
      console.log("email sent");
    }
  });
  res.redirect("/admin")
});

//lab report generator
app.get("/generatePDF", function (req, res) {
  Users.find({ username: req.cookies.username }).then((users) => {
    Appointments.find({})
      .sort({ _id: -1 })
      .limit(1)
      .then((appt) => {
        // Create a document
        var userid = req.cookies.username;
        var username = users[0].firstname + " " + users[0].lastname;
        var dob = "" + users[0].dob;
        var date = "" + appt[0].createdAt;
        var date = date.substring(0, 16);
        var gender = "" + users[0].gender;
        var labname = "" + appt[0].labname;
        var lab_addr = "" + appt[0].lab_addr;
        var phoneno = "" + users[0].phoneno;
        var apptid = "" + appt[0]._id;

        //testing
        console.log(typeof date, "Date :", date);
        console.log(typeof labname, "labname :", labname);
        console.log(typeof lab_addr, "lab_addr :", lab_addr);
        console.log(typeof phoneno, "phoneno :", phoneno);
        console.log(typeof apptid, "apptid :", apptid)

        const doc = new PDFDocument();

        // Saving the pdf file in root directory.
        doc.pipe(fs.createWriteStream(`./pdfs/${userid}_${apptid}_report.pdf`));

        // Adding functionality
        doc.image("./pdf_images/CEAN.png", 10, 10, {
          fit: [120, 100],
          align: "left",
          valign: "left",
        });

        doc.fontSize(15).text(lab_addr, 120, 65);

        doc
          .moveTo(3, 100) // set the current point
          .lineTo(610, 100) // draw a line
          .stroke();

        doc
          .fontSize(27)
          .text("Pythology Lab Report", 100, 120, { align: "center" });

        // Adding an image in the pdf.
        doc
          .moveTo(3, 170) // set the current point
          .lineTo(610, 170) // draw a line
          .stroke();

        //   text data for patirnt report

        doc.fontSize(12).text(labname, 215, 190);
        doc.fontSize(12).text("LAB NO:", 50, 300);
        doc.fontSize(12).text("02", 120, 300); //Add the value here from DB

        doc.fontSize(12).text("PATIENT NAME:", 50, 325);
        doc.fontSize(12).text(username, 150, 325); //Add the value here from DB

        doc.fontSize(12).text("DOB:", 50, 350);
        doc.fontSize(12).text(dob, 100, 350); //Add the value here from DB

        // doc.fontSize(12).text("SAMPLE COLL. AT:", 50, 375);
        // doc.fontSize(12).text("Value Here", 165, 375);

        doc.fontSize(12).text("DATE:", 400, 300);
        doc.fontSize(12).text(date, 445, 300); //Add the value here from DB

        doc.fontSize(12).text("SEX:", 400, 325);
        doc.fontSize(12).text(gender, 435, 325); //Add the value here from DB

        doc.fontSize(12).text("Blood Group", 400, 345);
        doc.fontSize(12).text("B+", 470, 345);

        doc.fontSize(12).text("Phone no.", 400, 370);
        doc.fontSize(12).text(phoneno, 450, 370);

        doc
          .moveTo(3, 410) // set the current point
          .lineTo(610, 410) // draw a line
          .stroke();

        doc
          .moveTo(3, 455) // set the current point
          .lineTo(610, 455) // draw a line
          .stroke();

        doc.fontSize(12).text("TEST:", 50, 505, { underline: 2 });
        doc.fontSize(11).text("C-Reactive Protein", 50, 545);
        doc.fontSize(11).text("Titre", 50, 560);

        doc.fontSize(12).text("RESULT:", 260, 505, { underline: 2 });
        doc.fontSize(11).text("POSITIVE", 260, 545);
        doc.fontSize(11).text("1:4", 260, 560);

        doc.fontSize(12).text("NORMAL VALUES:", 455, 505, { underline: 2 });

        doc.fontSize(10).fillColor("blue").text("Method :- CRC", 50, 590);

        doc.image("./pdf_images/verified.jpg", 280, 650, {
          fit: [67, 67],
          align: "left",
          valign: "left",
        });
        // Finalize PDF file
        doc.end();
        console.log("pdf generated");
        res.redirect("/book-lab");
      });
  });
});

mongoose
  .connect(
    "mongodb+srv://shadab:Shadab143117191@project.7u1c9.mongodb.net/health-care",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    app.listen(5000);
    console.log("Browser URL: localhost:5000");
    console.log("MongoDB connection established");
  })
  .catch((err) => {
    console.log(err);
  });

// app.listen(5000);
// console.log("Browser URL: localhost:5000");
