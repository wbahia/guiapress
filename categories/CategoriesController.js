const express = require("express");
const router = express.Router();
const Category = require("./Category")
const slugify = require("slugify");

router.get("/admin/categories/new", (req, res) =>{
    res.render("admin/categories/new");
});

router.get("/admin/categories/", (req, res) =>{

    Category.findAll().then(categories => {
        res.render("admin/categories/index", {categories:categories});
    });
   
});

router.post("/admin/categories/save", (req, res) => {
    var title = req.body.title;
    if(title != undefined){
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(() =>{
            req.toastr.success("Categoria cadastrada com sucesso", "Sucesso");
            res.redirect("/admin/categories");

        })

    }else{
        res.redirect("/admin/categories");
    }

});

router.post("/admin/categories/delete", (req, res) => {
    var id = req.body.id;
    if(id != undefined && !isNaN(id)){
       Category.destroy({
        where: {
            id: id
        }
       }).then(() => {
        res.redirect("/admin/categories");
       });
    }else{
        res.redirect("/admin/categories");
    }
});

router.post("/admin/categories/update", (req, res) => {
    var id = req.body.id;
    var title = req.body.title;
    if(id != undefined && !isNaN(id)){
       Category.update({
            title: title,
            slug: slugify(title
        )},{
            where: {
                id: id
            }
       }).then(() => {
        res.redirect("/admin/categories");
       });
    }else{
        res.redirect("/admin/categories");
    }
});

router.get("/admin/categories/edit/:id", (req, res) => {
    var id = req.params.id;
    if(id != undefined && !isNaN(id)){
       Category.findByPk(id).then(c =>{
        if(c != undefined){
            res.render("admin/categories/edit", {category:c}); 
        }
       })
    }
    else{
        res.redirect("/admin/categories");
    }

});


module.exports = router;