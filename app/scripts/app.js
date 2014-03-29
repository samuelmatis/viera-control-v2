var socket = io.connect('http://localhost:3000');

FastClick.attach(document.body);

$('html').bind('keypress', function(e) {
   if(e.keyCode == 13) {
      return false;
   }
});

$('.js-ip-config').bind('click', function(e) {
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
    $("#ipModal").modal();
    $(".js-ip-save").on("click", function(e) {
        e.preventDefault();

        socket.emit('setIpAddress', $('#ipField').val());
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
    $(".btn-action").on("click", function(e) {
        e.preventDefault();
        $(this).blur();

        socket.emit('action', {action: $(this).data('action')});
    });

    socket.on('volume', function(result) {
        $(".vol").text("Volume - " + result.volume);
    });
}
