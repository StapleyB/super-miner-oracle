const seedindex = 533
const chestsopenedindex = 526
var seed;

function loadSave() {
    var chestsOpened;

    // Attempt to load the save data
    try {
        let rawSave = document.getElementById('saveinput').value;
        let save = rawSave.split('|')[1];
        save = atob(atob(save)).split("|");
        seed = save[seedindex];
        chestsOpened = save[chestsopenedindex];
    } catch (error) {
        toggleElement('output', 'none');
        toggleElement('save_error', 'block');
        return;
    }
    toggleElement('save_error', 'none');

    // If chests opened is 0, tell them to open a chest first
    if (chestsOpened == 0) {
        toggleElement('no_chests_error', 'block');
        toggleElement('output', 'none');
        return;
    }
    toggleElement('no_chests_error', 'none');
   
    toggleElement('output', 'block');

    
    updateMinerSelect();
    getChosenMinerStats();
    updateLegendaryTable();

}

function updateLegendaryTable() {

    var itemCount = document.getElementById("legendaryCount").value;

    // Max Values handled here
    if (itemCount < 1) {
        itemCount = 1;
    }
    if (itemCount > 1000) { //Don't kill your computer
        itemCount = 1000;
    }

    var tableBody = document.getElementById("legendaryTableBody");

    // Clear existing rows
    tableBody.innerHTML = "";

    var items = nextNLegendaries(seed, itemCount);

    items.forEach(function(item) {

        const row = document.createElement("tr");

        for (let i = 0; i < 3; i++) {
          const cell = document.createElement("td");
          const cellText = document.createTextNode(item[i]);
          cell.appendChild(cellText);
          row.appendChild(cell);
        }
    
        tableBody.appendChild(row);
    });
}

function toggleElement(id, state=null) {
    let element = document.getElementById(id);
    if (state != null) {
        element.style.display = state;
        return
    }
    if (element.style.display == 'none') {
        element.style.display = 'block';
    } else {
        element.style.display = 'none';
    }
}

function updateMinerSelect() {
    let firstSelect = document.getElementById("raritySelect");
    let secondSelect = document.getElementById("minerSelect");
    let optionsMap = firstSelect.value == 'Rare' ? rareMiners : legendaryMiners; // from math_stuff.js
    optionsMap = [...optionsMap].sort();
    secondSelect.innerHTML = "";

    optionsMap.forEach(function(option) {
        let optionElement = document.createElement("option");
        optionElement.value = option;
        optionElement.text = option;
        secondSelect.add(optionElement);
    });

    // Defaults, these are the most useful most of the time
    if (firstSelect.value == 'Rare') {
        secondSelect.value = 'Diana';
    } else if (firstSelect.value == 'Legendary') {
        secondSelect.value = 'Thoth the Wise';
    }
    getChosenMinerStats();
}

function getChosenMinerStats() {
    let miner = document.getElementById("minerSelect").value;
    let f;
    if (rareMiners.includes(miner)) {
        f = findNextRareMiner;
    } else if (legendaryMiners.includes(miner)) {
        f = findNextLegendaryMiner;
    }
    let stats = f(seed, miner);
    if (miner.endsWith("Egg")) {
        stats[1] = Infinity;
    }

    let output = document.getElementById("chooseMinerOutput");
    output.innerHTML = "";

    if (stats[0] == stats[1]){
        let line = document.createElement('div');
        line.textContent = "At " + stats[0] + " chests opened, you will always get a " + miner + ", no matter how many eggs you have. That's pretty rare!"
        output.appendChild(line);
    } else {
        let line1 = document.createElement('div');
        let outputText = miner;
        outputText += " first occurs at " + Math.min(...stats) + " chests opened with ";
        outputText += stats[0] < stats[1] ? "less than 4 eggs." : "4 held eggs.";
        line1.textContent = outputText;
        output.appendChild(line1);
        if (!miner.endsWith("Egg")) {
            let line2 = document.createElement('div');
            outputText = "Alternatively, " + miner + " appears at " + Math.max(...stats) + " chests opened with "; 
            outputText += stats[0] > stats[1] ? "less than 4 eggs." : "4 held eggs.";
            line2.textContent = outputText;
            output.appendChild(line2);
        }        
    }

}
