import gsap from 'gsap';
import Flip from 'gsap/Flip';
import ScrollTo from 'gsap/ScrollToPlugin';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, Flip, ScrollTo);

export const initAnimations = () => {
  // Création d'un objet MatchMedia qui permet de gérer les animations avec le responsive
  const mm = gsap.matchMedia();

  // Pour toutes les tailles d'écran supérieures à 991px
  mm.add('screen and (min-width: 992px)', () => {
    // Création de la timeline pour le scroll horizontal
    const scrollTween = gsap.timeline({
      ease: 'none',
      scrollTrigger: {
        trigger: '.sticky_wrapper',
        pin: true,
        scrub: 0.3,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          if (self.progress >= 0.01) {
            $('.nudge_effect').css('opacity', 0);
          } else {
            $('.nudge_effect').css('opacity', 1);
          }
        },
      },
    });

    // Animation du scroll horizontal
    scrollTween.fromTo(
      '.content_wrapper',
      {
        xPercent: 0,
      },
      {
        xPercent: -100,
        ease: 'none',
      }
    );

    // Gestion de l'effet "nudge" qui apparaît seulement lorsque que le "fake scroll" est inférieur à 0.01
    setInterval(() => {
      if (scrollTween?.scrollTrigger.progress <= 0.01) {
        const nudge = {
          duration: 0.4,
        };

        const nudge1 = gsap.timeline();
        nudge1
          .fromTo(
            '.nudge_effect_item:nth-child(1)',
            { x: '120%' },
            {
              x: '-50%',
              duration: nudge.duration,
              ease: 'power2.out',
            }
          )
          .to('.nudge_effect_item:nth-child(1)', {
            x: '120%',
            duration: nudge.duration,
            ease: 'power2.in',
          })
          .to('.nudge_effect_item:nth-child(1)', {
            x: '-50%',
            duration: nudge.duration,
            ease: 'power2.out',
          })
          .to('.nudge_effect_item:nth-child(1)', {
            x: '120%',
            duration: nudge.duration,
            ease: 'power2.in',
          });

        const nudge2 = gsap.timeline({ delay: 0.2 });
        nudge2
          .fromTo(
            '.nudge_effect_item:nth-child(2)',
            { x: '120%' },
            {
              x: '-50%',
              duration: nudge.duration,
              ease: 'power2.out',
            }
          )
          .to('.nudge_effect_item:nth-child(2)', {
            x: '120%',
            duration: nudge.duration,
            ease: 'power2.in',
          })
          .to('.nudge_effect_item:nth-child(2)', {
            x: '-50%',
            duration: nudge.duration,
            ease: 'power2.out',
          })
          .to('.nudge_effect_item:nth-child(2)', {
            x: '120%',
            duration: nudge.duration,
            ease: 'power2.in',
          });
      }
    }, 4000);

    // Animation d'arrivée pour la section hero
    // const heroTween = gsap.timeline();
    // heroTween
    //   //   .to('.hero_heading', {
    //   //     opacity: 1,
    //   //     duration: 0.4,
    //   //     ease: 'power2.out',
    //   //   })
    //   .to('.hero_heading_gif', {
    //     opacity: 1,
    //     duration: 0.4,
    //     ease: 'power2.out',
    //   });

    // Création du ScrollTrigger pour la section "bénéfices"
    ScrollTrigger.create({
      containerAnimation: scrollTween,
      trigger: '.section_benefits',
      start: 'left 50%',
      end: 'right 50%',
      once: true,
      horizontal: true,
      onEnter: initFirstBenefitsAnimation,
    });

    setHorizontalScrollHeight();

    // Permet d'accéder au ancre avec le scroll horizontal
    const getPosition = getScrollLookup('section', {
      start: 'center center',
      containerAnimation: scrollTween,
    });

    const navLinks = gsap.utils.toArray('.nav_menu_link');
    navLinks.forEach((el, index) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        gsap.to(window, {
          scrollTo: getPosition(el.getAttribute('href')),
          overwrite: 'auto',
          duration: 1,
        });
      });

      // Animation du lien actif de la navbar
      ScrollTrigger.create({
        trigger: el.getAttribute('href'),
        start: 'top -10%',
        end: 'bottom bottom',
        containerAnimation: scrollTween,
        horizontal: true,
        onEnter: () => {
          gsap.to('.nav_menu_link_active', {
            duration: 0.3,
            ease: 'power2.out',
            left: $(el).position().left,
            width: $(el).outerWidth(),
          });
        },
        onEnterBack: () => {
          gsap.to('.nav_menu_link_active', {
            duration: 0.3,
            ease: 'power2.out',
            left: $(el).position().left,
            width: $(el).outerWidth(),
          });
        },
        onLeaveBack: () => {
          if (index - 1 >= 0) {
            gsap.to('.nav_menu_link_active', {
              duration: 0.3,
              ease: 'power2.out',
              left: $(navLinks[index - 1]).position().left,
              width: $(navLinks[index - 1]).outerWidth(),
            });
          }
        },
      });
    });
  });

  // Adaptation de la hauteur du scroll horizontal à chaque redimensionnement
  window.addEventListener('resize', () => {
    setHorizontalScrollHeight();
  });
};

/**
 * Fonction récupérer ici : https://gsap.com/docs/v3/HelperFunctions/helpers/getScrollLookup
 * Permet de connaître la position du scroll pour chaque section et y accéder "plus tard"
 */
function getScrollLookup(targets, { start, pinnedContainer, containerAnimation }) {
  const triggers = gsap.utils.toArray(targets).map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: start || 'top top',
        pinnedContainer: pinnedContainer,
        refreshPriority: -10,
        containerAnimation: containerAnimation,
      })
    ),
    st = containerAnimation && containerAnimation.scrollTrigger;
  return (target) => {
    let t = gsap.utils.toArray(target)[0],
      i = triggers.length;
    while (i-- && triggers[i].trigger !== t) {}
    if (i < 0) {
      return console.warn('target not found', target);
    }
    return containerAnimation
      ? st.start + (triggers[i].start / containerAnimation.duration()) * (st.end - st.start)
      : triggers[i].start;
  };
}

// Settings pour l'animation "rubiks"
const rubiks = {
  duration: 0.6,
};

// Première partie de l'animation "rubiks" des bénéfices
function initFirstBenefitsAnimation() {
  const benefitWrapper = Flip.getState('.benefits_item-wrapper');
  $('.benefits_item-wrapper:nth-child(1)').css('grid-area', '1/1/2/2');
  $('.benefits_item-wrapper:nth-child(2)').css('grid-area', '1/2/2/3');
  $('.benefits_item-wrapper:nth-child(6)').css('grid-area', '1/3/2/4');
  $('.benefits_item-wrapper:nth-child(7)').css('grid-area', '2/3/3/4');
  $('.benefits_item-wrapper:nth-child(8)').css('grid-area', '2/4/3/5');
  $('.benefits_item-wrapper:nth-child(9)').css('grid-area', '2/5/3/6');
  $('.benefits_item-wrapper:nth-child(10)').css('grid-area', '3/2/3/3');
  $('.benefits_item-wrapper:nth-child(11)').css('grid-area', '3/3/4/4');
  $('.benefits_item-wrapper:nth-child(12)').css('grid-area', '3/4/4/5');
  $('.benefits_item-wrapper:nth-child(13)').css('grid-area', '3/5/4/6');
  $('.benefits_item-wrapper:nth-child(14)').css('grid-area', '3/6/4/7');

  Flip.from(benefitWrapper, {
    duration: rubiks.duration,
    ease: 'power2.out',
    absolute: true,
    onComplete: initSecondBenefitsAnimation,
  });
}

// Deuxième partie de l'animation "rubiks" des bénéfices
function initSecondBenefitsAnimation() {
  const benefitWrapper = Flip.getState('.benefits_item-wrapper');
  $('.benefits_item-wrapper:nth-child(1)').css('grid-area', '2/1/3/2');
  $('.benefits_item-wrapper:nth-child(4)').css('grid-area', '1/6/2/7');
  $('.benefits_item-wrapper:nth-child(8)').css('grid-area', '2/5/3/6');
  $('.benefits_item-wrapper:nth-child(9)').css('grid-area', '1/5/2/6');
  $('.benefits_item-wrapper:nth-child(12)').css('grid-area', '2/4/3/5');
  $('.benefits_item-wrapper:nth-child(13)').css('grid-area', '3/4/4/5');

  Flip.from(benefitWrapper, {
    duration: rubiks.duration,
    ease: 'power2.out',
    absolute: true,
    onComplete: initThirdBenefitsAnimation,
  });
}

// Troisième partie de l'animation "rubiks" des bénéfices
function initThirdBenefitsAnimation() {
  const benefitWrapper = Flip.getState('.benefits_item-wrapper');
  $('.benefits_item-wrapper:nth-child(1)').css('grid-area', '2/2/3/3');
  $('.benefits_item-wrapper:nth-child(3)').css('grid-area', '2/4/3/5');
  $('.benefits_item-wrapper:nth-child(4)').css('grid-area', '1/5/2/6');
  $('.benefits_item-wrapper:nth-child(5)').css('grid-area', '3/2/4/3');
  $('.benefits_item-wrapper:nth-child(8)').css('grid-area', '2/6/3/7');
  $('.benefits_item-wrapper:nth-child(9)').css('grid-area', '1/4/2/5');
  $('.benefits_item-wrapper:nth-child(10)').css('grid-area', '3/1/4/2');
  $('.benefits_item-wrapper:nth-child(12)').css('grid-area', '2/5/3/6');
  $('.benefits_item-wrapper:nth-child(14)').css('grid-area', '3/5/4/6');

  Flip.from(benefitWrapper, {
    duration: rubiks.duration,
    ease: 'power2.out',
    absolute: true,
  });
}

// Adaptation de la longueur du scroll horizontal
function setHorizontalScrollHeight() {
  $('.sticky_wrapper').each(function () {
    const height = $(this).find('.content_wrapper').outerWidth();
    $(this).height(height);
  });
}
