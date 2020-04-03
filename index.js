const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const axios = require("axios");

function promptUser(){
return inquirer.prompt([
  {
    type: "input",
    message: " What is the Git hub username you want to search?"
  },
  {
    type: "list",
    name: "Please choose you favourite color"

  }

  }
])
}

function generateHTML(answers) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
  <title>Document</title>
</head>
<body>
  <div class="jumbotron jumbotron-fluid">
  <div class="container">
    <h1 class="display-4">Hi! My name is ${answers.name}</h1>
    <p class="lead">I am from ${answers.location}.</p>
    <h3>Example heading <span class="badge badge-secondary">Contact Me</span></h3>
    <ul class="list-group">
      <li class="list-group-item">My GitHub username is ${answers.github}</li>
      <li class="list-group-item">LinkedIn: ${answers.linkedin}</li>
    </ul>
  </div>
</div>
</body>
</html>`;
}


axios
  .get("https://api.github.com/?q=SEARCH_KEYWORD_1+SEARCH_KEYWORD_N+QUALIFIER_1+QUALIFIER_N, config")
  .then(function(res) {
    const { profile } = res.data;

    appendFileAsync("profile.txt", profile + "\n").then(function() {
      readFileAsync("profile.txt", "utf8").then(function(data) {
        console.log("Developer Profile:");
        console.log(data);
      });
    });
  })
  .catch(function(err) {
    console.log(err);
  });