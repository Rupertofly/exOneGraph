// @ts-check
/* eslint no-undef: 0 */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "setup|draw|preload|recordFrame|recordSetup|checkNested|ObjE" }] */
function ObjE (obj) {
  let ownProps = Object.keys(obj);
  let i = ownProps.length;
  let resArray = new Array(i);
  while (i--) resArray[i] = [ownProps[i], obj[ownProps[i]]];
  return resArray;
}
if (!Object.entries) {
  Object.entries = function (obj) {
    var ownProps = Object.keys(obj);
    var i = ownProps.length;
    var resArray = new Array(i); // preallocate the Array
    while (i--) resArray[i] = [ownProps[i], obj[ownProps[i]]];
    return resArray;
  };
}

function checkNested (obj /*, level1, level2, ... levelN */) {
  var args = Array.prototype.slice.call(arguments, 1);

  for (var i = 0; i < args.length; i++) {
    if (!obj || !obj.hasOwnProperty(args[i])) {
      return false;
    }
    obj = obj[args[i]];
  }
  return true;
}
var recorder;
var canvasObject;
var lastFrame = 60;

// For Recording

/**
 * Adds A frame to the recording and saves if at end
 *
 */
function recordFrame () {
  if (frameCount <= lastFrame) {
    recorder.capture(canvasObject);
    if (frameCount === lastFrame) {
      recorder.stop();
      recorder.save();
    }
  }
}
/**
 * Set's up Recording
 *
 */
function recordSetup () {
  recorder = new CCapture({
    format: 'webm',
    framerate: 60
  });
  canvasObject = document.getElementById('defaultCanvas0');
  recorder.start();
}
