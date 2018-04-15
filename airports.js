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

// I'm using the built-in HTML <select> control so that this component will
// work if used inside a <form> to submit values via POST, etc.
// However, <select> only allows very limited CSS styling, so this code replaces
// that UI with generic elements that can be styled, while making sure to update
// the actual <select>'s value.
// Doing this all in JavaScript keeps the HTML API simple (just use <select>)
// and also ensures that turning off JavaScript the <select> still works
// e.g. within a <form> with a <submit> button.
(function selectReplace() {
    var selectComponents = document.querySelectorAll('.airport-selector');
    var selectComponent,
        selectElement,
        optionElements,
        entryPoint,
        optsList,
        listItem,
        listBtn;

    var softDismiss = document.createElement('div');
    softDismiss.classList.add('soft-dismiss');
    document.body.appendChild(softDismiss);

    // loop through selectComponents nodelist
    // using for loops since not all browsers support methods like 'foreach' on non-arrays
    for (var i = 0; i < selectComponents.length; i++) {
        selectComponent = selectComponents[i];
        selectElement = selectComponent.querySelector('select');
        optionElements = selectElement.querySelectorAll('option');

        // hide the select HTML element
        selectElement.style.display = 'none';

        // create new entry point
        entryPoint = document.createElement('button');
        entryPoint.classList.add('entry-point');
        entryPoint.textContent = optionElements[0].value;
        entryPoint.setAttribute('aria-haspopup', true);
        entryPoint.addEventListener('click', function(e) {
            selectOpenList(e);
            selectSoftDismiss(e);
        });
        selectComponents[i].appendChild(entryPoint);

        // create new options list
        optsList = document.createElement('ul');
        selectComponents[i].appendChild(optsList);

        // loop through options and add them to the list
        for (var j = 0; j < optionElements.length; j++) {
            listItem = document.createElement('li');
            optsList.appendChild(listItem);
            listBtn = document.createElement('button');
            listBtn.textContent = optionElements[j].value;
            listBtn.addEventListener('click', function(e) {
                selectUpdateValue(e);
            });
            listItem.appendChild(listBtn);
        }

        // open and close the list by setting aria-expanded on the entry point
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

            // second toggle here is a compromise to allow animation on opening
            // while still providing good tab focus behavior
            setTimeout(function(){
                target.classList.toggle('is-open');
            },50);
        }

        // update entry point text and value of underlying select element
        function selectUpdateValue(e) {
            var target = e.target;
            var value = target.textContent;
            var thisSelectElement = target.parentNode.parentNode.parentNode.querySelector('select');
            var thisEntryPoint = target.parentNode.parentNode.previousElementSibling;
            thisSelectElement.value = value;
            thisEntryPoint.textContent = value;
            // close the list when you've selected an option
            selectOpenList(thisEntryPoint);
            softDismiss.style.zIndex = '';
        }

        function selectSoftDismiss(e) {
            softDismiss.style.zIndex = 1;
            softDismiss.addEventListener('click', function() {
                e.target.classList.remove('is-open');
                e.target.setAttribute('aria-expanded', 'false');
                softDismiss.style.zIndex = '';
            });
        }
    }
}());

// Call the Intent API and display the distance
(function displayDistance() {
    var calcBtn = document.getElementById('calcBtn');
    var resultContainer = document.getElementById('resultContainer');
    var chosenLocs = resultContainer.querySelector('.chosen-locations');
    var resultText = resultContainer.querySelector('.result-text');
    var closeResultBtn = document.getElementById('reCalcBtn');
    closeResultBtn.tabIndex = -1;

    calcBtn.addEventListener('click', function() {
        var fromValue = document.querySelector('#selectFrom select').value;
        var toValue = document.querySelector('#selectTo select').value;
        var result = IntentMedia.Distances.distance_between_airports(fromValue, toValue);
        chosenLocs.textContent = `${fromValue} to ${toValue}`;
        resultText.textContent = result + ' miles';
        closeResultBtn.tabIndex = 0;
        resultContainer.setAttribute('aria-expanded', true);
        this.blur();
    });
    closeResultBtn.addEventListener('click', function() {
        resultContainer.setAttribute('aria-expanded', false);
        closeResultBtn.tabIndex = -1;
    });
}());
