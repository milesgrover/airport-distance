// Airport and distance functions
// Code by Intent Media
var IntentMedia = IntentMedia || {};

IntentMedia.Airports = (function () {
    var pub = {};

    pub.airport_exists = function (airport_code) {
      return pub.airport_distances().hasOwnProperty(airport_code);
    };

    pub.airport_distances = function () {
      return {
        JFK: {LAX: 2475, LAS: 2248, PDX: 2454},
        LAX: {JFK: 2475, LAS: 236, PDX: 834},
        LAS: {JFK: 2248, LAX: 236, PDX: 763},
        PDX: {JFK: 2454, LAS: 763, LAX: 834}
      }
    };

    return pub;
}(IntentMedia || {}));

IntentMedia.Distances = (function () {
    var pub = {};
    var airport_distances = airport_distances || IntentMedia.Airports.airport_distances();

    pub.distance_between_airports = function (from_airport, to_airport) {
      if (IntentMedia.Airports.airport_exists(from_airport) && IntentMedia.Airports.airport_exists(to_airport)) {
        if (from_airport === to_airport) {
          return 0;
        }

        return airport_distances[from_airport][to_airport];
      }

      return -1;
    };

    return pub;
}(IntentMedia || {}));

// Airport distance calculator app
// Code by Miles Grover

// Replace select controls with elements that can be styled in CSS
function selectReplace() {
    var selectComponents = document.querySelectorAll('.airport-selector');

    // loop through selectComponents nodelist
    for (var i = 0; i < selectComponents.length; i++) {
        var selectElement = selectComponents[i].querySelector('select');
        var optionElements = selectElement.querySelectorAll('option');
        selectElement.style.display = 'none';

        var entryPoint = document.createElement('button');
        entryPoint.classList.add('entry-point');
        entryPoint.textContent = optionElements[0].value;
        selectComponents[i].appendChild(entryPoint);

        var optsList = document.createElement('ul');
        selectComponents[i].appendChild(optsList);

        // loop through options and add them to a list
        for (var j = 0; j < optionElements.length; j++) {
            var listItem = document.createElement('li');
            listItem.textContent = optionElements[j].value;
            optsList.appendChild(listItem);
        }
    }
}
selectReplace();