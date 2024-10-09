import "./style.css";

// skeleton stuff from base code
const app: HTMLDivElement = document.querySelector("#app")!;
const gameName = "unknown clicker";
document.title = gameName;

// globals
let count = 0;
let growth_rate = 0;
let initial = Date.now();

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

const upgrade_1 = document.createElement("button");
upgrade_1.disabled = true;
upgrade_1.textContent = "+1 alien per second";
upgrade_1.className = "upgrade";
sidebar_container.append(upgrade_1);
upgrade_1.addEventListener("click", purchaseUpgrade);

app.append(main_container);
app.append(sidebar_container);

//* Utility functions *//
////////////////////////////////////////

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
    : `${count.toString()} aliens collected!`;
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
    : `${growth_rate.toString()} aliens generated per second!`;
}

/**
 * this function mediates the purchase of upgrade
 * this will likely need rework soon when more upgrades are available
 */
function purchaseUpgrade(): void {
  if (count >= 10) {
    count -= 10;
    growth_rate += 1;
    updatePassiveGenerationDisplayMessage();
  }
}

/**
 * main update function that runs everything
 */
function update(): void {
  if (count >= 10 && upgrade_1.disabled === true) {
    upgrade_1.disabled = false;
  } else if (count < 10) upgrade_1.disabled = true;

  const elapsed = Date.now();
  const final = (elapsed - initial) / 1000;

  if (final > 1) {
    count += growth_rate;
    initial = Date.now();
    updateCountDisplayMessage();
  }
  requestAnimationFrame(update);
}

requestAnimationFrame(update);
