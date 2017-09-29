const { UserModel } = require('../services/db');
const { createUser } = require('../services/userService');
const { createCompany } = require('../services/companyService');
const { createIndustry } = require('../services/industryService');
const crypto = require('crypto');
const async = require('async');

function createAdminUser() {
  const email = 'test@test.test';
  const password = '123456';

  createUser({
    email,
    password,
  }, (err) => {
    if (err) {
      return console.error(err);
    }

    return console.log('Admin created sucessfuly');
  });
}

function createIndustries() {
  async.parallel([
    function (eCb) {
      createIndustry({name: 'BANK'}, eCb);
    },

    function (eCb) {
      createIndustry({name: 'E-COMMERCE'}, eCb);
    }
  ], (err) => {
    if (err) {
      return console.error(err);
    }

    return console.log('industries created');
  });

}

function createDefaultCompany() {
  const homeData = {
    name: 'Test Company Name',
    info: 'Test company info description/ Can be long description. Dont forget to check the length',
    logo: 'https://dummyimage.com/300.png',
    introduction: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.',
    url: 'https://google.com',
    banner: 'https://dummyimage.com/1920x1080.png',
    image: 'https://dummyimage.com/500x500.png',
    main: true,
  };

  createCompany(homeData, (err) => {
    if (err) {
      return console.error(err);
    }

    return console.log('Company created successfully');
  });
}

//createAdminUser();
//createIndustries();
createDefaultCompany();
