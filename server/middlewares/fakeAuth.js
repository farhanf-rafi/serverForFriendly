const fakeAuth = (req, res, next) => {
  req.user = {
    id: '69a15a4398f3026984fbf328', //farhan
    
    // id: '69a17200fdc9c90550328fb6', //farhan_1

    // id: '69a2a1afa4fface3216ad05e', //test
  };

  console.log('Fake auth middleware: user ID set to', req.user.id);

  next();
};

module.exports = { fakeAuth };
