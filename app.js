const { json, response } = require("express");
const express = require("express");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

mailchimp.setConfig({
    apiKey: "a6cf4bc98eeda037587022e0bf62774c-us1",
    server: "us1"
});

app.post("/", function(req, res) {
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;
    const listId = "5fa5fc3c88";
    const run = async() => {

        const response = await mailchimp.lists.batchListMembers(listId, {

            members: [{
                email_address: email,
                status: "subscribed",
                update_existing: "true",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }],
        });
        if (response.error_count > 0) {
            res.sendFile(__dirname + "/failure.html");

        } else {
            res.sendFile(__dirname + "/success.html");
        }
    };
    run();

});

app.post("/failure", function(req, res) {
    res.redirect("/");
});

app.listen(process.env.PORT || 5000, function() {
    console.log("Running on port 5000");

});



// Api key 
// a6cf4bc98eeda037587022e0bf62774c-us1

// list ID
// 5fa5fc3c88