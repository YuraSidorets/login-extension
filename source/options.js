// Don't forget to import this wherever you use it
// import browser from 'webextension-polyfill';
var browser = require("webextension-polyfill");

function login(data) {
	chrome.tabs.executeScript({
 		code: `(${ inContent })(${ JSON.stringify({ data: data }) })`
	}, _=>chrome.runtime.lastError);	
}
function inContent(data) {
	var loginInputs = [...document.querySelectorAll('input[type="text"]')];
	var passwordInputs = [...document.querySelectorAll('input[type="password"]')];
	var submitButton = document.querySelector('[type="submit"]');
 	loginInputs.forEach(function (loginInput) {
		loginInput.value = data.loginText;
	});

	passwordInputs.forEach(function (passwordInput) {
		passwordInput.value = data.passwordText;
	});

	submitButton.click();
}

function Cred(data) {
    var creds = $('#creds > tbody');
    this.node = $('#cred-template').clone();
    this.node.removeAttr('id');
    this.node.attr('class', 'cred');
    Cred.next_id++;
    this.node.find('.number').html(Cred.next_id);
    creds.append(this.node);

 	$('.login-button').on('click', function() {
        login(data);
    });

    if (data) {
        this.node.find('.number').text(Cred.next_id);
        this.node.find('.loginText').val(data.loginText);
        this.node.find('.passwordText').val(data.passwordText);
    }

    this.node.find('.loginText').on('keyup', () => storeCreds());

    this.node.find('.passwordText').on('keyup', () => storeCreds());

    this.node.find('.remove').on('click', () => {
        _this = $(this).parent().parent()

        _this.nextAll().find('.number').each((index, element) => {
            number = $(element).text();
            number--;
            $(element).text(number);
        });
        _this.remove();
        Cred.next_id--;
        storeCreds();
    });

    storeCreds();
}

Cred.next_id = 0;

function loadCreds() {
    var creds = localStorage.creds;
    try {
        JSON.parse(creds).forEach((cred) => {
            new Cred(cred);
        });
    } catch (e) {
        //localStorage.Creds = JSON.stringify([]);
    }
}

function storeCreds() {
    var creds = [];
    $('.cred').each((index, element) => {
        creds.push({
            loginText: $(element).find('.loginText').val(),
            passwordText: $(element).find('.passwordText').val()
        });
    });

    localStorage.creds = JSON.stringify(creds);
    browser.storage.sync.set({
        'creds': JSON.stringify(creds)
    });
}

function init() {
    $('#new').on('click', function() {
        new Cred();
    });
    loadCreds();
}

window.onload = () => init();