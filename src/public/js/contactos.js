$(function () {
    $('.collapse').on('show.bs.collapse', function () {
        $('.collapse.show').collapse('hide');
    });
});