

function changeTabTitle(optionIndex, tabId, title, reload) {
    if (!title) { return; }
    var code = "document.title = " + "'" + title + "'";
    chrome.tabs.executeScript(parseInt(tabId), { code: code });

    if (reload) {
        var dropdown = document.getElementById('dropdown');
        dropdown.options[optionIndex].innerHTML = title;
    }
}

function reloadDropdown() {
    var dropdown = document.getElementById('dropdown');
    dropdown.options.length = 0;
    loadDropdown(false, dropdown);
}
function loadDropdown(firstLoad, visibleDropdown) {
    d = document.getElementById('dropdown');
    var hiddenDropdown = document.getElementById('dropdown-hidden');
    chrome.tabs.query({ lastFocusedWindow: true }, function (tabs) {
        tabs.forEach(function (tab) {
            console.log(tab.title + " id: " + tab.id);
            var opt = document.createElement('option');
            opt.innerHTML = tab.title;
            opt.value = tab.id;
            d.appendChild(opt);
            if (firstLoad) {
                var newOpt = document.createElement('option');
                newOpt.innerHTML = tab.title;
                newOpt.value = tab.id;
                hiddenDropdown.appendChild(newOpt);
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {

    loadDropdown(true, document.getElementById('dropdown'));

    var applyBtn = document.getElementById('apply-btn');
    applyBtn.onclick = function () {
        var dropdown = document.getElementById('dropdown');
        var input = document.getElementById('titleInput');
        var selected = dropdown.options[dropdown.selectedIndex];
        changeTabTitle(dropdown.selectedIndex, selected.value, input.value, true);
    };

    document.getElementById('reload-btn').onclick = function () {
        var originalTabs = document.getElementById('dropdown-hidden').options;
        chrome.tabs.query({ lastFocusedWindow: true}, function (tabs) {
            tabs.forEach(function (tab) {
                var matched;
                for(var i =0; i < originalTabs.length; i++){
                    if (originalTabs[i].value == tab.id) {
                        matched = originalTabs[i];
                    }
                }
                if (matched) {
                    changeTabTitle(matched.index, tab.id, matched.text, true)
                }
            });
        });
       // reloadDropdown();
    }
});
