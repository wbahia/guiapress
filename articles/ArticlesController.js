const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const slugify = require("slugify");
const adminAuth = require("../middlewares/adminAuth");

router.get("/admin/articles", adminAuth, (req, res) =>{
    Article.findAll({
        include:[{model: Category}] //join com Category
    }).then(articles => {
        res.render("admin/articles/index", {articles: articles});
    });
});

router.get("/admin/articles/new", adminAuth, (req, res) =>{
    Category.findAll().then(categories => {
        res.render("admin/articles/new", {categories: categories});
    })
    
});

router.post("/admin/articles/delete", adminAuth, (req, res) => {
    var id = req.body.id;
    if(id != undefined && !isNaN(id)){
       Article.destroy({
        where: {
            id: id
        }
       }).then(() => {
        res.redirect("/admin/articles");
       });
    }else{
        res.redirect("/admin/articles");
    }
});

router.post("/admin/articles/save", adminAuth, (req, res) =>{
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    Article.create({
        title: title,
        body: body,
        slug: slugify(title),
        CategoryId: category
    }).then(() => {
        res.redirect("/admin/articles");
    });
});

router.get("/admin/articles/edit/:id", adminAuth, (req, res) => {
    var id = req.params.id;
    if(id != undefined && !isNaN(id)){
       Article.findByPk(id).then(a =>{
        if(a != undefined){
            Category.findAll().then(categories => {
                res.render("admin/articles/edit", {article:a, categories:categories}); 
            });
        }
       });
    }
    else{
        res.redirect("/admin/articles");
    }

});

router.post("/admin/articles/update", adminAuth, (req, res) => {
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;
    if(id != undefined && !isNaN(id)){
       Article.update({
            title: title,
            body: body,
            CategoryId : category,
            slug: slugify(title)},{
            where: {
                id: id
            }
       }).then(() => {
            res.redirect("/admin/articles");
       })
       .catch(err => {
            res.redirect("/");
       });
    }else{
        res.redirect("/admin/articles");
    }
});

module.exports = router;