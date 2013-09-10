var util = require('util'),
  mongoose = require('mongoose'),
  Schema = mongoose.Schema;

mongoose.connection.on('error', function(err) {
  if (err) {
    throw err;
  }
});

/**
 * Connect to the database.
 *§
 * @param {String} the database url
 * @param {Function} callback function
 * @api public
 */
exports.connect = function(dburl, callback) {
  mongoose.connect(dburl, function(err) {
    if (err)
      callback(err);
  });
};

/**
 * Disconnect from the database.
 *
 * @param {Function} callback function
 * @api public
 */
exports.disconnect = function(callback) {
  mongoose.disconnect(callback);
};

var ArticleSchema = new Schema({
  ts: { type: Date, default: Date.now },
  title: String,
  article: String,
  description: String,
  keywords: String,
  alias: String
});
var PrefsSchema = new Schema({
  name: String,
  email: String,
  items: Number,
  description : String,
  keywords: String,
  gravatar: Boolean
});
var PagesSchema = new Schema({
  ts: { type: Date, default: Date.now },
  page: String,
  intro: String,
  content: String,
  description: String,
  keywords: String,
  menu: Boolean,
  alias: String
});

mongoose.model('Article', ArticleSchema);
var Article = mongoose.model('Article');

mongoose.model('Prefs', PrefsSchema);
var Prefs = mongoose.model('Prefs');

mongoose.model('Pages', PagesSchema);
var Pages = mongoose.model('Pages');

exports.emptyArticle = { "_id": "", title: "", article: "", alias: "", description: "", keywords: "" };
exports.emptyPage = { "_id": "", page: "", intro: "", content: "", description: "", keywords: "", menu: "", alias: ""  };

exports.remove = function(callback) {
  Article.remove({}, function () { });
  Pages.remove({}, function () { });
  callback(null);
};

/**
 * Add a new article.
 *
 * @param {String} title
 * @param {String} timestamp
 * @param {String} article
 * @param {String} Meta description
 * @param {String} Meta keywords
 * @param {String} alias for the url
 * @param {Function} callback function
 * @api public
 */
exports.add = function(title, ts, article, description, keywords, alias, callback) {
  var newArticle = new Article();
  newArticle.title = title;
  if (ts !== '') {
    var date_fields = ts.split("/");
    newArticle.ts = new Date(date_fields[2], date_fields[0]-1, date_fields[1]);
  } else {
    newArticle.ts = new Date();
  }
  newArticle.article   = article;
  newArticle.description = description;
  newArticle.keywords = keywords;
  newArticle.alias = alias;
  newArticle.save(function(err) {
    if (err) {
      util.log('FATAL '+ err);
      callback(err);
    } else
      callback(null);
  });
};

/**
 * Add a new page.
 *
 * @param {String} page name
 * @param {String} timestamp
 * @param {String} introduction text
 * @param {String} content text
 * @param {String} Meta description
 * @param {String} Meta keywords
 * @param {String} alias for the url
 * @param {Boolean} option to display the page in the menu
 * @param {Function} callback function
 * @api public
 */
exports.addpage = function(page, ts, intro, content, description, keywords, alias, menu, callback) {
  var newPage = new Pages();
  newPage.page = page;
  if (ts !== '') {
    var date_fields = ts.split("/");
    newPage.ts = new Date(date_fields[2], date_fields[0]-1, date_fields[1]);
  } else {
    newPage.ts = new Date();
  }
  newPage.intro   = intro;
  newPage.content   = content;
  newPage.description = description;
  newPage.keywords = keywords;
  newPage.alias = alias;
  newPage.menu = menu;
  newPage.save(function(err) {
    if (err) {
      util.log('FATAL '+ err);
      callback(err);
    } else
      callback(null);
  });
};

/**
 * Delete an article.
 *
 * @param {String} id
 * @param {Function} callback function
 * @api public
 */
exports.delete = function(id, callback) {
  exports.findArticleById(id, function(err, doc) {
    if (err)
      callback(err);
    else {
      util.log(util.inspect(doc));
      doc.remove();
      callback(null);
    }
  });
};

/**
 * Delete a page.
 *
 * @param {String} id
 * @param {Function} callback function
 * @api public
 */
exports.deletePage = function(id, callback) {
  exports.findPageById(id, function(err, doc) {
    if (err)
      callback(err);
    else {
      util.log(util.inspect(doc));
      doc.remove();
      callback(null);
    }
  });
};

/**
 * Get a count of all articles. Useful for pagination.
 *
 * @param {Function} callback function
 * @api public
 */
exports.countArticles = function(callback) {
  Article.count({}, function(err, doc) {
    if (err) {
      util.log('FATAL '+ err);
      callback(err, null);
    }
    callback(null, doc);
  });
};

/**
 * Edd an article.
 *
 * @param {String} id
 * @param {String} title
 * @param {String} timestamp
 * @param {String} article
 * @param {String} Meta description
 * @param {String} Meta keywords
 * @param {String} alias for the url
 * @param {Function} callback function
 * @api public
 */
exports.edit = function(id, title, ts, article, description, keywords, alias, callback) {
  exports.findArticleById(id, function(err, doc) {
    if (err)
      callback(err);
    else {
      if (ts !== undefined) {
        var date_fields = ts.split("/");
        doc.ts = new Date(date_fields[2], date_fields[0]-1, date_fields[1]);
      } else {
        doc.ts = new Date();
      }
      doc.title = title;
      doc.article   = article;
      doc.description = description;
      doc.keywords = keywords;
      doc.alias = alias;
      doc.save(function(err) {
        if (err) {
          util.log('FATAL '+ err);
          callback(err);
        } else
            callback(null);
      });
    }
  });
};

/**
 * Edit a page.
 *
 * @param {String} id
 * @param {String} page name
 * @param {String} timestamp
 * @param {String} introduction text
 * @param {String} content text
 * @param {String} Meta description
 * @param {String} Meta keywords
 * @param {String} alias for the url
 * @param {Boolean} option to display the page in the menu
 * @param {Function} callback function
 * @api public
 */
exports.editpage = function(id, page, ts, intro, content, description, keywords, alias, menu, callback) {
  exports.findPageById(id, function(err, doc) {
    if (err)
      callback(err);
    else {
      if (ts !== undefined) {
        var date_fields = ts.split("/");
        doc.ts = new Date(date_fields[2], date_fields[0]-1, date_fields[1]);
      } else {
        doc.ts = new Date();
      }
      doc.page = page;
      doc.intro = intro;
      doc.content   = content;
      doc.description = description;
      doc.keywords = keywords;
      doc.alias = alias;
      doc.menu = menu;
      doc.save(function(err) {
        if (err) {
          util.log('FATAL '+ err);
          callback(err);
        } else
            callback(null);
      });
    }
  });
};

/**
 * Get articles limited by the requested amount and all pages.
 *
 * @param {Number} the number of articles to return
 * @param {Function} callback function
 * @api public
 */
exports.allArticlesPages = function(num, callback) {
  exports.articles(num, function(err, articles) {
    exports.allPages(function(err, pages) {
      callback(err, articles, pages);
    });
  });
};

/**
 * Get articles limited by the requested amount and sort by timestamp.
 *
 * @param {Number} the number of articles to return
 * @param {Function} callback function
 * @api public
 */
exports.allArticles = function(callback) {
  Article.find({}).sort("-ts").execFind(callback);
};

exports.articles = function(num, callback) {
  Article.find({}).limit(num).sort("-ts").execFind(callback);
};


/**
 * Get all pages and sort by timestamp.
 *
 * @param {Function} callback function
 * @api public
 */
exports.allPages = function(callback) {
  Pages.find({}).sort("-ts").execFind(callback);
};

/**
 * Get all pages in the menu and sort by timestamp.
 *
 * @param {Function} callback function
 * @api public
 */
exports.allMenuPages = function(callback) {
  Pages.find({menu: 1}).sort("-ts").execFind(callback);
};

/**
 * Get all articles by page. Used for the pagination.
 *
 * @param {Function} callback function
 * @api public
 */
exports.allArticlesPaged = function(num, page, callback) {
  var skip = 0;
  if (page > 0) {
    skip = num * page - num;
  }
  Article.find({}).skip(skip).limit(num).sort("-ts").execFind(callback);
};

/**
 * Traverse through the articles. Used for logging and debugging purposes.
 *
 * @param {Function} callback function to call on each article retrieval
 * @param {Function} callback function on completion
 * @api public
 */
exports.forAll = function(doEach, done) {
  Article.find({}, function(err, docs) {
    if (err) {
      util.log('FATAL '+ err);
      done(err, null);
    }
    docs.forEach(function(doc) {
      doEach(null, doc);
    });
    done(null);
  });
};

/**
 * Get the project preferences from the database if they have been set.
 *
 * @param {Function} callback function
 * @api public
 */
exports.projectPreferences = function(callback) {
  Prefs.findOne({ }, function(err, doc) {
    if (err) {
      util.log('FATAL '+ err);
      callback(err, null);
    }
    if (doc === null) {
      doc = { name: 'My Project', email: "", items: 10, description: "", keywords: "" };
    }
    exports.allMenuPages(function(err, pages) {
      callback(err, doc, pages);
    });
  });
};

/**
 * Save the project preferences.
 *
 * @param {String} project name
 * @param {String} email address
 * @param {String} number of items to display per page
 * @param {String} Meta description for home page
 * @param {String} Meta keywords for home page
 * @param {Boolean} Option to display Gravatar
 * @param {Function} callback function
 * @api public
 */
exports.save = function(name, email, items, description, keywords, gravatar, callback) {
  Prefs.findOne({ }, function(err, doc) {
    if (err) {
        util.log('FATAL '+ err);
        callback(err);
    } else {
      if (doc === null) {
          exports.newPref(name, email, items, description, keywords, gravatar, callback);
      } else {
        doc.name = name;
        doc.email = email;
        doc.items = items;
        doc.description = description;
        doc.keywords = keywords;
        doc.gravatar = gravatar;
        doc.save(function(err) {
          if (err) {
            util.log('FATAL '+ err);
            callback(err);
          } else
            callback(null);
        });
      }
    }
  });
};

/**
 * Create a new preferences object in the database
 *
 * @param {String} project name
 * @param {String} email address
 * @param {String} number of items to display per page
 * @param {String} Meta description for home page
 * @param {String} Meta keywords for home page
 * @param {Boolean} Option to display Gravatar
 * @param {Function} callback function
 * @api public
 */
exports.newPref = function(name, email, items, description, keywords, gravatar, callback) {
  var newPrefs = new Prefs();
  newPrefs.name = name;
  newPrefs.email = email;
  newPrefs.items   = items;
  newPrefs.description = description;
  newPrefs.keywords = keywords;
  newPrefs.gravatar = gravatar;
  newPrefs.save(function(err) {
    if (err) {
      util.log('FATAL '+ err);
      callback(err);
    } else
      callback(null);
  });
};

/**
 * Find an article by its id.
 *
 * @param {String} id
 * @param {Function} callback function
 * @api public
 */
exports.findArticleById = function(id, callback) {
  Article.findOne({ _id: id }, callback);
};

/**
 * Find a page by its id.
 *
 * @param {String} id
 * @param {Function} callback function
 * @api public
 */
exports.findPageById = function(id, callback) {
  Pages.findOne({ _id: id }, callback);
};

/**
 * Find a page by its alias.
 *
 * @param {String} alias
 * @param {Function} callback function
 * @api public
 */
exports.findPageByAlias = function(alias, callback) {
  Pages.findOne({ alias: alias }, function(error, page) {
    if(page) {
      callback(null, page);
    } else {
      callback('Page not found', null);
    }
  });
};

/**
 * Find an article by its date and alias.
 *
 * @param {Date} start date to query from
 * @param {Date} end date to query to
 * @param {String} title title of article to query
 * @param {Function} callback function
 * @api public
 */
exports.findArticleByDate = function(start, end, title, callback) {
  Article.findOne({ts: {$gte: start, $lte: end}, alias: title}, function(error, article) {
    if(article) {
      callback(null, article);
    } else {
      callback('Article not found', null);
    }
  });
};
