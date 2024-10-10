import "./style.css";

// skeleton stuff from base code
const app: HTMLDivElement = document.querySelector("#app")!;
const gameName = "unknown clicker";
document.title = gameName;

// globals
let count = 0;
let growth_rate = 0;
let initial = Date.now();
const upgrade_increase_factor = 1.15;
const upgrades: Upgrade[] = [
  { name: "A", cost: 10, growth_rate: 0.1 },
  { name: "B", cost: 100, growth_rate: 2.0 },
  { name: "C", cost: 1000, growth_rate: 50 },
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

const main_click_component = document.createElement("button");
main_click_component.className = "alien";
main_click_component.textContent = "👾";
main_container.append(main_click_component);

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
function setUpgradeTextContent(btn: HTMLButtonElement, u: Upgrade) {
  btn.textContent = `+${u.growth_rate.toString()} aliens per second\ncost = ${u.cost.toFixed(2)}`;
}

/**
 * this function creates a bunch of buttons based on a list of
 * upgrades passed in
 */
function createUpgrade(): void {
  upgrades.forEach((upgrade) => {
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
  upgrades.forEach((u) => {
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
  return count === 1
    ? `1 alien collected!`
    : `${count.toFixed(0).toString()} aliens collected!`;
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
  if (growth_rate === 0) return "0 aliens generated per second";
  return growth_rate === 1
    ? `1 alien generated per second!`
    : `${growth_rate.toFixed(1).toString()} aliens generated per second!`;
}

/**
 * this function mediates the purchase of upgrade
 */
function purchaseUpgrade(u: Upgrade, btn: HTMLButtonElement): void {
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
