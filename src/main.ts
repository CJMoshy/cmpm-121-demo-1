import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "My amazing game";
document.title = gameName;

//globals
let count = 0;
const growth_rate = 1;
let initial = Date.now();


const main_container = document.createElement("div");
main_container.className = "container";

const main_click_component = document.createElement("button");
main_click_component.className = "alien";
main_click_component.textContent = "👾";
main_container.append(main_click_component);

main_click_component.addEventListener("click", () => {
  count += 1;
  updateCountDisplayMessage();
});

const counter = document.createElement("div");
updateCountDisplayMessage();
counter.className = "counter";
main_container.append(counter);

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

app.append(main_container);


/**
 * main update function that runs everything
 */
function update(): void {
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
  
