const { Router } = require('express');
const router = Router();

const { validateRequestBody } = require('../../util/requestValidation');
const { requireUserRole, checkCanEditUserRoles } = require('./middleware');
const {
  getAllUsersRoles,
  getUserRoles,
  getUserPermissions,
  getUsersByPermission,
  addUserRoles,
  deleteUserRoles,
  setUserRoles
} = require('./endpoints');

router.get('/all', [
  requireUserRole(['admin', 'super_admin', 'facilitator']),
  getAllUsersRoles
]);

router.get('/permission', [getUserPermissions]);
router.post('/user/permission', [
  requireUserRole(['admin', 'super_admin', 'facilitator']),
  getUsersByPermission
]);

router.get('/:user_id', [
  requireUserRole(['admin', 'super_admin', 'facilitator']),
  getUserRoles
]);

router.put('/:user_id', [
  checkCanEditUserRoles(req => req.params.user_id),
  validateRequestBody,
  setUserRoles
]);

router.post('/add', [
  checkCanEditUserRoles(req => req.session.user.id),
  validateRequestBody,
  addUserRoles
]);

router.post('/delete', [
  checkCanEditUserRoles(req => req.session.user.id),
  validateRequestBody,
  deleteUserRoles
]);

module.exports = router;
