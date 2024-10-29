import "./style.css";
import spaceship from "./spaceship.jpg";

// skeleton stuff from base code
const app: HTMLDivElement = document.querySelector("#app")!;
const gameName = "Galaxy Gatherer";
document.title = gameName;

// globals
let count = 0;
let growthRate = 0;
let initial = Date.now();
const upgradeIncreaseFactor = 1.15;
const availableItems: Item[] = [
  { name: "Alien Assistants", cost: 10, growth_rate: 0.1, description: "Almost always certinally never fails in most circumstances" },
  { name: "Mothership Generator", cost: 100, growth_rate: 2.0, description: "This thing just cranks 'em out" },
  { name: "Black Hole Essence", cost: 1000, growth_rate: 50, description: "Glistening with the light of a trillion stars..." },
  { name: "Warp Speed Override", cost: 5000, growth_rate: 100, description: "Someone must have left this thing laying around eons ago" },
  { name: "Galaxy Soul", cost: 10000, growth_rate: 500, description: "An exceptionally powerfull component" },
];

// dom setup here
const mainContainer = document.createElement("div");
mainContainer.className = "container";
const sidebarContainer = document.createElement("div");
sidebarContainer.className = "sidebar";
const sidebarLabel = document.createElement("h2");
sidebarLabel.textContent = "Upgrades";
sidebarContainer.append(sidebarLabel);

const title = document.createElement('h1')
title.textContent = 'Galaxy Gatherer';
title.className = 'main-title';
mainContainer.append(title);

const counter = document.createElement("div");
updateCountDisplayMessage();
counter.className = "counter";
mainContainer.append(counter);

const clickComponentContainer = document.createElement("div");
clickComponentContainer.className = "click-container";
const mainClickComponent = document.createElement("img");
mainClickComponent.draggable = false;
mainClickComponent.src = spaceship; //https://perchance.org/ai-pixel-art-generator
clickComponentContainer.append(mainClickComponent);
mainContainer.append(clickComponentContainer);

const passiveGainsTracker = document.createElement("div");
passiveGainsTracker.className = "passive";
updatePassiveGenerationDisplayMessage();
mainContainer.append(passiveGainsTracker);

mainClickComponent.addEventListener("click", () => {
  count += 1;
  updateCountDisplayMessage();
});

app.append(mainContainer);
app.append(sidebarContainer);

//* Utility functions *//
////////////////////////////////////////

/**
 * function that takes in a button and an upgrade and sets the button text content to the upgrades values
 * @param {HTMLButtonElement} btn
 * @param {Upgrade} u
 */
function setUpgradeTextContent(btn: HTMLButtonElement, u: Item) {
  btn.textContent = `${u.name}\n+${u.growth_rate.toString()} galaxy dust per second\ncost = ${u.cost.toFixed(2)}\n${u.description}`;
}

/**
 * this function creates a bunch of buttons based on a list of
 * upgrades passed in
 */
function createUpgrade(): void {
  availableItems.forEach((upgrade) => {
    const x = document.createElement("button");
    x.disabled = true;
    x.style.whiteSpace = "pre-line";
    setUpgradeTextContent(x, upgrade);
    x.className = "upgrade";
    x.id = `upg-${upgrade.name}`;
    x.addEventListener("click", () => purchaseUpgrade(upgrade, x));
    sidebarContainer.append(x);
  });
}

/**
 * this function is checking each button flagged as an upgrade button
 * with its corresponding object and the current count to check whether or not
 * to unlock or lock the upgrades.
 */
function manageUpgradeLocks(): void {
  availableItems.forEach((u) => {
    const btn = document.getElementById(`upg-${u.name}`) as HTMLButtonElement;
    if (count >= u.cost && btn.disabled === true) {
      btn.disabled = false;
    } else if (count < u.cost) btn.disabled = true;
  });
}

/**
 * this function sets the display for the user of thier current collected ammount
 */
function updateCountDisplayMessage(): void {
  counter.textContent = getCount();
}

/**
 * utility function for the count display message
 * @return {string}
 */
function getCount(): string {
  if (count === 0) return "0";
  return `${count.toFixed(0).toString()} galaxy dust!`;
}

/**
 * this function sets the display for the user of the current passive generation rate
 */
function updatePassiveGenerationDisplayMessage(): void {
  passiveGainsTracker.textContent = getPassiveGenerationRate();
}

/**
 * utility function for the passive generation display
 * @return {string}
 */
function getPassiveGenerationRate(): string {
  if (growthRate === 0) return "0 galaxy dust per second";
  return `${growthRate.toFixed(1).toString()} galaxy dust per second!`;
}

/**
 * this function mediates the purchase of upgrade
 */
function purchaseUpgrade(u: Item, btn: HTMLButtonElement): void {
  if (count >= u.cost) {
    count -= u.cost;
    growthRate += u.growth_rate;
    u.cost *= upgradeIncreaseFactor;
    updatePassiveGenerationDisplayMessage();
    updateCountDisplayMessage();
    setUpgradeTextContent(btn, u);
  }
}

/**
 * main update function that runs everything
 */
function update(): void {
  manageUpgradeLocks();

  const elapsed = Date.now();
  const final = (elapsed - initial) / 1000;

  if (final > 1) {
    count += growthRate;
    initial = Date.now();
    updateCountDisplayMessage();
  }
  requestAnimationFrame(update);
}

createUpgrade();
requestAnimationFrame(update);
