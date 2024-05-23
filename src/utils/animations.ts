import gsap from 'gsap';
import Flip from 'gsap/Flip';
import ScrollTo from 'gsap/ScrollToPlugin';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, Flip, ScrollTo, SplitText);

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
              x: '-200%',
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
            x: '-200%',
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
              x: '-200%',
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
            x: '-200%',
            duration: nudge.duration,
            ease: 'power2.out',
          })
          .to('.nudge_effect_item:nth-child(2)', {
            x: '120%',
            duration: nudge.duration,
            ease: 'power2.in',
          });
      }
    }, 3000);

    // Animation d'arrivée pour la section hero
    const heroContentText = new SplitText('.hero_content_text', {
      type: 'lines, words',
      linesClass: 'line',
      wordsClass: 'word',
    });
    const heroTween = gsap.timeline();
    heroTween
      .to(['.hero_heading', '.hero_heading_gif'], {
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
      })
      .to(
        heroContentText.words,
        {
          y: '0%',
          duration: 0.6,
          ease: 'power2.out',
        },
        '-=0.3'
      )
      .fromTo(
        '.hero_content_arrow',
        { xPercent: -150 },
        {
          xPercent: 0,
          scale: 1,
          duration: 1.5,
          ease: 'power2.inOut',
        },
        '-=0.8'
      );

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

    // Animation de la section "testimonial_first" avec Lottie
    gsap.set('.testimonial_lottie_house', { scale: 0, yPercent: 70 });
    const testimonialFirstLottieTween = gsap.timeline({
      scrollTrigger: {
        containerAnimation: scrollTween,
        trigger: '.testimonial_lottie_house',
        start: 'left 75%',
        once: true,
        horizontal: true,
      },
    });
    testimonialFirstLottieTween.to('.testimonial_lottie_house', {
      scale: 1,
      yPercent: 0,
      duration: 0.8,
      ease: 'power2.inOut',
    });

    // Animation du reste de la section "testimonial_first"
    const testimonialFirstText = new SplitText('.is-text-first-testimonial', {
      type: 'lines, words',
      linesClass: 'line',
      wordsClass: 'word',
    });
    gsap.set('.testimonial_first_infos p', { xPercent: -100 });
    const testimonialFirstTween = gsap.timeline({
      scrollTrigger: {
        containerAnimation: scrollTween,
        trigger: '.testimonial_first_wrapper',
        start: 'left 60%',
        once: true,
        horizontal: true,
      },
    });
    gsap.to('.testimonial_lottie_bg', {
      opacity: 1,
      duration: 0.4,
    });
    testimonialFirstTween
      .to('.testimonial_first_image', {
        scale: 1,
        duration: 1,
        ease: 'elastic.out(1, 0.7)',
      })
      .to(
        '.testimonial_first_infos p',
        {
          xPercent: 0,
          duration: 0.6,
          ease: 'power2.out',
        },
        '<+=0.1'
      )
      .to(
        testimonialFirstText.words,
        {
          y: '0%',
          duration: 0.6,
          ease: 'power2.out',
        },
        '-=0.2'
      );

    // Animation de la section "services"
    gsap.set('.services_item_bg', { yPercent: -50, xPercent: -50 });
    const serviceItemTween = gsap.timeline({
      scrollTrigger: {
        containerAnimation: scrollTween,
        trigger: '.section_services',
        start: 'left 45%',
        once: true,
        horizontal: true,
      },
    });
    serviceItemTween
      .to('.services_item_bg', {
        scale: 1.35,
        duration: 0.8,
        stagger: 0.15,
        ease: 'elastic.out(1, 0.7)',
      })
      .to(
        '.services_item_text',
        {
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out',
        },
        '-=0.5'
      );

    // Animation de la section "process"
    const processTween = gsap.timeline({
      scrollTrigger: {
        containerAnimation: scrollTween,
        trigger: '.process_content',
        start: 'left 50%',
        horizontal: true,
        once: true,
      },
    });
    gsap.utils.toArray('.process_item_wrapper').forEach((el) => {
      const split = new SplitText($(el).find('.process_item_title'), {
        type: 'lines, words',
        linesClass: 'line',
        wordsClass: 'word',
      });

      processTween
        .to(el, {
          scale: 1,
          duration: 0.4,
          ease: 'power2.out',
        })
        .to(
          split.words,
          {
            y: 0,
            duration: 0.4,
            ease: 'power2.out',
          },
          '-=0.05'
        )
        .to(
          $(el).find('.process_item'),
          {
            opacity: 1,
            duration: 0.4,
            stagger: 0.2,
            ease: 'power2.out',
          },
          '<'
        )
        .to(
          $(el).find('.process_item_number'),
          {
            opacity: 1,
            duration: 0.3,
            ease: 'power2.out',
          },
          '<'
        )
        .to(
          $(el).find('.process_decoration_image'),
          {
            opacity: 1,
            duration: 0.3,
            stagger: 0.2,
            ease: 'power2.out',
          },
          '<'
        );
    });

    // Animation de la section "team"
    gsap.set('.services_item_bg', { yPercent: -50 });
    const teamTitle = new SplitText('.team_title', {
      type: 'lines, words',
      linesClass: 'line',
      wordsClass: 'word',
    });
    const teamTween = gsap.timeline({
      scrollTrigger: {
        containerAnimation: scrollTween,
        trigger: '.section_team',
        start: 'left 30%',
        once: true,
        horizontal: true,
      },
    });
    teamTween
      .to(teamTitle.words, {
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
      })
      .to('.team_arrow', {
        scale: 1,
        opacity: 1,
        yPercent: 0,
        duration: 0.8,
        ease: 'power2.out',
      })
      .to(
        '.team_item_photo',
        {
          scale: 1,
          duration: 0.6,
          stagger: 0.2,
          ease: 'elastic.out(1, 0.7)',
        },
        '<+=0.2'
      )
      .to(
        '.team_item_name',
        {
          opacity: 1,
          duration: 0.4,
          stagger: 0.2,
          ease: 'power2.out',
        },
        '<+=0.2'
      );

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

    // Adaptation de la hauteur du scroll horizontal à chaque redimensionnement
    window.addEventListener('resize', () => {
      setHorizontalScrollHeight();
    });
  });

  mm.add('screen and (max-width: 991px)', () => {
    // Animation mobile ici
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
