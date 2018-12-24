//const db = require("../models");
const axios = require("axios");
const cheerio = require("cheerio");
const db = require("../models");

module.exports = function (app) {
    app.get("/", function(req, res) {
        res.render("index",{title: "Mongo Scraper"});
    });
    app.get("/api/all", function(req,res) {
        db.Article.find({})
        .then(function(articles) {
          // If all Users are successfully found, send them back to the client
          res.render("saved",{title: "Saved Articles", articles:articles})
        })
        .catch(function(err) {
          // If an error occurs, send the error back to the client
          res.json(err);
        });
        
    });
    app.get("/api/scrape", function(req,res) {
        const articles = [];
        axios.get("https://www.pcmag.com/news").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(response.data);
            
            // Now, we grab every h2 within an article tag, and do the following:
            $(".article-deck a:first-child").each(function(i, element) {
            // Save an empty result object
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this)
                .text();
            result.link = $(this)
                .attr("href");
            articles.push(result);
            })
        }).then(_ => {
            res.render("index", {title: "Mongo Scraper", articles: articles})
        })

    });
    app.post("/api/post", function (req,res) {
        db.Article.create({title: req.body.title, link: req.body.link})
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
          res.json(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
    });
    app.delete("/api/article/:id", function(req,res) {
        const id = req.params.id;
        db.Article.findByIdAndDelete(id)
        .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
            res.json(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
          });
    })
};