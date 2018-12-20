// index.js
// written as part of the Taming Data with JavaScript article for ALA.
const fs = require('fs');
var aggregateData = []; // aggregateData is where we are going to store the data after it is rolled up

// read in our arrivals file that contains the country of origin, destination city, destination state,
// and year.  we will subset this data down to just the year and destination city.
fs.readFile('../data/arrivals.json', 'utf8', (err, data) => {
  if (err)
    return 0;
  dataNative = JSON.parse(data)

  // call our helper function to get the unique values for year and state
  var uniqueYear = getUniqueValues(dataNative, 'year');
  var uniqueState = getUniqueValues(dataNative, 'dest_state');

  // here we are going to loop through the unique years and unique states filtering our dataset down to
  // the appropriate level and use reduce to aggregate the total number of arrivals
  for (var i = 0; i < uniqueYear.length; i++){
    var subsetYr = dataNative.filter(dYr => dYr.year == uniqueYear[i])
    for (var j = 0; j < uniqueState.length; j++){
      var total = dataNative.filter(dSt => dSt.dest_state == uniqueState[j])
      .reduce((accumulator, currentValue) => {
        return accumulator + currentValue.arrivals;
      }, 0)

      // push the values this level of detail to our array
      aggregateData.push({'year': uniqueYear[i], 'state': uniqueState[j], 'total': total})
    }
  }

  // Once our aggregate dataset is complete push it into a new file
  var json = JSON.stringify(aggregateData);
  fs.writeFile('../data/aggregate.json', json, 'utf8', (err, d)=>{
    if (err)
      return 0;
    console.log('written to file');
  });
});

/*
getUniqueValues
Helper function to take an array of objects get a unique array of values for the string
passed in the second parameter.
*/
var getUniqueValues = function (arr, val) {
  let uniqueArr = [];
  for (var i = 0; i < arr.length; i++){
    let value = arr[i][val];
    if (uniqueArr.indexOf(value) == -1)
      uniqueArr.push(value);
  }
  return uniqueArr;
}
