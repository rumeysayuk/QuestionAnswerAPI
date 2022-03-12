const Question = require("../../models/Question");
const searchHelper = (searchKey, query, req) => {
   if (req.query.search) {
      const searchObject = {}
      const regex = new RegExp(req.query.search, "i")
      searchObject[searchKey] = regex
      return query.where(searchObject)
   }
   return query
}
const populateHelper = (query, population) => {
   return query.populate(population)
}
const questionSortHelper = (query, req) => {
   const sortKey = req.query.sortBy
   if (sortKey === "most-answered") {
      return query.sort("-answerCount")  //buyukten kucuge
   }
   if (sortKey === "most-liked") {
      return query.sort("-likeCount")  //buyukten kucuge
   }
   return query.sort("-createdAt")
}
//mongo metotlar skip(2) 2 tane atlar 0 ve 1. kaydı gecer 2 den
// başlayarak getirir. limit(2) 2 tane atlar 0 ve 1.kaydı gecer 2 ve 3 ü getirir

const paginationHelper = async (totalDocuments, query, req) => {
   const page = parseInt(req.query.page) || 1
   const limit = parseInt(req.query.limit) || 5
   const startIndex = (page - 1) * limit
   const endIndex = page * limit
   const pagination = {}

   let total = totalDocuments
   if (startIndex > 0) {
      pagination.previous = {
         page: page - 1,
         limit: limit
      }
   }
   if (endIndex < total) {
      pagination.next = {
         page: page + 1,
         limit: limit
      }
   }
   return {
      query: query === undefined ? undefined : query.skip(startIndex).limit(limit),
      pagination: pagination,
      startIndex,
      limit
   }
}

module.exports = {
   searchHelper,
   populateHelper,
   questionSortHelper,
   paginationHelper
}