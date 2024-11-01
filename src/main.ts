import "./style.css";
import spaceship from "./spaceship.jpg";
import items from "./Items.json";

// skeleton stuff from base code
const app: HTMLDivElement = document.querySelector("#app")!;
const gameName = "Galaxy Gatherer";
document.title = gameName;

// globals
const GAME_MANAGER: GameManager = {
  count: 0,
  growthRate: 0,
  initial: Date.now(),
  upgradeIncreaseFactor: 1.15,
  availableItems: items,
};

// dom setup here
const mainContainer = document.createElement("div");
mainContainer.className = "container";
const sidebarContainer = document.createElement("div");
sidebarContainer.className = "sidebar";

const title = document.createElement("h1");
title.textContent = "Galaxy Gatherer";
title.className = "main-title";
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
  GAME_MANAGER.count += 1;
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
  btn.textContent = `${u.growth_rate.toString()} x\n ${u.cost.toFixed(2)}`;
}

/**
 * this function creates a bunch of buttons based on a list of
 * upgrades passed in
 */
function createUpgrade(): void {
  GAME_MANAGER.availableItems.forEach((upgrade) => {
    const d = document.createElement("div");
    d.className = "upgrade-container";
    const title = document.createElement("h4");
    const flavor = document.createElement("p");
    flavor.style.fontStyle = "italic";
    flavor.style.fontSize = "12px";
    flavor.textContent = upgrade.description;
    title.textContent = upgrade.name;
    const x = document.createElement("button");
    setUpgradeTextContent(x, upgrade);
    x.disabled = true;
    x.style.whiteSpace = "pre-line";
    x.id = `upg-${upgrade.name}`;
    x.addEventListener("click", () => purchaseUpgrade(upgrade, x));
    d.append(title, flavor, x);
    sidebarContainer.append(d);
  });
}

/**
 * this function is checking each button flagged as an upgrade button
 * with its corresponding object and the current count to check whether or not
 * to unlock or lock the upgrades.
 */
function manageUpgradeLocks(): void {
  GAME_MANAGER.availableItems.forEach((u) => {
    const btn = document.getElementById(`upg-${u.name}`) as HTMLButtonElement;
    if (GAME_MANAGER.count >= u.cost && btn.disabled === true) {
      btn.disabled = false;
    } else if (GAME_MANAGER.count < u.cost) btn.disabled = true;
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
  if (GAME_MANAGER.count === 0) return "0";
  return `${GAME_MANAGER.count.toFixed(0).toString()} galaxy dust!`;
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
  if (GAME_MANAGER.growthRate === 0) return "0 galaxy dust per second";
  return `${GAME_MANAGER.growthRate.toFixed(1).toString()} galaxy dust per second!`;
}

/**
 * this function mediates the purchase of upgrade
 */
function purchaseUpgrade(u: Item, btn: HTMLButtonElement): void {
  if (GAME_MANAGER.count >= u.cost) {
    GAME_MANAGER.count -= u.cost;
    GAME_MANAGER.growthRate += u.growth_rate;
    u.cost *= GAME_MANAGER.upgradeIncreaseFactor;
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
  const final = (elapsed - GAME_MANAGER.initial) / 1000;

  if (final > 1) {
    GAME_MANAGER.count += GAME_MANAGER.growthRate;
    GAME_MANAGER.initial = Date.now();
    updateCountDisplayMessage();
  }
  requestAnimationFrame(update);
}

createUpgrade();
requestAnimationFrame(update);
