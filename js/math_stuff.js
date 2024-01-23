const rareMiners = ["Rocket Pockets", "Diana", "Chuck", "Friendly Purpa", "Sax", "Forest", "Gold Egg", "Gramps", "Scuzz", "Jar Head", "Sparklina", "Dino Rider", "King Orange"];
const legendaryMiners = ["Master Mined", "Chester", "Stomper", "Ethereal Egg", "Zaouli", "Orange Fish", "Thoth the Wise", "Jeffrey", "Booster", "Goldalf", "Gaston", "Broski Bruh", "Old King Coal", "Juggernaut"];
const RAND_MAX = 2147483646;

function findNextRareMiner(seed, name) {
    if (!rareMiners.includes(name)) {
        return null;
    }
    let yesEggIndex = rareMiners.indexOf(name);
    let noEggIndex = rareMiners.filter(name => !name.endsWith("Egg")).indexOf(name);
    let yesEggs = -1;
    let noEggs = noEggIndex >= 0 ? -1 : 0; // Can't search for eggs in a list with no eggs
    let chestsopened = 0;
    while (yesEggs < 0 || noEggs < 0) {
        chestsopened += 1;
        let seed1 = (seed * 16807) % (RAND_MAX + 1);
        let seed2 = ((seed1 * 16807) % (RAND_MAX + 1));
        if (seed1 % 1000 >= 915 && seed1 % 1000 < 990) {
            if (seed2 % rareMiners.length == yesEggIndex) {
                yesEggs = yesEggs < 0 ? chestsopened : yesEggs;
            }
            if (seed2 % (rareMiners.length - 1) == noEggIndex) {
                noEggs = noEggs < 0 ? chestsopened : noEggs;
            }
        }
        if (seed1 % 1000 < 400) {
            seed = seed1
        }
        else {
            seed = seed2
        }
    }
    return [yesEggs, name.endsWith("Egg") ? null : noEggs];
}

function findNextLegendaryMiner(seed, name) {
    if (!legendaryMiners.includes(name)) {
        return null;
    }
    let yesEggIndex = legendaryMiners.indexOf(name);
    let noEggIndex = legendaryMiners.filter(name => !name.endsWith("Egg")).indexOf(name);
    let yesEggs = -1;
    let noEggs = noEggIndex >= 0 ? -1 : 0; // Can't search for eggs in a list with no eggs
    let chestsopened = 0;
    while (yesEggs < 0 || noEggs < 0) {
        chestsopened += 1;
        let seed1 = (seed * 16807) % (RAND_MAX + 1);
        let seed2 = ((seed1 * 16807) % (RAND_MAX + 1));
        if (seed1 % 1000 >= 990) {
            if (seed2 % legendaryMiners.length == yesEggIndex) {
                yesEggs = yesEggs < 0 ? chestsopened : yesEggs;
            }
            if (seed2 % (legendaryMiners.length - 1) == noEggIndex) {
                noEggs = noEggs < 0 ? chestsopened : noEggs;
            }
        }
        if (seed1 % 1000 < 400) {
            seed = seed1
        }
        else {
            seed = seed2
        }
    }
    return [yesEggs, name.endsWith("Egg") ? null : noEggs];
}

function nextNLegendaries(seed, n) {
    let chestsopened = 0;
    let nextLegendaries = [];
    while (n > 0) {
        chestsopened += 1;
        let seed1 = (seed * 16807) % (RAND_MAX + 1);
        let seed2 = ((seed1 * 16807) % (RAND_MAX + 1));
        if (seed1 % 1000 >= 990) {
            let yesEggs = legendaryMiners[seed2 % legendaryMiners.length];
            let noEggs = legendaryMiners.filter(name => !name.endsWith("Egg"))[seed2 % (legendaryMiners.length - 1)];
            nextLegendaries.push([chestsopened, yesEggs, noEggs]);
            n -= 1;
        }
        if (seed1 % 1000 < 400) { // Souls don't roll the rng again
            seed = seed1;
        }
        else {
            seed = seed2;
        }
    }
    return nextLegendaries;
}