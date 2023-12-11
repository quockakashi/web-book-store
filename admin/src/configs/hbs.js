const hbs = require('hbs');

hbs.registerHelper('eq', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : '';
})

hbs.registerHelper('range', function(start, end, options) {
    var accumulator = '';
    for(let i = start; i <= end; i++) 
        accumulator += options.fn(i);
    return accumulator;
})

hbs.registerHelper('ifIn', function(elem, list, options) {
    if (list.indexOf(elem) > -1) {
        return options.fn(this);
    } 
})

hbs.registerHelper('renderStars', (rating, option) => {
    let style = '';
    if(option && option == 'sm') {
        style = 'style="font-size: 12px"'
    } 
    let result = '';
    for (let i = 1; i <= 5; i++) {
        let starClass = '';
        if(rating >= i) {
            starClass = 'fa-solid fa-star checked-star';
        } else if(Math.round(rating) === i) {
            starClass = 'fa-solid fa-star-half-stroke checked-star';
        } else {
            starClass = 'fa-regular fa-star';
        }

        result += `<span class="${starClass}" ${style}></span>`;
    }

    return result;
})

module.exports = hbs;