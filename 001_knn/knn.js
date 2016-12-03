
//Start off with what passes the first test.
function KNN(kSize){
	this.kSize = kSize;
	this.points = [];
}

KNN.prototype.train = function (arr) {
  arr.map((entry) => {
    this.points.push(entry);
  })
};

KNN.prototype._distance = function (vector1, vector2) {

  return vector1.map((entry, index) => {return Math.abs(entry - vector2[index])})
                .reduce((entry1, entry2) => {return entry1 + entry2})
}

KNN.prototype._distances = function (unclassifiedVec, array) {

  return array.map((_, index) => {
    return [this._distance(unclassifiedVec, array[index][0]), array[index][1]];
  })
}

KNN.prototype._sorted = function (array) {
  var distances = 
    array.map((entry) => {return entry[0]})
         .sort((a, b) => a-b);

  var result = [];

  for (var i = 0, j = distances.length; i < j; i++) {
    var classification = array.map((entry) => {
      if (entry[0] === distances[i]) result.push(entry[1])
    })
  }

  return result;
}

KNN.prototype._majority = function (k, sortedList) {
  var numberOfOccurences = new Array(k).fill(0); // let us check the most common classification.

  for (var i = 0; i < k; i++) {
    var classification = sortedList[i];
    numberOfOccurences[classification]++;
  }

  return numberOfOccurences.indexOf(Math.max.apply(null, numberOfOccurences));
}

KNN.prototype.predictSingle = function (vector) {
  return this._majority(this.kSize, this._sorted(this._distances(vector, this.points)));
}

KNN.prototype.predict = function (vectorArray) {
  return vectorArray.map((vector) => {
    return this.predictSingle(vector)
  })
}

KNN.prototype.score = function (trainingData) {
  var strippedTrainingData = this.predict(trainingData.map((vec) => vec[0])); 
  var actualClasses = trainingData.map((vec) => vec[1]);

  var counter = 0;
  actualClasses.forEach((vec, index) => {
    if (vec === strippedTrainingData[index]) counter++;
  })

  return counter / actualClasses.length;
}

module.exports = KNN