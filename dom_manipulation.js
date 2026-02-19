function showFilter() {
  var filter = document.getElementById("filterContent");
  var newArticle = document.getElementById("newContent");

  if (filter.style.display == "block") {
    filter.style.display = "none";
  } else {
    filter.style.display = "block";
    newArticle.style.display = "none";
  }
}

function showAddNew() {
  var filter = document.getElementById("filterContent");
  var newArticle = document.getElementById("newContent");

  if (newArticle.style.display == "flex") {
    newArticle.style.display = "none";
  } else {
    newArticle.style.display = "flex";
    filter.style.display = "none";
  }
}

function filterArticles() {
  var Opinion = document.getElementById("opinionCheckbox").checked;
  var Recipe = document.getElementById("recipeCheckbox").checked;
  var Update = document.getElementById("updateCheckbox").checked;

  var articles = document.getElementById("articleList").getElementsByTagName("article");

  for (var i = 0; i < articles.length; i++) {

    if (articles[i].classList.contains("opinion")) {
      if (Opinion) {
        articles[i].style.display = "block";
      } else {
        articles[i].style.display = "none";
      }
    }

    if (articles[i].classList.contains("recipe")) {
      if (Recipe) {
        articles[i].style.display = "block";
      } else {
        articles[i].style.display = "none";
      }
    }

    if (articles[i].classList.contains("update")) {
      if (Update) {
        articles[i].style.display = "block";
      } else {
        articles[i].style.display = "none";
      }
    }

  }
}

function addNewArticle() {
  var title = document.getElementById("inputHeader").value;
  var text = document.getElementById("inputArticle").value;

  if (title == "" || text == "") {
    return;
  }

  var Class = "";
  var Label = "";

  if (document.getElementById("opinionRadio").checked) {
    Class = "opinion";
    Label = "Opinion";
  }

  if (document.getElementById("recipeRadio").checked) {
    Class = "recipe";
    Label = "Recipe";
  }

  if (document.getElementById("lifeRadio").checked) {
    Class = "update";
    Label = "Update";
  }

  if (Class == "") {
    return;
  }

  var article = document.createElement("article");
  article.className = Class;

  var span = document.createElement("span");
  span.className = "marker";
  span.innerHTML = Label;

  var h2 = document.createElement("h2");
  h2.innerHTML = title;

  var p1 = document.createElement("p");
  p1.innerHTML = text;

  var p2 = document.createElement("p");
  p2.innerHTML = '<a href="moreDetails.html">Read more...</a>';

  article.appendChild(span);
  article.appendChild(h2);
  article.appendChild(p1);
  article.appendChild(p2);

  document.getElementById("articleList").appendChild(article);

  document.getElementById("inputHeader").value = "";
  document.getElementById("inputArticle").value = "";
}