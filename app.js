let tabs = [];
let currentTab = 0;
const editor = document.getElementById('editor');
const whiteModeToggle = document.getElementById('white-mode-toggle');
const newTabButton = document.getElementById('new-tab-button');
const tabList = document.getElementById('tab-list');
const removeAllTabsButton = document.getElementById('remove-all-tabs-button');
const changeTabButton = document.getElementById('change-note-button');
const charCount = document.querySelector('#text-container');
const clearButton = document.getElementById('clear-all-tabs-button');

function saveTabsToStorage() {
	console.log("Saving tabs to storage");
	localStorage.setItem("tabs", JSON.stringify(tabs));
}

function loadTabsFromStorage() {
	console.log("Loading tabs from storage");
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
	console.log("Enabled White Mode");
	document.body.classList.add("white-mode");
	saveTabsToStorage();
}

function disableWhiteMode() {
	console.log("Disabled White Mode");
	document.body.classList.remove("white-mode");
	saveTabsToStorage();
}

function addNewTab() {
	console.log("Adding new tab");
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
	console.log("Removing tab");
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
	console.log("Removing current tab");
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
	console.log("Removing all tabs");
	tabs = [];
	saveTabsToStorage(); // this was the fix? :skull:
	editor.innerHTML = "";
	renderTabs();
}

function renderTabs() {
	console.log("Rendering tabs");
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
	console.log("Setting current tab to ", index);
	currentTab = index;
	editor.innerHTML = tabs[currentTab].content;
	setActiveTab(currentTab);
}

function setActiveTab(index) {
	console.log("Setting active tab to ", index);
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
	console.log("Editing tab name");
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

function clearTab() {
	console.log("Clearing tab");
	try {
	  tabs[currentTab].content = "";
	  editor.innerHTML = ""; // clear the editor HTML as well
	  saveTabsToStorage();
	} catch (err) {
	  console.log("Error clearing tab: ", err);
	}
  }

  
clearButton.addEventListener('click', clearTab)

function updateCharCount() {
  let num = editor.textContent.length;
  if (num === undefined) {
	console.log("No content, caught error.");
  }
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