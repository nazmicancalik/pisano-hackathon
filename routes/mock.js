var express = require('express');
var router = express.Router();


var mockResponse = [
    {
        id: 1,
        name: 'Passport',
        description: 'Passaport for everyone'
    },
    {
        id: 2,
        name: 'Passport Harcı',
        description: 'You have to pay for passport'
    },
    {
        id: 3,
        name: 'Biyometrik Foto',
        description: 'Photo'
    },

    {
        id: 4,
        name: 'Nüfus Cüzdanı',
        description: 'Nüfus Cüzdanı, Kimlik'
    }
];

/* Mock for frontend */
router.get('/', function(req, res, next) {
  res.send(mockResponse);
});

module.exports = router;
