const express = require("express");
const app = express();
const date = require(__dirname+"/views/date.js")
const mongoose  = require("mongoose");
const bcrypt = require('bcryptjs')
const { body, validationResult } = require('express-validator');
let bodyParser = require("body-parser");

const User = require('./models/User');

mongoose.connect("mongodb+srv://admin-tushar:pswd6920@cluster0.lngsx.mongodb.net/toDoListDB",{UseNewUrlParser:true});
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static("public"));



var listSchema = {
    name: String,
    items: [String]
};

const List = mongoose.model("List", listSchema);

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

app.post('/signup', [
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    body('name').isLength({ min: 3 })
], async (req, res) => {
    const { name, email, password } = req.body;
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() })
    }

    const salt = await bcrypt.genSalt(10)
    let securePass = await bcrypt.hash(req.body.password, salt);
    try {
        User.findOne({ email:email }, (err, foundDocument) => {
            if (err) {
              console.error('Error finding document:', err);
              
            } else {
              if (foundDocument) {
                console.log('Document Name:', foundDocument.name);
                console.log('Document Email:', foundDocument.email);
                return res.status(400).json({ success })
              } else {
                    User.create({
                    name: req.body.name,
                    password: securePass,
                    email: req.body.email
                })
                success = true;
                res.json({success})
              }
            }
          });
        
    } catch (error) {
        console.error(error.message)
    }
})

app.post('/login', [
    body('email', "Enter a Valid Email").isEmail(),
    body('password', "Password cannot be blank").exists(),
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email }); 
        if (!user) {
            return res.status(400).json({ success, error: "Try Logging in with correct credentials" });
        }

        const pwdCompare = await bcrypt.compare(password, user.password); 
        if (!pwdCompare) {
            return res.status(400).json({ success, error: "The password is Incorrect" });
        }

        success = true;
        res.json({ success })


    } catch (error) {
        console.error(error.message)
        res.send("Server Error")
    }
})


app.post('/sendData', async(req,res)=>{
    let success = false;
    const { email, data} = req.body;
    try {
        let user = await List.findOne({name:email});
        if (!user) {
            const newList = new List({
                name: email,
                items: [data]
            });
            newList.save();
            success = true;
            res.json({ success })
     
        }else{
            List.findOneAndUpdate(
                { name: email },
                { $push: { items: data } },
                { new: true, useFindAndModify: false },
                (err, updatedList) => {
                  if (err) {
                    console.error('Error inserting item:', err);
                  } else {
                    success = true;
                    res.json({ success })
                  }
                }
              );
        }

    } catch (error) {
        console.error(error.message)
        res.send("Server Error")
    }    
})

app.post('/getItems', async(req,res)=>{
    let success = false;
    const { email} = req.body;
    try {
        let user = await List.findOne({ name:email }); 
        if (!user) {
            return res.status(400).json({ success, error: "Add your first item to the To-Do list!" });
        }else{
            List.findOne({name:email}, function(err, userlist){
                res.status(200).send({
                    success: true,
                    data: userlist.items
                  });
            });
        }
        


    } catch (error) {
        console.error(error.message)
        console.log("error in getting items");
        return res.status(400).json({ success, error: "Add your first item to the To-Do list!" });
    }
})


app.post('/delete', async(req,res)=>{
    let success = false;
    const {email, index} = req.body;
    console.log(index);
    try {
        let list = await List.findOne({ name:email }); 
        if (!list) {
            return res.status(400).json({ success, error: "Unknown Error!" });
        }else{

            list.items.splice(index, 1);
            await list.save();
            res.send({success: true});
        }
        


    } catch (error) {
        console.error(error.message)
        console.log("error in getting items");
        return res.status(400).json({ success, error: "Add your first item to the To-Do list!" });
    }
})




app.listen(5000 || process.env.PORT, function(){
console.log("Server started on port 5000");
});
