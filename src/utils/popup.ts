import gsap from 'gsap';

export const initPopup = () => {
  // Permet d'ouvrir la modal
  $('.process_cta_bg').on('click', openModal);
  $('.nav_rdv_button').on('click', openModal);

  // Permet de fermer la modal
  $('.modal_close').on('click', (e) => closeModal(e));
  $('.modal_wrapper').on('click', (e) => closeModal(e));
};

function openModal() {
  $('.modal_wrapper').addClass('is-active');
  $('body').css('overflow', 'hidden');

  gsap.to('.modal_content_wrapper', {
    y: 0,
    duration: 0.6,
    ease: 'power2.out',
    onComplete: () => {
      $('.modal_wrapper').css('pointer-events', 'auto');
    },
  });
}

function closeModal(e) {
  if (
    $(e.target).hasClass('modal_wrapper') ||
    $(e.target).hasClass('modal_close') ||
    $(e.target).hasClass('modal_close_svg') ||
    $(e.target).parent('modal_close_svg')
  ) {
    $('body').css('overflow', 'auto');

    gsap.to('.modal_content_wrapper', {
      y: '150%',
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        $('.modal_wrapper').removeClass('is-active');
        $('.modal_wrapper').css('pointer-events', 'none');
      },
    });
  }
}
