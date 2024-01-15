$(document).ready(() => {
    const menuBtn = $('.header_toggle');
    menuBtn.on('click', (e) => {
        $('.l-navbar').toggleClass('show-sidebar');
        menuBtn.toggleClass('bx-x');
        $('body').toggleClass('body-pd');
        $('#header').toggleClass('header-pd');
    })
});