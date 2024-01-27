// Create web server
// 1. Create web server
// 2. Create a route handler for "/"
// 3. Have the route handler return a form
// 4. Have the route handler for POST requests to "/" log the body of the request to the console
// 5. Have the route handler redirect to "/"

// 1. Create web server
const express = require("express");
const bodyParser = require("body-parser");
const {check, validationResult} = require("express-validator");
const {sanitizeBody} = require("express-validator");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(bodyParser.urlencoded({extended: false}));

// 2. Create a route handler for "/"
app.get("/", (req, res) => {
  // 3. Have the route handler return a form
  res.send(`
    <html>
      <body>
        <form action="/" method="POST">
          <input type="text" name="comment" />
          <button type="submit">Submit</button>
        </form>
      </body>
    </html>
  `);
});

// 4. Have the route handler for POST requests to "/" log the body of the request to the console
app.post(
  "/",
  [
    // Validate that the comment field is not empty
    check("comment").not().isEmpty().withMessage("Comment cannot be empty"),
    // Sanitize the comment field
    sanitizeBody("comment").trim().escape(),
  ],
  (req, res) => {
    // 5. Have the route handler redirect to "/"
    // Get the validation result
    const errors = validationResult(req);
    // If there are errors
    if (!errors.isEmpty()) {
      // Send the error messages
      return res.send(errors.array()[0].msg);
    }
    // Get the comment from the request body
    const comment = req.body.comment;
    // Log the comment to the console
    console.log(comment);
    // Append the comment to the file
    fs.appendFileSync(path.join(__dirname, "comments.txt"), comment + "\n");
    // Redirect to the home page
    res.redirect("/");
  }
);

// Listen on port 3000
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
