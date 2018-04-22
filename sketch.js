// @ts-check
/* eslint no-undef: 0 */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "setup|draw|preload|recordFrame|recordSetup|p5Canvas0" }] */

function preload () {}
let p5Canvas0;

// Put together importData object
var dataTypes = {
  Gender: { Man: 0, Woman: 0, 'Non-Binary': 0 },
  Age: { '18': 0, '25': 0, '30': 0, '38': 0, '45': 0, '55': 0, '75': 0 },
  No_Of_Friends: {
    '2': 0,
    '12': 0,
    '50': 0,
    '100': 0,
    '200': 0,
    '600': 0,
    '1000': 0,
    '2000': 0
  },
  First_Language: { English: 0, Mandarin: 0, Thai: 0, Arabic: 0, Italian: 0 },
  Likes: {
    'Superhero movies': 0,
    AFL: 0,
    'Premier League Soccer': 0,
    'Heavy Metal Music': 0,
    Memes: 0,
    'Blazing 420': 0,
    'Hip-hop Music': 0,
    'Cocktail Bars': 0,
    Motorshows: 0,
    dogs: 0
  },
  Dislikes: {
    'Superhero movies': 0,
    AFL: 0,
    'Premier League Soccer': 0,
    'Heavy Metal Music': 0,
    Memes: 0,
    'Blazing 420': 0,
    'Hip-hop Music': 0,
    'Cocktail Bars': 0,
    Motorshows: 0,
    dogs: 0
  }
};

let importData = JSON.parse(JSON.stringify(dataTypes));
for (let [catog, v] of ObjE(importData)) {
  for (let element of Object.keys(v)) {
    importData[catog][element] = JSON.parse(JSON.stringify(dataTypes));
  }
}
// Sort Import data from Firebase
let hasData = false;
let rMin = 500;
let rMax = -500;
/**
 * Takes in the Question Data and updates to importData
 *
 * @param {object} firebData
 */
/* eslint-disable */
function dataCat(firebData) {
  for (let e of Object.values(firebData)) {
    for (let question of e.data) {
      let offset = question.answer === 1 ? 1 : -1;
      // Person 1s Traits
      let t = question.p1;
      let o = question.p2;
      for (let source of Object.values(t)) {
        for (let target of Object.values(o)) {
          importData[source.trait][source.val][target.trait][
            target.val
          ] += offset;
        }
      }
      t = question.p2;
      o = question.p1;
      for (let source of Object.values(t)) {
        for (let target of Object.values(o)) {
          importData[source.trait][source.val][target.trait][
            target.val
          ] += offset;
          if (
            importData[source.trait][source.val][target.trait][target.val] >
            rMax
          )
            rMax =
              importData[source.trait][source.val][target.trait][target.val];
          if (
            importData[source.trait][source.val][target.trait][target.val] <
            rMin
          )
            rMin =
              importData[source.trait][source.val][target.trait][target.val];
        }
      }
    }
  }
  console.log(`between ${rMin} and ${rMax}`);

  hasData = true;
}
/* eslint-enable */
//

function setup () {
  p5Canvas0 = createCanvas(300, 500);
  let config = {
    apiKey: 'AIzaSyCZh7bDhcHYesPc0FeKxriL7EZ2Kopk2us',
    authDomain: 'awesomesaucerupert.firebaseapp.com',
    databaseURL: 'https://awesomesaucerupert.firebaseio.com',
    projectId: 'awesomesaucerupert',
    storageBucket: 'awesomesaucerupert.appspot.com',
    messagingSenderId: '465094389233'
  };
  firebase.initializeApp(config);
  let database = firebase.database();
  let dataRef = database.ref('firstExerciseData');
  dataRef.once(
    'value',
    data => {
      dataCat(data.val());
      console.log('gotit');
    },

    error => console.log('error getting data' + error)
  );
}
function draw () {
  background(10);
  if (hasData) background(200);
}
