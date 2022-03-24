// import anime from 'animejs/lib/anime.es.js' 
import $ from 'jquery'
import 'slick-carousel'
import '../css/styles.css'

window.onscroll = function (e) {
    if (window.pageYOffset > 100) {
        $('.nav').removeClass('bg-transparent')
        $('.nav').addClass('shadow-lg bg-white')
        $('.brand-logo').addClass('md:h-16').removeClass('md:h-24')
        $('.brand-name').removeClass('hidden')
    } else {
        $('.nav').addClass('bg-transparent')
        $('.nav').removeClass('shadow-lg bg-white')
        $('.brand-logo').addClass('md:h-24').removeClass('md:h-16')
        $('.brand-name').addClass('hidden')
    }
}

//------------- Teams -------------- 
$('.our-team').slick({
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    responsive: [{
        breakpoint: 720,
        settings: {
            infinite: true,
            slidesToShow: 2,
            slidesToScroll: 1,
            autoplay: true,
        }
    }, ]
});