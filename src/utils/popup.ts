import gsap from 'gsap';

export const initPopups = () => {
  // Permet d'ouvrir la modal de rdv
  $('.process_cta_bg').on('click', () => openModal('.is-rdv'));
  $('.nav_rdv_button').on('click', () => openModal('.is-rdv'));
  $('.process_cta_content_button').on('click', () => openModal('.is-rdv'));

  // Permet d'ouvrir la modal iframe de prise de rdv
  $('.modal_button.is-iframe').on('click', openSpecialModal);

  // Permet d'ouvrir les modals légales du footer
  $('.footer_legal.is-mentions').on('click', () => openModal('.is-mentions'));
  $('.footer_legal.is-confidential').on('click', () => openModal('.is-confidential'));
  $('.footer_legal.is-cookie').on('click', () => openModal('.is-cookie'));

  // Permet de fermer la modal
  $('.modal_close').on('click', (e) => closeModal(e));
  $('.modal_wrapper').on('click', (e) => closeModal(e));
  $('.modal_close.is-special').on('click', (e) => closeSpecialModal(e));
};

function openSpecialModal() {
  gsap.to(`.modal_content_wrapper.is-rdv`, {
    y: '-150%',
    duration: 0.4,
    ease: 'power2.out',
    onComplete: () => {
      $('.modal_content_wrapper.is-rdv').removeClass('is-active');
      $('.modal_content_wrapper.is-iframe').addClass('is-active');
      $('body').css('overflow', 'hidden');
      $(`.modal_content_wrapper.is-rdv`).css('display', 'none');
      $(`.modal_content_wrapper.is-iframe`).css('display', 'flex');
      gsap.set(`.modal_content_wrapper.is-rdv`, { y: '150%' });

      gsap.to(`.modal_content_wrapper.is-iframe`, {
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
        onComplete: () => {
          $('.modal_wrapper').css('pointer-events', 'auto');
        },
      });
    },
  });
}

function openModal(id) {
  $('.modal_wrapper').addClass('is-active');
  $('body').css('overflow', 'hidden');
  $(`.modal_content_wrapper${id}`).css('display', 'flex');

  gsap.to(`.modal_content_wrapper${id}`, {
    y: 0,
    duration: 0.6,
    ease: 'power2.out',
    onComplete: () => {
      $('.modal_wrapper').css('pointer-events', 'auto');
    },
  });
}

function closeSpecialModal(e) {
  if (
    $(e.target).hasClass('modal_content_wrapper.is-iframe') ||
    $(e.target).hasClass('modal_close') ||
    $(e.target).hasClass('modal_close_svg') ||
    $(e.target).parent('modal_close_svg').length > 0
  ) {
    $('body').css('overflow', 'auto');

    gsap.to('.modal_content_wrapper', {
      y: '150%',
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        $('.modal_wrapper').removeClass('is-active');
        $('.modal_wrapper').css('pointer-events', 'none');
        $('.modal_content_wrapper').css('display', 'none');
      },
    });
    gsap.to('.modal_content_wrapper.is-iframe', {
      y: '150%',
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        $('.modal_content_wrapper.is-iframe').css('display', 'none');
      },
    });
  }
}

function closeModal(e) {
  if (
    $(e.target).hasClass('modal_wrapper') ||
    $(e.target).hasClass('modal_close') ||
    $(e.target).hasClass('modal_close_svg') ||
    $(e.target).parent('modal_close_svg').length > 0
  ) {
    $('body').css('overflow', 'auto');

    gsap.to('.modal_content_wrapper', {
      y: '150%',
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        $('.modal_wrapper').removeClass('is-active');
        $('.modal_wrapper').css('pointer-events', 'none');
        $('.modal_content_wrapper').css('display', 'none');
      },
    });
  }
}
