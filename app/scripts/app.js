var socket = io.connect(window.location.href);

var ipConfigButton = document.querySelector('.js-ip-config')
    , actionButtons = document.querySelectorAll('.btn-action')
    , ipModal = document.querySelector('#ipModal')
    , ipModalField = document.querySelector('#ipField')
    , ipModalSave = document.querySelector('.js-ip-save')
    , statusText = document.querySelector('.vol')


// Helper event function
function addEvent(evnt, elem, func) {
    if (elem.addEventListener) {
        elem.addEventListener(evnt, func, false);
    } else if (elem.attachEvent) {
        elem.attachEvent("on" + evnt, func);
    } else {
        elem[evnt] = func;
    }
}

addEvent('keypress', document, function(e) {
   if(e.keyCode == 13) {
      return false;
   }
});

addEvent("click", ipConfigButton, function(e) {
    e.preventDefault();
    showIpConfig();
});

if(localStorage.getItem('ipAddress') === null) {
    showIpConfig();
} else {
    socket.emit('setIpAddress', localStorage.getItem('ipAddress'));
    start();
}

function showIpConfig() {
    $("ipModal").modal();
    addEvent('click', ipModalSave, function(e) {
        e.preventDefault();

        socket.emit('setIpAddress', ipModalField.value);
        socket.on('ipAddressSetResult', function (result) {
            if(result.ip) {
                localStorage.setItem('ipAddress', ipAddress);
                $("#ipModal").modal("hide");
            } else if (result.error) {
                alert("Invalid IP address");
            }
        });
    });
}

function start() {
    Array.prototype.forEach.call(actionButtons, function(button) {
        addEvent('click', button, function(e) {
            e.preventDefault();
            button.blur();

            socket.emit('action', { action: button.getAttribute('data-action') });
        });
    });

    socket.on('volume', function(result) {
        statusText.textContent = "Volume - " + result.volume;
    });
}
