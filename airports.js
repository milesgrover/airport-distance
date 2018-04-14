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
(function selectReplace() {
    var selectComponents = document.querySelectorAll('.airport-selector');
    var selectComponent,
        selectElement,
        optionElements,
        entryPoint,
        optsList,
        listItem;

    // loop through selectComponents nodelist
    // using for loops since not all browsers support methods like 'foreach' on non-arrays
    for (var i = 0; i < selectComponents.length; i++) {
        // define elements
        selectComponent = selectComponents[i];
        selectElement = selectComponent.querySelector('select');
        optionElements = selectElement.querySelectorAll('option');

        // hide the select HTML element
        selectElement.style.display = 'none';

        // create new entry point
        entryPoint = document.createElement('button');
        entryPoint.classList.add('entry-point');
        entryPoint.textContent = optionElements[0].value;
        entryPoint.addEventListener('click', function(e) {
            selectOpenList(e);
        });
        selectComponents[i].appendChild(entryPoint);

        // create new options list
        optsList = document.createElement('ul');
        selectComponents[i].appendChild(optsList);

        // loop through options and add them to the list
        for (var j = 0; j < optionElements.length; j++) {
            listItem = document.createElement('li');
            listItem.textContent = optionElements[j].value;
            listItem.tabIndex = 0;
            listItem.addEventListener('click', function(e) {
                selectUpdateValue(e);
            });
            optsList.appendChild(listItem);
        }

        // open and close the list by setting aria-expanded
        function selectOpenList(e) {
            var target;
            if (e.target) {
                target = e.target;
            } else {
                target = e;
            }
            var expandedState = target.getAttribute('aria-expanded');
            if (expandedState === 'true') {
                expandedState = 'false';
            } else {
                expandedState = 'true';
            }
            target.setAttribute('aria-expanded', expandedState);
        }

        // update entry point text and value of underlying select element
        function selectUpdateValue(e) {
            var target = e.target;
            var value = target.textContent;
            var thisSelectElement = target.parentNode.parentNode.querySelector('select');
            var thisEntryPoint = target.parentNode.previousElementSibling;
            thisSelectElement.value = value;
            thisEntryPoint.textContent = value;

            selectOpenList(thisEntryPoint);
        }
    }
}());

// function to call the Intent API and display the distance
(function calculateDistance() {
    var calcBtn = document.getElementById('calcBtn');
    var resultContainer = document.getElementById('resultContainer');

    calcBtn.addEventListener('click', function() {
        var fromValue = document.querySelector('#selectFrom select').value;
        var toValue = document.querySelector('#selectTo select').value;
        var result = IntentMedia.Distances.distance_between_airports(fromValue, toValue);

        resultContainer.textContent = result;
    });
}());
