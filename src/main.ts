import "./style.css";
import spaceship from "./spaceship.jpg";

// skeleton stuff from base code
const app: HTMLDivElement = document.querySelector("#app")!;
const gameName = "Galaxy Gatherer";
document.title = gameName;

// globals
let count = 0;
let growth_rate = 0;
let initial = Date.now();
const upgrade_increase_factor = 1.15;
const availableItems: Item[] = [
  { name: "Alien Assistants", cost: 10, growth_rate: 0.1, description: "Almost always certinally never fails in most circumstances" },
  { name: "Mothership Generator", cost: 100, growth_rate: 2.0, description: "This thing just cranks 'em out" },
  { name: "Black Hole Essence", cost: 1000, growth_rate: 50, description: "Glistening with the light of a trillion stars..." },
  { name: "Warp Speed Override", cost: 5000, growth_rate: 100, description: "Someone must have left this thing laying around eons ago" },
  { name: "Galaxy Soul", cost: 10000, growth_rate: 500, description: "An exceptionally powerfull component" },
];

// dom setup here
const main_container = document.createElement("div");
main_container.className = "container";
const sidebar_container = document.createElement("div");
sidebar_container.className = "sidebar";
const sidebar_label = document.createElement("h2");
sidebar_label.textContent = "Upgrades";
sidebar_container.append(sidebar_label);

const counter = document.createElement("div");
updateCountDisplayMessage();
counter.className = "counter";
main_container.append(counter);

const click_component_container = document.createElement("div");
click_component_container.className = "click-container";
const main_click_component = document.createElement("img");
main_click_component.draggable = false;
main_click_component.src = spaceship; //https://perchance.org/ai-pixel-art-generator
click_component_container.append(main_click_component);
main_container.append(click_component_container);

const passive_gains_tracker = document.createElement("div");
passive_gains_tracker.className = "passive";
updatePassiveGenerationDisplayMessage();
main_container.append(passive_gains_tracker);

main_click_component.addEventListener("click", () => {
  count += 1;
  updateCountDisplayMessage();
});

app.append(main_container);
app.append(sidebar_container);

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
    sidebar_container.append(x);
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
  passive_gains_tracker.textContent = getPassiveGenerationRate();
}

/**
 * utility function for the passive generation display
 * @return {string}
 */
function getPassiveGenerationRate(): string {
  if (growth_rate === 0) return "0 galaxy dust per second";
  return `${growth_rate.toFixed(1).toString()} galaxy dust per second!`;
}

/**
 * this function mediates the purchase of upgrade
 */
function purchaseUpgrade(u: Item, btn: HTMLButtonElement): void {
  if (count >= u.cost) {
    count -= u.cost;
    growth_rate += u.growth_rate;
    u.cost *= upgrade_increase_factor;
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
    count += growth_rate;
    initial = Date.now();
    updateCountDisplayMessage();
  }
  requestAnimationFrame(update);
}

createUpgrade();
requestAnimationFrame(update);
