//TODAS TIENEN QUE PASAR POR LA VALIDACION DEL TOKEN
//OBTENER EVENTOS
/**
 * Events Routes
 * /api/events
 */
const {Router} = require('express')
const {check} = require('express-validator')
const { validarJWT } = require('../helpers/validarJwt');
const { getEventos, crearEventos, actualizarEvento, eliminarEvento } = require('../controllers/events');
const { validarCampos } = require('../middlewares/validar-campos');
const { isDate } = require('../helpers/isDate');

const router = Router();
router.use(validarJWT)
router.get('/',getEventos)
router.post('/',[check('title','El titulo es obligatorio').not().isEmpty(),
check('start','Fecha de inicio es obligatoria').custom(isDate),
check('end','Fecha de finalizacion es obligatoria').custom(isDate),validarCampos],crearEventos)

router.put('/:id',actualizarEvento)
router.delete('/:id',eliminarEvento)

module.exports = router