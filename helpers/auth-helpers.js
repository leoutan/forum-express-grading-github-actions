const getUser = req => {
  return req.user || null // 等價於 req.user?req.user:null
}

const ensureAuthenticated = req => {
  return req.isAuthenticated()
}

module.exports = { getUser, ensureAuthenticated }
