const { Router } = require('express');
const { validateRequestBody } = require('../../../util/requestValidation');

const slides = new Router();
const {
    getSlides,
    getSlidesResponseComponents,
    addSlide,
    orderSlides,
    updateSlide,
    setAllSlides,
    deleteSlide
} = require('./endpoints');

slides.get('/', getSlides);
slides.post('/', [validateRequestBody, setAllSlides]);
slides.get('/response-components', getSlidesResponseComponents);
slides.put('/', [validateRequestBody, addSlide]);
slides.post('/order', [validateRequestBody, orderSlides]);
slides.post('/:slide_id', [validateRequestBody, updateSlide]);
slides.delete('/:slide_id', deleteSlide);

module.exports = slides;
