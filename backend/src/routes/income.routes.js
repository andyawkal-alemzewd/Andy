const express = require('express');
const router = express.Router();
const incomeController = require('../controllers/incomeController');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * @route   GET /api/income/summary
 * @desc    Get income summary with filters
 * @access  Private - Admin/Staff only
 */
router.get('/summary', authenticate, authorize('admin', 'staff'), incomeController.getIncomeSummary);

/**
 * @route   GET /api/income/reports
 * @desc    Get financial reports
 * @access  Private - Admin/Staff only
 */
router.get('/reports', authenticate, authorize('admin', 'staff'), incomeController.getFinancialReports);

/**
 * @route   GET /api/income/revenue-by-equipment
 * @desc    Get revenue breakdown by equipment
 * @access  Private - Admin/Staff only
 */
router.get('/revenue-by-equipment', authenticate, authorize('admin', 'staff'), incomeController.getRevenueByEquipment);

/**
 * @route   GET /api/income/outstanding
 * @desc    Get outstanding payments
 * @access  Private - Admin/Staff only
 */
router.get('/outstanding', authenticate, authorize('admin', 'staff'), incomeController.getOutstandingPayments);

module.exports = router;
