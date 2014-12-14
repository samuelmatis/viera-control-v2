'use strict';

var socket = io.connect(window.location.href);

var ipConfigButton = document.querySelector('.js-ip-config'),
    configView = document.querySelector('#configView'),
    appView = document.querySelector('#appView'),
    actionButtons = document.querySelectorAll('.btn-action'),
    ipModalField = document.querySelector('#ipField'),
    ipModalSave = document.querySelector('.js-ip-save'),
    statusText = document.querySelector('.vol');


// Helper event function
function addEvent(evnt, elem, func) {
    if (elem.addEventListener) {
        elem.addEventListener(evnt, func, false);
    } else if (elem.attachEvent) {
        elem.attachEvent('on' + evnt, func);
    } else {
        elem[evnt] = func;
    }
}

if(localStorage.getItem('ipAddress')) {
    start();
} else {
    showIpConfig();
}


function switchView(from, to) {
    from.style.display = 'none';
    to.style.display = 'block';
}

function showIpConfig() {
    switchView(appView, configView);

    addEvent('click', ipModalSave, function(e) {
        e.preventDefault();

        socket.emit('setIpAddress', ipModalField.value);
        socket.on('ipAddressResult', function (result) {
            if(result.ip) {
                localStorage.setItem('ipAddress', result.ip);
                start();
            } else if (result.error) {
                alert('Invalid IP address');
            }
        });
    });
}

function start() {
    switchView(configView, appView);

    socket.emit('setIpAddress', localStorage.getItem('ipAddress'));

    socket.on('volume', function(result) {
        statusText.textContent = 'Volume - ' + result.volume;
    });

    [].forEach.call(actionButtons, function(button) {
        addEvent('click', button, function(e) {
            e.preventDefault();
            button.blur();

            socket.emit('action', { action: button.getAttribute('data-action') });
        });
    });

    addEvent('click', ipConfigButton, function(e) {
        e.preventDefault();

        showIpConfig();
    });
}
