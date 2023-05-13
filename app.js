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
	saveTabsToStorage();
}

function disableWhiteMode() {
	document.body.classList.remove("white-mode");
	saveTabsToStorage();
}

function addNewTab() {
	const newTab = {
		title: `Untitled ${tabs.length + 1}`,
		content: "",
	};
	tabs.push(newTab);
	renderTabs();
	setCurrentTab(tabs.length - 1);
}

function removeTab(index) {
	if (index === currentTab) {
		editor.innerHTML = ""; // clear editor content
	}
	tabs.splice(index, 1);
	renderTabs();
	if (currentTab >= tabs.length) {
		setCurrentTab(tabs.length - 1);
	}
	saveTabsToStorage();
}

function removeCurrentTab() {
	editor.innerHTML = ""; // clear content
	tabs.splice(currentTab, 1);
	saveTabsToStorage(); // save the current tab to storage to remove!
	if (currentTab >= tabs.length) {
		currentTab = tabs.length - 1;
	}
	renderTabs();
	setCurrentTab(currentTab);
}

// add event listener to delete-tab-button
const deleteTabButton = document.getElementById('delete-tab-button');
deleteTabButton.addEventListener('click', removeCurrentTab);

function removeAllTabs() {
	tabs = [];
	saveTabsToStorage(); // this was the fix? :skull:
	editor.innerHTML = "";
	renderTabs();
}

function renderTabs() {
	tabList.innerHTML = "";
	tabs.forEach((tab, index) => {
		const li = document.createElement("li");
		li.textContent = tab.title;
		li.addEventListener("click", () => setCurrentTab(index));
		if (index === currentTab) {
			li.classList.add("active");
		}
		tabList.appendChild(li);
	});
}

function setCurrentTab(index) {
	currentTab = index;
	editor.innerHTML = tabs[currentTab].content;
	setActiveTab(currentTab);
}

function setActiveTab(index) {
	const tabs = document.querySelectorAll("#tab-list li");
	tabs.forEach((tab, tabIndex) => {
		if (tabIndex === index) {
			tab.classList.add("active");
		} else {
			tab.classList.remove("active");
		}
	});
}

whiteModeToggle.addEventListener("click", () => {
	if (document.body.classList.contains("white-mode")) {
		disableWhiteMode();
	} else {
		enableWhiteMode();
	}
});

newTabButton.addEventListener("click", addNewTab);

removeAllTabsButton.addEventListener('click', removeAllTabs);

editor.addEventListener("input", () => {
	tabs[currentTab].content = editor.innerHTML;
	saveTabsToStorage();
});

loadTabsFromStorage();

setActiveTab(currentTab);