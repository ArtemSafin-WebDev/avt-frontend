$(document).ready(function () {
  // $('.w-dropdown-toggle input').focus(function () {
  //   $('.w-dropdown-toggle.w--open').removeClass('w--open');
  //   $('.w-dropdown-list.w--open').removeClass('w--open');
  // });
  $('.close_drop-list').click(function() {
    $('.w-dropdown-list.w--open').removeClass('w--open');
    $('.dropdown-toggle.w--open').removeClass('w--open');
  });
  $('a').on('click', () => {
    setTimeout(() => {
      $('nav').removeClass('w--open');
    }, 300);
  });
  $('.open-lead-modal').on('click', () => {
    $('.modal-lead-red').fadeTo( 'fast' , 1);
  });
  $('.modal-close').on('click', () => {
    $('.modal-lead-red').fadeOut( 'fast' );
  });
  $('.modal-flex').on('click', (e) => {
    if ($(e.target).is('.modal-flex')) {
      $('.modal-lead').fadeOut( 'fast' );
    }
  });
});
