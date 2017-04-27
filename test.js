export default function(Products) {

  Products.prototype.markSold = async function(params) {
    const {
      product_id,
      querier,
      ctx,
      sold_on,
      sold_to
    } = params

    const columns = [
      'product_id',
      'user_id',
      'location',
      'status',
      'poster_ip',
      'price',
      'currency',
      'title',
      'slug',
      'description',
