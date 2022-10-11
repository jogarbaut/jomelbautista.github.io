window.onscroll = function() {
    if (document.body.scrollTop > 0 || document.documentElement.scrollTop > 0 ) {
        document.getElementById('navbar').classList.add('scrolled');
    } else {
        document.getElementById('navbar').classList.remove('scrolled');
    }
}

function redirect() {
    document.querySelector('.thanks').classList.remove('thanks-hidden');
    setTimeout(() => {
        window.location.href = 'https://southbayrandp.janeapp.com/#/staff_member/1/treatment/1';
    }, 2000); // Wait 2 seconds and then redirect.
}

// Animate On Scroll
AOS.init({
    duration: 750
});