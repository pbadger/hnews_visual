function remove_bar_and_scatter(){
  $('svg.chart').remove()
  $('svg.scatter_plot').remove()
}

$(document).ready(function(){
  $('.submit_cus_key').click(function(){
    var input = $('.custom_keyword').val();
    if(input.length > 0){
      themes.custom['keywords'].push(input) 
      $('.chosen_keywords').append('<span>'+input+'</span>')
      $('.custom_keyword').val('')
    }
  })
  $('.draw_cus_theme').click(function(){
    if(themes.custom.keywords.length > 0){
      themes.custom.articles = filter_articles(total_data,themes.custom.keywords,1);
      remove_bar_and_scatter();
      draw_bar('custom');
      draw_scatter('custom'); 
      $("#custom_theme_modal").modal("hide");
    };
  });

  $('.middle-area button.premade').click(function(el){
    remove_bar_and_scatter();
    var theme = theme_names[$(this).data('topic')];
    draw_bar(theme);
    draw_scatter(theme);
    $('.middle-area button').removeClass('selected')
    $(this).addClass('selected');
  });

  $('.middle-area button.custom').click(function(){
    $("#custom_theme_modal").modal("show");
  })



})
