const router = require("express").Router();
const middleware = require("./middleware")
const controller = require("./controller");
// const { upload } = require("../../helpers/media");

router.post('/activate', middleware.validateForActivation, controller.activate)
router.get('/un-activate', controller.unActivate)
router.get('/get-alluser', controller.getAllUser)
router.get('/get-alluser-withoutcoordinates', controller.getAllUserWithoutCoordinates)

// router.post('/', middleware.validateAddProduct, controller.addProduct);
// router.post('/createProduct',upload.any(), controller.createProductBeta);
// router.put('/:id', middleware.validateUpdateProduct, controller.updateProduct);
// router.put('/updateProductBeta/:id', controller.updateProductBeta);
// router.get('/:id', controller.getProductById);
// router.get('/', controller.getAllProducts);
// router.delete('/:id', controller.deleteProductId);

module.exports = router;