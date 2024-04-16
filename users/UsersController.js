const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");

router.get("/admin/users/", (req, res) =>{
     User.findAll().then(users => {
         res.render("admin/users/index", {users:users});
     });
});

router.get("/admin/users/new", (req, res) =>{
    res.render("admin/users/new");
});

router.post("/admin/users/save", (req, res) =>{
    var email = req.body.email;
    var password = req.body.password;

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password,salt);

    User.findOne({where :{email: email}}).then(user => {
        if (user != undefined){
            res.redirect("/admin/users/new");
        }
        else{
            
            User.create({
                email: email,
                password : hash
            }).then (() => {
                res.redirect("/admin/users");
            }).catch((err) => {
                res.redirect("/admin/users");
            });
        }
    });
});

router.post("/admin/users/delete", (req, res) => {
    var id = req.body.id;
    if(id != undefined && !isNaN(id)){
       User.destroy({
        where: {
            id: id
        }
       }).then(() => {
        res.redirect("/admin/users");
       });
    }else{
        res.redirect("/admin/users");
    }
});

router.post("/admin/users/update", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    var id = req.body.id;

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password,salt);

    if(id != undefined && !isNaN(id)){
       User.update({
            email: email,
            password: hash
        },{
            where: {
                id: id
            }
       }).then(() => {
        res.redirect("/admin/users");
       });
    }else{
        res.redirect("/admin/users");
    }
});

router.get("/admin/users/edit/:id", (req, res) => {
    var id = req.params.id;
    if(id != undefined && !isNaN(id)){
       User.findByPk(id).then(u =>{
        if(u != undefined){
            res.render("admin/users/edit", {user:u}); 
        }
       })
    }
    else{
        res.redirect("/admin/users");
    }

});

router.get("/login", (req, res) =>{
    res.render("admin/users/login");
});

router.post("/authenticate", (req, res) =>{
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({where :{email: email}}).then(user => {
        if(user != undefined){
            //validar a senha
            var correct = bcrypt.compareSync(password, user.password);

            if(correct){
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect("/admin/articles");
            }else{
                res.redirect("/login");    
            }

        }else{
            res.redirect("/login");
        }
    });
});

router.get("/logout", (req, res) => {
    req.session.user = undefined;
    res.redirect("/");
})


module.exports = router;