var canvas = document.getElementById('preview');
var context = canvas.getContext('2d');
var btnInit = document.querySelector('#btnInit');
var btnStop = document.querySelector('#btnStop');
var socket = io('/', {
    transports: ['websocket']
});
var streamValue;
var intervalo;

canvas.width = 600;
canvas.height = 400;

context.width = canvas.width;
context.height = canvas.height;

var video = document.getElementById('video');

function loadCam(stream) {
    video.srcObject = stream
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Cámara funcionando correctamente.',
        showConfirmButton: false,
        timer: 1500
    })
}

function loadFail() {
    Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'La cámara no ha podido iniciarse.',
        showConfirmButton: false,
        timer: 1500
    })
}

async function verVideo(video, context) {
    context.drawImage(video, 0, 0, context.width, context.height);
    const img = await socket.emit('stream', canvas.toDataURL('image/webp'))
    // console.log('Image sent')
}

async function getStreamValue() {
    const res = await axios.get('/getStreamValue');
    return res.data.streamValue;
}

btnInit.addEventListener('click', async () => {

    streamValue = await getStreamValue();

    if (streamValue) {
        Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Ya hay un stream en curso.',
            showConfirmButton: false,
            timer: 1500
        })
    } else {
        navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator
            .mozGetUserMedia || navigator.msgGetUserMedia);

        if (navigator.getUserMedia) {

            navigator.getUserMedia({
                video: true
            }, loadCam, loadFail);
        }

        intervalo = setInterval(() => {
            verVideo(video, context);
        }, 175)

        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'El stream ha iniciado correctamente.',
            showConfirmButton: false,
            timer: 1500
        })

        axios.post('/setStreamValue', {
            streamValue: true
        })
        streamValue = true;
    }

})

btnStop.addEventListener('click', () => {
    if (streamValue) {

        clearInterval(intervalo);

        axios.post('/setStreamValue', {
            streamValue: false
        })
        streamValue = false;
        video.srcObject = null;

        context.clearRect(0, 0, canvas.width, canvas.height);

        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'El stream se ha detenido correctamente.',
            showConfirmButton: false,
            timer: 1500
        })
    } else {
        Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'No está transmitiendo.',
            showConfirmButton: false,
            timer: 1500
        })
    }
})

function salir(e) {
    if (streamValue == true) {
        if (!e) e = window.event;
        //e.cancelBubble is supported by IE - this will kill the bubbling process.
        e.cancelBubble = true;
        e.returnValue =
            '¿Estás seguro que deseas salir? \nEl stream terminará.'; //This is displayed on the dialog

        //e.stopPropagation works in Firefox.
        if (e.stopPropagation) {
            e.stopPropagation();
            e.preventDefault();
        }

        axios.post('/setStreamValue', {
            streamValue: false
        })
        streamValue = false;

    }
}
window.onbeforeunload = salir;