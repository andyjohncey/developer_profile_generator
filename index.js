const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const path = require("path");
const open = require("open");
const convertFactory = require("electron-html-to");
const api = require("./api");
const generateHTML = require("./generateHTML");

// const writeFileAsync = util.promisify(fs.writeFile);

// function promptUser() {
//   return inquirer.prompt([
//   {
//     type: "list",
//     name: "color",
//     message: "Please choose you favourite color",
//     choices: ["red","yellow","orange","light-green","light-blue"]
//   },
//   {
//     type: "input",
//     name: "name",
//     message: "What is your name?"
//   },
//   {
//     type: "input",
//     name: "location",
//     message: "Where are you from?"
//   },
//   {
//     type: "input",
//     name: "email",
//     message: "Whats your email?"
//   },
//   {
//     type: "input",
//     name: "phone",
//     message: "Whats your phone number?"
//   },
//   {
//     type: "input",
//     name: "github",
//     message: "Enter your Github username?"
//   },
//   {
//     type: "input",
//     name: "linkedin",
//     message: "Enter your LinkedIn URL."
//   },
//   ])
// };


// Ask the user questions using the node.js terminal
const questions = [
  {
    type: "input",
        name: "github",
        message: "Enter your Github username?"
  },
  {
    type: "list",
    name: "color",
    message: "Please choose a backgound color",
    choices: ["green", "blue","yellow","orange"]
  }
];

function writeToFile(fileName, data) {
  return fs.writeFileSync(path.join(process.cwd(), fileName), data);
}

// make an api request for data from github
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
      )//convert the html document into pdf format
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

// call the function
init();

// function generateHTML(answers) {
//   return `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <meta http-equiv="X-UA-Compatible" content="ie=edge">
//   <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
//   <title>Resume</title>
// </head>
// <body>
// <style>
//   .container {
//     background-color: ${answers.color}
//   }
//   h1 {
//     text-align: center;
//   }
//   .lead {
//     text-align: center;
//   }
//   </style>
//   <div class="jumbotron jumbotron-fluid">
//   <div class="container">
//       <h1 class="display-4">${answers.name}</h1>
//     <p class="lead">Location: ${answers.location}.</p>
//     <p class="lead">Email: ${answers.email}</p>
//     <p class="lead">Phone: ${answers.phone}</p>
//     <h3><span class="badge badge-secondary">Networking</span></h3>
//     <ul class="list-group-1">
//        <li class="list-group-item">GitHub: ${answers.github}</li>
//         <li class="list-group-item">LinkedIn: ${answers.linkedin}</li>
//       </ul>
//   </div>
// </div>
// </body>
// </html>`
// }



// promptUser() 
//   .then(function(answers) {
//     const html = generateHTML(answers);

//     return writeFileAsync("index.html", html);
//   })
//   .then(function() {
//     console.log("Successfully wrote to index.html");
//   })
//   .catch(function(err) {
//     console.log(err);
//   });


// function init() {
//   inquirer.prompt().then(({ github, color }) => {
//     console.log("Searching...");

//     api
//       .getUser(github)
//       .then(response =>
//         api.getTotalStars(github).then(stars => {
//           return generateHTML({
//             stars,
//             color,
//             ...response.data
//           });
//         })
//       )
//       .then(html => {
//         const conversion = convertFactory({
//           converterPath: convertFactory.converters.PDF
//         });

//         conversion({ html }, function(err, result) {
//           if (err) {
//             return console.error(err);
//           }

//           result.stream.pipe(
//             fs.createWriteStream(path.join(__dirname, "resume.pdf"))
//           );
//           conversion.kill();
//         });

//         open(path.join(process.cwd(), "resume.pdf"));
//       });
//   });
// }

// init();


// <img src="${data.avatar_url}" alt="Photo of ${data.name}" />