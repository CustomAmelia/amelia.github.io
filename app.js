
let tabs = [];
let currentTab = 0;
const editor = document.getElementById("editor");
const whiteModeToggle = document.getElementById("white-mode-toggle");
const newTabButton = document.getElementById("new-tab-button");
const tabList = document.getElementById("tab-list");
const removeAllTabsButton = document.getElementById('remove-all-tabs-button');

function saveTabsToStorage() {
  localStorage.setItem("tabs", JSON.stringify(tabs));
}

function loadTabsFromStorage() {
  let savedTabs = localStorage.getItem("tabs");
  if (savedTabs) {
    tabs = JSON.parse(savedTabs);
    renderTabs();
    editor.innerHTML = tabs[currentTab].content;
    setActiveTab(currentTab);
  } else {
    addNewTab();
  }
}


function enableWhiteMode() {
  document.body.classList.add("white-mode");
  saveToDisk();
}


function disableWhiteMode() {
  document.body.classList.remove("white-mode");
  saveToDisk();
}


function addNewTab() {
  const newTab = {
    title: `Note ${tabs.length + 1}`,
    content: ""
  };
  tabs.push(newTab);
  renderTabs();
  setCurrentTab(tabs.length - 1);
}


function renderTabs() {
  tabList.innerHTML = "";
  tabs.forEach((tab, index) => {
    const tabItem = document.createElement("li");
    const tabLink = document.createElement("a");
    tabLink.innerText = tab.title;
    tabLink.href = "#";
    tabLink.addEventListener("click", () => {
      setCurrentTab(index);
    });
    tabItem.appendChild(tabLink);
    tabList.appendChild(tabItem);
  });
}


function setCurrentTab(index) {
  currentTab = index;
  editor.innerHTML = tabs[index].content;
  setActiveTab(index);
}


function setActiveTab(index) {
  const tabLinks = document.querySelectorAll("#tab-list a");
  tabLinks.forEach((tabLink, tabIndex) => {
    if (tabIndex === index) {
      tabLink.classList.add("active");
    } else {
      tabLink.classList.remove("active");
    }
  });
  saveTabsToStorage();
}


editor.addEventListener("input", () => {
  tabs[currentTab].content = editor.innerHTML;
  saveTabsToStorage();
});


removeAllTabsButton.addEventListener('click', () => {
  tabs = [];
  renderTabs();
  addNewTab();
});


whiteModeToggle.addEventListener("click", () => {
  if (document.body.classList.contains("white-mode")) {
    disableWhiteMode();
  } else {
    enableWhiteMode();
  }
});


newTabButton.addEventListener("click", () => {
  addNewTab();
});


loadTabsFromStorage();


if (localStorage.getItem("whiteModeEnabled")) {
  enableWhiteMode();
} else {
  disableWhiteMode();
}
