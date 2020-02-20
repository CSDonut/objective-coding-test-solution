//API to interact with file system
const fs = require('fs');
//JSON data to use
const dataObj = require('./data/data.json');

//html file path 
const {buildPathHTML} = require('./buildPath');


const createTfoot = (data) => {
  //Get the names of each skill every person has into an array
  let skills = [];  
  data.skills.forEach(element => {
    skills.push(element.name);
  });

  //Create a new array set with unique skill names
  let uniqueSkills = [... new Set(skills)];

  var htmlString =` 
    <tfoot>
      <tr>
        <td colspan="6">
          ${JSON.stringify(data.applicants.length) + " Applicants, "}
          ${uniqueSkills.length + " Unique Skills"}
        </td>
      </tr>
    </tfoot>
  ` 
  return htmlString;
}


const createJobRow = (job) => `
  <td rowspan="10" class="job-name">${job.name}</td>

`;


const createApplicantRow = (applicants) =>{
  var htmlString = `
  <tr>
    <td rowspan="3" class="applicant-name">${applicants.name}</td>
    <td rowspan="3"><a href="mailto:${applicants.email}">${applicants.email}</a></td>
    <td rowspan="3"><a href="http://${applicants.website}/">${applicants.website}</a></td>
    <td rowspan="3">${applicants.cover_letter}</td>
  </tr>  
    `; 
  return htmlString;
}


const createTBody = (jobRow, applicantTable) => `
  <tbody>
    ${jobRow}
    ${applicantTable}
  </tbody>
`;


const createTHead = () => `
  <thead>
    <tr>
      <th>Job</th>
      <th>Applicant Name</th>
      <th>Email Address</th>
      <th>Website</th>
      <th>Skills</th>
      <th>Cover Letter Paragraph</th>
    </tr>
  </thead>
`;

const createTable = (thead, tbody, tfoot) => `
  <table class="job-applicants">
    ${thead}
    ${tbody}
    ${tfoot}
  </table>
`;

const createPage = (table) => `
  <div id="page">
    ${table}
  </div>
`;


const createHTMLStruct = (table) => `
  <!doctype html>
  <html>
    <head>
      <title>Job Applicants Report</title>
      <link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/3.9.1/build/cssreset/cssreset-min.css">
      <link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/3.9.1/build/cssbase/cssbase-min.css">
      <script></script>

      <style type="text/css">
        #page {
            width: 1200px;
            margin: 30px auto;
        }
        .job-applicants {
            width: 100%;
        }
        .job-name {
            text-align: center;
        }
        .applicant-name {
            width: 150px;
        }
      </style>
    </head>

    <body>
      ${table}
    </body>
  </html>
`;


const doesFileExist = (filePath) => {
  try {
    fs.statSync(filePath);
    return true;
  } catch (error) {
    return false;
  }
};

try {
  //Checks to see if file exists, if it does then delete 
  if (doesFileExist(buildPathHTML)) {
    console.log('Deleting previous html file');
    // If file exists, delete from system
    fs.unlinkSync(buildPathHTML);
  } 

  const thead = createTHead();




  const applicantJobRow = dataObj.jobs.map(createJobRow).join('');
  const applicantsRow = dataObj.applicants.map(createApplicantRow).join('');
  const tbody = createTBody(applicantJobRow, applicantsRow);
  const tfoot = createTfoot(dataObj); 
  const table = createTable(thead, tbody, tfoot); //thead, tbody, tfoot
  const page = createPage(table);
  const html = createHTMLStruct(page);
  
  /* write the generated html to file */
  fs.writeFileSync(buildPathHTML, html);
  console.log('Succesfully created job applicants report');
} catch (error) {
  console.log('Error generating job applicant report', error);
}