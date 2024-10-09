import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "My amazing game";
document.title = gameName;

const main_container = document.createElement("div");
main_container.className = "container";


const main_click_component = document.createElement("button");
main_click_component.className = "alien";
main_click_component.textContent = "👾";
main_container.append(main_click_component);

app.append(main_container)