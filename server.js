// const express = require("express");
// const mongoose = require("mongoose");
// const path = require("path");
// const methodOverride = require("method-override");
// const ejsMate = require("ejs-mate");

// const Report = require("./models/report.js"); // Adjust model if needed

// const app = express();

// // MongoDB Connection URL
// const MONGO_URL = "mongodb://127.0.0.1:27017/disasterDB";

// // Connect to MongoDB
// main()
//   .then(() => {
//     console.log("Connected to the Database");
//   })
//   .catch((err) => {
//     console.log("MongoDB Connection Error:", err);
//   });

// async function main() {
//   await mongoose.connect(MONGO_URL);
// }

// // View Engine Setup
// app.engine("ejs", ejsMate); // Support for layouts
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

// // Middleware
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(express.static(path.join(__dirname, "public")));
// app.use(methodOverride("_method"));

// // Root Route
// app.get("/", (req, res) => {
//   res.send("Welcome to the Disaster Management App Backend!");
// });

// // Sample Route to Test Mongo Connection
// app.get("/test", async (req, res) => {
//   const sample = new Report({
//     name: "Test Person",
//     message: "This is a test entry.",
//     location: { lat: 19.076, lng: 72.8777 },
//     status: "pending",
//   });
//   await sample.save();
//   res.send("Sample report saved to database!");
// });

// // Listening Port
// app.listen(8080, () => {
//   console.log("Server is running on port 8080");
// });

const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");

const Report = require("./models/report.js");

const app = express();
const MONGO_URL = "mongodb://127.0.0.1:27017/disasterDB";

// MongoDB Connection
main()
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log("DB Connection Error:", err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

// View Engine Setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// 🌐 Root
app.get("/", (req, res) => {
  res.redirect("/home");
});

// ------------------------------
// REPORTS ROUTES
// ------------------------------

// Index - Show all reports
app.get("/reports", async (req, res) => {
  const allReports = await Report.find({});
  res.render("reports/index.ejs", { allReports });
});

// New - Form to add a new report
app.get("/reports/new", (req, res) => {
  res.render("reports/new.ejs");
});

// Create - Save new report
app.post("/reports", async (req, res) => {
  const newReport = new Report(req.body.report);
  await newReport.save();
  res.redirect("/reports");
});

// Show - Show specific report by ID
app.get("/reports/:id", async (req, res) => {
  const { id } = req.params;
  const report = await Report.findById(id);
  res.render("reports/show.ejs", { report });
});

// Edit - Show edit form
app.get("/reports/:id/edit", async (req, res) => {
  const { id } = req.params;
  const report = await Report.findById(id);
  res.render("reports/edit.ejs", { report });
});

// Update - Submit edited form
app.put("/reports/:id", async (req, res) => {
  const { id } = req.params;
  await Report.findByIdAndUpdate(id, { ...req.body.report });
  res.redirect(`/reports/${id}`);
});

// Delete - Remove report
app.delete("/reports/:id", async (req, res) => {
  const { id } = req.params;
  await Report.findByIdAndDelete(id);
  res.redirect("/reports");
});

app.get("/home", (req, res) => {
  res.render("pages/home");
});

app.get("/media", (req, res) => {
  res.render("pages/media");
});

app.get("/donate", (req, res) => {
  res.render("pages/donate");
});

app.get("/livemap", (req, res) => {
  res.render("pages/livemap");
});

// Start Server
app.listen(8080, () => {
  console.log("Server running on http://localhost:8080");
});
