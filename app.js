let tabs = [];
let currentTab = 0;
const editor = document.getElementById("editor");
const whiteModeToggle = document.getElementById("white-mode-toggle");
const newTabButton = document.getElementById("new-tab-button");
const tabList = document.getElementById("tab-list");
const removeAllTabsButton = document.getElementById('remove-all-tabs-button');
const changeTabButton = document.getElementById("change-note-button");
const charCount = document.querySelector('#text-container');

function saveTabsToStorage() {
	localStorage.setItem("tabs", JSON.stringify(tabs));
}

function loadTabsFromStorage() {
	let savedTabs = localStorage.getItem("tabs");
	if (savedTabs) {
		tabs = JSON.parse(savedTabs);
	}
	if (tabs.length === 0) {
		addNewTab();
	} else {
		renderTabs();
		currentTab = 0;
		editor.innerHTML = tabs[currentTab].content;
		setActiveTab(currentTab);
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
		title: `Note ${tabs.length + 1}`,
		content: "",
	};
	tabs.push(newTab);
	saveTabsToStorage(); // save the new tab to storage
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

function editTabName(index) {
	const li = tabList.childNodes[index];
	const oldTitle = li.textContent;
	li.innerHTML = `
		<input class="tab-input" type="text" value="${oldTitle}">
	`;

	const input = li.querySelector(".tab-input");

	input.addEventListener("keyup", (event) => {
		if (event.key === "Enter") {
			const newTitle = input.value.trim() || oldTitle;
			tabs[index].title = newTitle;
			saveTabsToStorage();
			li.innerHTML = newTitle;
		}
	});

	input.addEventListener("blur", () => {
		const newTitle = input.value.trim() || oldTitle;
		tabs[index].title = newTitle;
		saveTabsToStorage();
		li.innerHTML = newTitle;
	});

	input.focus();
}

changeTabButton.addEventListener('click', () => editTabName(currentTab));

whiteModeToggle.addEventListener("click", () => {
	if (document.body.classList.contains("white-mode")) {
		disableWhiteMode();
	} else {
		enableWhiteMode();
	}
});

newTabButton.addEventListener("click", addNewTab);

removeAllTabsButton.addEventListener('click', removeAllTabs);

let charCountUpdater = setInterval(updateCharCount, 50);
let checkForTab = setInterval(checkTab, 50);

function checkTab() {
	if (tabs[currentTab] == undefined) {
        addNewTab();
    }
	else if (tabs[currentTab].content.length > 0) {
		return;
    }
}

function updateCharCount() {
  let num = tabs[currentTab].content.length;
  charCount.textContent = "Characters: " + num;
}

editor.addEventListener("input", () => {
	if (tabs[currentTab] == undefined) {
		addNewTab();
	}
	tabs[currentTab].content = editor.innerHTML;
	saveTabsToStorage();
});

loadTabsFromStorage();

setActiveTab(currentTab);