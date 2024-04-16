const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const session = require("express-session");
const connection = require("./database/database");
const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const usersController = require("./users/UsersController");
const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./users/UsersController");


//view engine
app.set("view engine", "ejs");

//sessions
app.use(session({
    secret:"ooiewruewouirdofoifdsoifusdfioudfhejejhewrjhe",
    cookie: { maxAge: 300000}, //em ms - 5min
    saveUninitialized: true,
    resave: true
}))

//static
app.use(express.static("public"));

//body parser
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

//database
connection
    .authenticate()
    .then(() =>{
        console.log("Conectado ao BD");
    })
    .catch((error) => {
        console.log("Deu ruim a conexao ao BD");
    });

//routes
app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);

var limit = 4 //qtd de itens por pagina

app.get("/", (req, res) => {
    
    var page= 0;
    var offset = 0; //pagina inicial
    

    Article.findAndCountAll({
        offset: offset,
        limit: limit,
        order:[
            ['id', 'DESC']
        ]
    }).then(articles => {
        
        next = true;
        if((offset + limit) >= articles.count)
        {
            next = false;
        }

        Category.findAll().then(categories => {
            res.render("index", {articles: articles, next: next, page:page, categories: categories});
        });
    });
});

app.get("/page/:num", (req, res) => {

    var page = parseInt(req.params.num);
    var offset = 0; //pagina inicial
    if(!isNaN(page) || page != 1){
        offset = (page -1) * limit;
    }

    Article.findAndCountAll({
        limit: limit,
        offset: offset,
        order:[
            ['id', 'DESC']
        ]
    }).then(articles => {
        
        if (page + limit > articles.count){
            res.redirect("/");
        }
        
        next = true;
        if(offset + limit >= articles.count){
            next = false;
        }

        Category.findAll().then(categories => {
            res.render("page", {articles: articles, next: next, categories: categories, page: page});    
        });
    });
});

app.get("/:slug", (req, res) => {
    var slug = req.params.slug;
    var next = false;
    var page = 0;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        
        if(article != undefined)
        {
            Category.findAll().then(categories => {
                res.render("article", {article: article, categories: categories, page: page, next: next});
            });
            
        }else{
            res.redirect("/");
        }
        
    }).catch(err => {
        res.redirect("/")
    });
    
});

app.get("/category/:slug", (req, res) => {
    var slug = req.params.slug;
    var next = false;
    var page = 0;
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then(category => {
        
        if(category != undefined)
        {
            Category.findAll().then(categories => {
                res.render("index", {articles: category.Articles, categories: categories, next: next, page: page});
            });
            
        }else{
            res.redirect("/");
        }
        
    }).catch(err => {
        res.redirect("/")
    });
    
});


app.listen(3000, () => {
    console.log("Server UP!!");
});