var browser = require("webextension-polyfill");

browser.storage.onChanged.addListener((changes) => {
    for (key in changes) {
        var storageChange = changes[key];
        localStorage.creds = storageChange.newValue;
    }
});

browser.runtime.onInstalled.addListener((details) => {
    if (details.reason == "install") {
        browser.storage.sync.get('creds').then(function (items) {
            if (typeof items.creds == 'undefined') {
                localStorage.creds = JSON.stringify([{
                    "login": "",
                    "password": ""
                }]);
                browser.storage.sync.set({
                    'creds': JSON.stringify([{
                        "login": "",
                        "password": ""
                    }])
                });
            } else {
                localStorage.creds = items.creds;
            }
        });

    } else if (details.reason == "update") {
        browser.storage.sync.get('creds').then(function (items) {
            if (typeof items.creds == 'undefined') {
                browser.storage.sync.set({
                    'creds': localStorage.creds
                });
            } else {
                localStorage.creds = items.creds;
            }
        });
    }
});