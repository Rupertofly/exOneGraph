// @ts-check
/* eslint no-undef: 0 */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "setup|draw|preload|recordFrame|recordSetup|p5Canvas0" }] */

function preload () {}
let p5Canvas0;

// Put together importData object
var dataTypes = {
  Gender: { Man: [0, 0], Woman: [0, 0], 'Non-Binary': [0, 0] },
  Age: {
    '18': [0, 0],
    '25': [0, 0],
    '30': [0, 0],
    '38': [0, 0],
    '45': [0, 0],
    '55': [0, 0],
    '75': [0, 0]
  },
  No_Of_Friends: {
    '2': [0, 0],
    '12': [0, 0],
    '50': [0, 0],
    '100': [0, 0],
    '200': [0, 0],
    '600': [0, 0],
    '1000': [0, 0],
    '2000': [0, 0]
  },
  First_Language: {
    English: [0, 0],
    Mandarin: [0, 0],
    Thai: [0, 0],
    Arabic: [0, 0],
    Italian: [0, 0]
  },
  Likes: {
    'Superhero movies': [0, 0],
    AFL: [0, 0],
    'Premier League Soccer': [0, 0],
    'Heavy Metal Music': [0, 0],
    Memes: [0, 0],
    'Blazing 420': [0, 0],
    'Hip-hop Music': [0, 0],
    'Cocktail Bars': [0, 0],
    Motorshows: [0, 0],
    dogs: [0, 0]
  },
  Dislikes: {
    'Superhero movies': [0, 0],
    AFL: [0, 0],
    'Premier League Soccer': [0, 0],
    'Heavy Metal Music': [0, 0],
    Memes: [0, 0],
    'Blazing 420': [0, 0],
    'Hip-hop Music': [0, 0],
    'Cocktail Bars': [0, 0],
    Motorshows: [0, 0],
    dogs: [0, 0]
  }
};
// Graph creation data
let graphSim;
let importData = JSON.parse(JSON.stringify(dataTypes));
let virginData = { nodes: [], links: [] };
let graphData = { nodes: [], links: [] };
const nodeCount = 43;
let nodeAng;

let startCircleSizeX, startCircleSizeY;

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
          let thisEntry =
            importData[source.trait][source.val][target.trait][target.val];
          thisEntry[0] += offset;
          thisEntry[1]++;
        }
      }
      t = question.p2;
      o = question.p1;
      for (let source of Object.values(t)) {
        for (let target of Object.values(o)) {
          let thisEntry =
            importData[source.trait][source.val][target.trait][target.val];
          thisEntry[0] += offset;
          thisEntry[1]++;
          if (thisEntry[0] > rMax) rMax = thisEntry[0];
          if (thisEntry[0] < rMin) rMin = thisEntry[0];
        }
      }
    }
  }
  console.log(`between ${rMin} and ${rMax}`);

  hasData = true;
}
/**
 *
 *
 */
function graphPrep() {
  let nodeColourMap = {
    gender: getC(hues.purples, 2),
    age: getC(hues.yellows, 2),
    no_of_friends: getC(hues.blues, 2),
    first_language: getC(hues.violets, 2),
    likes: getC(hues.greens, 2),
    dislikes: getC(hues.reds, 2)
  };

  let i = 0;
  for (let [group, v] of Object.entries(dataTypes)) {
    let groupName = group.toLowerCase();
    for (let element of Object.keys(v)) {
      // Nodes first

      let label = element;
      let labelId = label.toLowerCase().replace(/\s/g, '_');
      let id = `${groupName}_${labelId}`;
      let node = {
        id: id,
        group: groupName,
        label: element,
        fill: nodeColourMap[groupName].hex,
        x: Math.sin(i * nodeAng) * startCircleSizeX + width / 2,
        y: Math.cos(i * nodeAng) * startCircleSizeY + height / 2
      };
      virginData.nodes.push(node);
      i++;

      // Now Links

      for (let [tGroup, tV] of Object.entries(importData[group][element])) {
        let tGroupName = tGroup.toLowerCase();
        for (let [tElement, tStrData] of Object.entries(tV)) {
          let tLabelId = tElement.toLowerCase().replace(/\s/g, '_');
          let tId = `${tGroupName}_${tLabelId}`;
          if (tId === id) continue;
          if (virginData.links.some(e => e.source === tId && e.target === id)) {
            continue;
          }
          let strRatio;
          if (tStrData[0] === 0 && tStrData[1] === 0) strRatio = 0;
          else strRatio = tStrData[0] / tStrData[1];

          let strength = strRatio * 0.499 + 0.5 + tStrData[1] / 10000;

          let link = {
            source: id,
            target: tId,
            strength: strength
          };
          virginData.links.push(link);
        }
      }
    }
  }

  graphData.links = JSON.parse(JSON.stringify(virginData.links.slice()));
  graphData.nodes = JSON.parse(JSON.stringify(virginData.nodes.slice()));
}
function graphMake() {
  graphSim = d3
    .forceSimulation()
    .force('charge', d3.forceManyBody().strength(-220))
    .force('center', d3.forceCenter(width / 2, height / 2));
  graphSim.nodes(graphData.nodes).on('tick');
  graphSim.force(
    'link',
    d3
      .forceLink(graphData.links)
      .id(link => link.id)
      .strength(link => constrain(link.strength - 0.5, 0, 0.05))
      .distance(50)
  );
}
//

function setup() {
  p5Canvas0 = createCanvas(windowWidth, windowHeight);

  startCircleSizeX = width / 3;
  startCircleSizeY = height / 3;
  nodeAng = TWO_PI / nodeCount;

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
      graphPrep();
      graphMake();
    },

    error => console.log('error getting data' + error)
  );
}
function draw() {
  background(getC(hues.neutrals, 4).hex);
  if (hasData) background(getC(hues.neutrals, 1).hex);
  if (frameCount > 200) {
    for (let l of graphData.links) {
      let s = graphData.nodes.find(e => l.source.id === e.id);
      let t = graphData.nodes.find(e => l.target.id === e.id);
      if (l.strength < 0.5 + 0.5 * sin(radians(frameCount))) continue;
      strokeWeight(2 * l.strength);
      stroke(150, l.strength * 64);
      line(s.x, s.y, t.x, t.y);
    }
    for (let n of graphData.nodes) {
      fill(n.fill);
      noStroke();
      ellipse(n.x, n.y, 20);
    }
  }
}
