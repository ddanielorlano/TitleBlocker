
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

function loadTabs() {

    var $tabs = $("#tabs");

    chrome.tabs.query({ lastFocusedWindow: true }, function (tabs) {
        tabs.forEach(function (tab) {
            console.log(tab.title + " id: " + tab.id);
            $tabs.append(generateHtml(tab.id, tab.title));

        });
    });
}
function generateHtml(id, title) {
    var $html = "<div id = \"" +id+ "\">" + "<small class=\"titleText\">" + title
        + "</small><div class=\"input-group input-group-sm mb-3\">"
        + "<div class=\"input-group-prepend\">"
        + "<button class=\"btn btn-outline-secondary\" id=\"changBtn"+id+"\" data-tabid=\"" + id + "\" type=\"button\">Change</button></div>"
        + "<input type=\"text\" class=\"form-control\""+ "id=\"\input-" + id + "\">";
    return $html;
}
$(document).ready(function () {

    loadTabs();
    $('#tabs').on('click', '.btn', function (btn) {

        var id = $(this).data('tabid');
        var title = $(this).parent().next('input').val();
        if (!title) return;

        var titleText = $(this).parents().children('.titleText');
        var oldTitle = titleText.html();
        titleText.html(title);
        var code = "document.title = " + "'" + title + "'";
        chrome.tabs.executeScript(parseInt(id), { code: code });
    });
});


