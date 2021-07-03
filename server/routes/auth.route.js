const Route = require('express').Router;

const { authController } = require('../controllers');
const { authMiddleware } = require('../middlewares');

const router = new Route();

router.post(
    '/registration',
    authMiddleware.checkRegistrationBody,
    authMiddleware.checkUniqueEmail,
    authController.registration
);

router.post('/login', authMiddleware.checkLoginBody ,authController.login );

router.post('/logout', authController.logout );

router.get(
    '/activate/:link',
    authController.activate
);

router.get('/refresh', authMiddleware.checkRefreshToken, authController.refresh );
router.get('/users', authMiddleware.checkIsAuthtorized, authController.getUsers );

module.exports = router;