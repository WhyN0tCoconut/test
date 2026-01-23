// Initial particles on page load
document.addEventListener('DOMContentLoaded', function () {
    createParticles();
    initializeAnimation();
    setupScrollAnimations();

});

//create floating particles
function createParticles() {

    const particles = document.getElementById('particles');
    const particleEmojis = ['❤️', '❤️‍🩹', '💝', '💍', '🎉', '🦋','✨', '🌸', '💞'];

for (let i=0; i<15; i++){
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.innerHTML = particleEmojis[Math.floor(Math.random() * particleEmojis.length)];


//random position
particle.style.left = Math.random() * 100 + '%';
particle.style.top = Math.random() * 100 + '%';



//random animation duration and delay

particle.style.animationDuration = (Math.random() * 3 + 4) + 's';
particle.style.animationDelay = Math.random() * 2 + 's';
particles.appendChild(particle);


}

}

// initialize the typewriter and other animations
function initializeAnimation() {
    //type
    //add
    const fadeElement = document.querySelectorAll('.fade-in');
    fadeElement.forEach((element, index) => {
        element.style.animationDelay = (index * 0.2) + 's';

    });

}
// Mobile-friendly photo caption animation
const photoCaptions = document.querySelectorAll('.photo-card .photo-overlay');

photoCaptions.forEach(caption => {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate-caption');
            }
        });
    }, { threshold: 0.3 });

    observer.observe(caption);
});

//scroll ani
function setupScrollAnimations() {
    const observerOptions ={
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

const observer = new IntersectionObserver((entries) => {
entries.forEach(entry => {
    if (entry.isIntersecting){
        entry.target.classList.add('aos-animate');


        //special handling
        if (entry.target.classList.contains('message-card')) {

animateMessageText();


        }
    }
});
}, observerOptions);

//observe element
const elementsToObserve = document.querySelectorAll('[data-aos], .section-title, .message-card');
     elementsToObserve.forEach(element =>{
        observer.observe(element);

        //add delay
        const delay = element.getAttribute('data-delay');
        if (delay){
            element.style.transitionDelay = delay + 'ms';

        }
     });
    }


    // animate

    function animateMessageText() {
        const messageTexts = document.querySelectorAll('.message-text');
        messageTexts.forEach((text, index) => {

            setTimeout(() => {
                text.classList.add('fade-in-animate');

            }, index * 500);

        });
    }

    // smooth scroll
    function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    // Play background music
    const music = document.getElementById('bg-music');
    if (music) {
        music.play().catch(() => {
            // If autoplay is blocked, do nothing
            console.log("Autoplay blocked, user interaction needed.");
        });
    }
}

    //toggle 
    function toggleLike(button){
const heartIcon = button.querySelector('.heart-icon');
button.classList.toggle('liked');

if (button.classList.contains('liked'))
{
    heartIcon.textContent = '❤️';

    // create floating heart
    createFloatingHeart(button);

} else {
    heartIcon.textContent = '🤍';
}



    }



    //create floating heart ani
    function createFloatingHeart(button)
{
    const heart = document.createElement('div');
    heart.innerHTML= '❤️';
    heart.style.position = 'absolute';
    heart.style.fontSize = '1.5rem';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '1000';

    const rect = button.getBoundingClientRect();
    heart.style.left = rect.left + 'px';
    heart.style.top = rect.top + 'px';

    document.body.appendChild(heart);



// animate the heart
heart.animate([
    {transform: 'translateY(0px) scale(1)', opacity: 1},


    {transform: 'translateY(-60px) scale(1.5)', opacity: 0  }




], {
duration: 1500,
easing: 'ease-out'
}).onfinish = () => {
    document.body.removeChild(heart);
};

}

    

// add parallax effect
window.addEventListener('scroll', () =>{

const scrolled = window.pageYOffset;
const hero = document.querySelector('.hero');
const parallaxSpeed = 0.5;

if (hero) {
    hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;

}
//update particles position
const particles = document.querySelectorAll('.particle');
particles.forEach((particle, index) => {
    const speed = 0.2 + (index % 3) * 0.1;
    particle.style.transform = `translateY(${scrolled * speed}px)`;

});


});




//add mouse movement 
document.addEventListener('mousemove', (e) => {
const hero = document.querySelector('.hero');
if (!hero) return;

const x = e.clientX / window.innerWidth;
const y = e.clientY / window.innerHeight;


const moveX = (x - 0.5) * 20;
const moveY = (x - 0.5) * 20;

const floatingHearts = document.querySelector('.floating-hearts');
if (floatingHearts){
    floatingHearts.style.transform = `translate(${moveX}px, ${moveY}px)`;
}

});

 //add clicl efect
 document.querySelectorAll('button').forEach(button =>{
    button.addEventListener('click', function (e){
const ripple = document.createElement('span');
const rect = this.getBoundingClientRect();
const size = Math.max(rect.width, rect.height);
const x = e.clientX - rect.left - size /2;
const y = e.clientY - rect.top - size /2;

ripple.style.cssText = `
position: absolute;
width: ${size}px;
height: ${size}px;
left: ${x}px;
top: ${y}px;
background: rgba(255, 255, 255, 0.5);
border-radius: 50%;
transform: scale(0);
animation: ripple 0.6s ease-out;
pointer-events: none;

`;

this.style.position = 'relative';
this.style.overflow = 'hidden';
this.appendChild(ripple);

setTimeout(() =>{
    ripple.remove();

},600);



    });
 });

// add riple animation

const style = document.createElement('style');
style.textContent = `
@keyframes ripple {
to {
transform: scale(2);
opacity: 0;

}
}

`;
document.head.appendChild(style);



//add entrance animation
const photoObserver = new IntersectionObserver((entries) =>{
    entries.forEach(entry => {
if (entry.isIntersecting){

    const img = entry.target.querySelector('img');
    if(img){

        img.style.animation = 'photoEnter 0.8s ease-out forwards';

    }
}

    });
}, { threshold: 0.2});

// observe all photo cards

document.querySelectorAll('.photo-card').forEach(card => {
    photoObserver.observe(card);
});

//add photo enter animation
const photoStyle = document.createElement('style');
photoStyle.textContent = `
@keyframes photoEnter {
from {
transform: scale(0.8) rotate(-5deg);
opacity: 0;
}
to {
transform: scale(1) rotate(0deg);
opacity: 1;
}
}
`;
document.head.appendChild(photoStyle);





