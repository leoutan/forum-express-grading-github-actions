const getOffset = (limit, page) => {
  return (page - 1) * limit
}

const getPagination = (limit, page, total) => {
  const totalPage = Math.ceil(total / limit)
  const pages = Array.from({ length: totalPage }).map((_, index) => index + 1)
  const currentPage = page < 1 ? 1 : (page > totalPage ? totalPage : page)
  const prev = currentPage > 1 ? currentPage - 1 : 1
  const next = currentPage < totalPage ? currentPage + 1 : totalPage
  return {
    totalPage,
    pages,
    currentPage,
    prev,
    next
  }
}

module.exports = {
  getOffset,
  getPagination
}