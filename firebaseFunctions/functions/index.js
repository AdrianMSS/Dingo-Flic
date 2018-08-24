// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
// Configure the email transport using the default SMTP transport and a GMail account.
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

admin.initializeApp();



const express = require('express');
const cors = require('cors')({origin: true});
var bodyParser = require('body-parser');
const app = express();

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original


/*exports.addMessage = functions.https.onRequest((req, res) => {
    // Grab the text parameter.
    const original = req.query;
    // Push the new message into the Realtime Database using the Firebase Admin SDK.
    return admin.database().ref('/messages').push({original: original}).then((snapshot) => {
        // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
        return res.send(200, snapshot.ref.toString());
    });
});
*/

app.use(cors);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.post('/addMessage', (req, res) => {
    return admin.database().ref('/messages').push(req.body).then((snapshot,err) => {
        // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
        res.send(200, snapshot.ref.toString());
        console.log(snapshot);
        console.log(err);
        
        return true;
    });
});

app.post('/newAlert', (req, res) => {
    req.body['date'] = new Date();
    return admin.database().ref('/Alerts').push(req.body).then((snapshot,err) => {
        // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
        res.send(200, snapshot.ref.toString());
        console.log(snapshot);
        console.log(err);
        
        return true;
    });
});


app.post('/searchAlert', (req, res) => {
    req.body['date'] = new Date();

    console.log(req.body);
    
    var db = admin.database();
    var ref = db.ref("/");
    var alertMembers = [];
    Promise.all([
        req.body.alertInfo.Groups.forEach((element,index) => {
            if(element) alertMembers = alertMembers.concat(req.body.groupsInfo[index].Members);
            return new Promise(resolve => setTimeout(() => resolve(true), 10));
        })]
    ).then(data => {
        alertMembers.forEach(email => {
            
            const mailOptions = {
                from: '"Xcities App" <xcities.app@gmail.com>',
                to: email,
            };

            mailOptions.subject = 'Thanks and Welcome!';

        
            mailOptions.html = '<b>Hello</b> deja el show ;)';
            
            try {
                mailTransport.sendMail(mailOptions);
                console.log(`New subscription confirmation email sent to: `, email);
            } catch(error) {
                console.error('There was an error while sending the email: ', error);
            }
        })
        
        var itemRef = ref.child("Users/");
        itemRef.on("value", function(snapshot) {
            if (snapshot.exists()) {
            console.log(snapshot.val());
            res.send(200, snapshot.val());
            return snapshot.val();
            } else {
            console.log("Cannot read a TODO item with TODO ID %s that does not exist.", todoId);
            res.send(404, null);
            }
        }, function (errorObject) {
            console.log("readToDoItem failed: " + errorObject.code);
            res.send(500, errorObject);
        })

        return true;
    }).catch(err => {
        console.log(err);
    })
});
// This HTTPS endpoint can only be accessed by your Firebase Users.
// Requests need to be authorized by providing an `Authorization` HTTP header
// with value `Bearer <Firebase ID Token>`.
exports.app = functions.https.onRequest(app);