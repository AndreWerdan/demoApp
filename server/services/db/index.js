const mongoose = require('mongoose');
const { logger } = require('../../services/loggerService');

const { Schema, model } = mongoose;
const { DB_NAME, DB_PORT, DB_HOST, DB_USER, DB_PASS } = require('../../config');
const { Types: { ObjectId } } = Schema;

const mainConnection = mongoose.createConnection(DB_HOST, DB_NAME, DB_PORT, {
  user: DB_USER,
  pass: DB_PASS,
  server: {
    poolSize: 50,
  },
  auth: {
    authdb: 'admin',
  },
}, (err) => {
  if (err) {
    logger.error(`DB CONNECT: ${err}`);
    throw err;
  }

  logger.info(`DB CONNECT: ${DB_HOST}:${DB_PORT}/${DB_NAME} succesfull`);
});

const userSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
}, {
  collection: 'users',
});

const featuredCompanySchema = new Schema({
  title: { type: String, required: true, unique: true },
  url: { type: String, required: true },
  industryId: { type: Schema.Types.ObjectId },
}, {
  collection: 'featuredCompanies',
});

const industrySchema = new Schema({
  name: {type: String, required: true},
  banner: {type: String, default: ''},
  pdfUrl: {type: String, default: ''},
  main: {type: Boolean, default: true},
}, {
  collection: 'industries',
});

const companySchema = new Schema({
  name: { type: String, default: '' },
  info: { type: String, default: '' },
  introduction: { type: String, default: '' },
  url: { type: String, default: '' },
  logo: { type: String, default: '' },
  image: { type: String, default: '' },
  banner: { type: String, default: '' },
  main: { type: Boolean, default: false },
}, {
  collection: 'companies',
});

const leadsSchema = new Schema({
  company: { type: String, default: '' },
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  jobPosition: { type: String, default: '' },
  industryId: { type: ObjectId },
  downloadReport: { type: Boolean, default: false },
  industryReport: { type: Boolean, default: false },
  companyReport: { type: Boolean, default: false },
  createdAt: { type: Date, default: new Date() },
}, {
  collection: 'leads',
});

const UserModel = mainConnection.model('User', userSchema);
const IndustryModel = mainConnection.model('Industry', industrySchema);
const CompanyModel = mainConnection.model('Company', companySchema);
const FeaturedCompanyModel = mainConnection.model('FeaturedCompany', featuredCompanySchema);
const LeadsModel = mainConnection.model('LeadsCompany', leadsSchema);

module.exports = {
  mainConnection,
  UserModel,
  CompanyModel,
  IndustryModel,
  FeaturedCompanyModel,
  LeadsModel,
};
