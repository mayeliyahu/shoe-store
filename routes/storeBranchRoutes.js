const express = require('express');
const { getStoreBranches, createStoreBranch, getStoreBranchById, updateStoreBranch, deleteStoreBranch } = require('../controllers/storeBranchController');
const router = express.Router();

router.get('/', getStoreBranches);      
router.post('/', createStoreBranch);     
router.get('/:id', getStoreBranchById);  
router.put('/:id', updateStoreBranch);   
router.delete('/:id', deleteStoreBranch);

module.exports = router;
