const {
    Router
} = require('express');
const router = Router();

let stream = false;

//Rutas disponibles
router.get('/', (req, res) => {
    // console.log(stream)
    res.redirect('index.html');
})

//Asigna el valor de Verdadero o falso, según se está en directo o no
router.post('/setStreamValue', (req, res) => {
    stream = req.body.streamValue;
    // console.log(stream)
})

//Devuelve el valor de verdadero o falso según se está haciendo el directo
router.get('/getStreamValue', (req, res) => {
    // console.log(stream)
    res.json({
        'streamValue': stream
    });
})

module.exports = router;