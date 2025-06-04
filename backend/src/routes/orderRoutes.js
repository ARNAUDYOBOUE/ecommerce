const express = require('express');
const router = express.Router();

// Ici, vous importerez le contrôleur de commande et définirez vos routes.
// Exemple pour la route GET /api/orders :
const orderController = require('../controllers/orderController');
router.get('/', orderController.getOrders);

module.exports = router; 