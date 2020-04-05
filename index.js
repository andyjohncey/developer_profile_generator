const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const axios = require("axios");
const api = require("./api");

// const writeFileAsync = util.promisify(fs.writeFile);

const questions = [
  {
    type: "list",
    name: "color",
    message: "Please choose you favourite color",
    choices: ["red","yellow","orange","green","light-blue"]
  },
  {
    type: "input",
    name: "name",
    message: "What is your name?"
  },
  {
    type: "input",
    name: "location",
    message: "Where are you from?"
  },
  {
    type: "input",
    name: "email",
    message: "Whats your email?"
  },
  {
    type: "input",
    name: "phone",
    message: "Whats your phone number?"
  },
  {
    type: "input",
    name: "github",
    message: "Enter your Github username?"
  },
  {
    type: "input",
    name: "linkedin",
    message: "Enter your LinkedIn URL."
  },
];

function writeToFile(fileName, data) {
  return fs.writeFileSync(path.join(process.cwd(), fileName), data);
}

function generateHTML(answers) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
  <title>Resume</title>
</head>
<body>
<style>
  .container {
    background-color: ${answers.color}
  }
  .list-group-1 {
    color: "white"
  }
  .list-group-2 {
    color: "white"
  }
  </style>
  <div class="jumbotron jumbotron-fluid">
  <div class="container">
    <h1 class="display-4">${answers.name}</h1>
    <p class="lead">${answers.location}.</p>
    <p class="lead">${answers.email}</p>
    <p class="lead">${answers.phone}</p>
    <h3><span class="badge badge-secondary">Contact</span></h3>
    <ul class="list-group-1">
       <li class="list-group-item">GitHub: ${answers.github}</li>
        <li class="list-group-item">LinkedIn: ${answers.linkedin}</li>
      </ul>
      <ul class="list-group-2">
        <li class="list-group-item">Number of public repositories: ${answers.repositories}</li>
        <li class="list-group-item">Number of followers: ${answers.followers}</li>
        <li class="list-group-item">Number of GitHub stars:${answers.stars} </li>
        <li class="list-group-item">Number of users following: ${answers.following} </li>
      </ul>
  </div>
</div>
</body>
</html>`;
}


// async function init() {
//   console.log("hi")
//   try {
//     const answers = await promptUser();
  
//     const html = generateHTML(answers);
  
//     await writeFileAsync("index.html", html);
    
//      html=() => {
//       const conversion = convertFactory({
//         converterPath: convertFactory.converters.PDF
//       });

//       conversion({ html }, function(err, result) {
//         if (err) {
//           return console.error(err);
//         }

//         result.stream.pipe(
//           fs.createWriteStream(path.join(__dirname, "resume.pdf"))
//         );
//         conversion.kill();
//       });
//     }

//       open(path.join(process.cwd(), "resume.pdf"));
    
  
//     console.log("Successfully wrote to index.html");
//   } catch(err) {
//     console.log(err);
//   }
// }

function init() {
  inquirer.prompt(questions).then(({ github, color }) => {
    console.log("Searching...");

    api
      .getUser(github)
      .then(response =>
        api.getTotalStars(github).then(stars => {
          return generateHTML({
            stars,
            color,
            ...response.data
          });
        })
      )
      .then(html => {
        const conversion = convertFactory({
          converterPath: convertFactory.converters.PDF
        });

        conversion({ html }, function(err, result) {
          if (err) {
            return console.error(err);
          }

          result.stream.pipe(
            fs.createWriteStream(path.join(__dirname, "resume.pdf"))
          );
          conversion.kill();
        });

        open(path.join(process.cwd(), "resume.pdf"));
      });
  });
}

init();
