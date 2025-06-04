const express = require('express');
const NotFoundError = require('./errors/NotFoundError');
const router = express.Router();

const authRoutes = require('./modules/auth/auth.routes');
const monthlySummaryRoutes = require('./modules/monthlySummary/monthlySummary.routes');
const categoryRoutes = require('./modules/category/category.route');
const transactionRoutes = require('./modules/transaction/transaction.route');
const userRoutes = require('./modules/user/user.route');
router.use('/users', userRoutes)
router.use('/auth', authRoutes )
router.use('/monthly-summaries', monthlySummaryRoutes);
router.use('/categories', categoryRoutes);
router.use('/transactions', transactionRoutes);

router.use((req, res) => {
    throw new NotFoundError('Route not found');
})


module.exports = router;