export default ({ page, count, filter = {}, sort = { createdAt: -1 } }) => {
  return `/cms/leads/?p=${page}&c=${count}&f=${encodeURIComponent(JSON.stringify(filter))}&s=${encodeURIComponent(JSON.stringify(sort))}`;
};
