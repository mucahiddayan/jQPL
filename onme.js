/**
 * @author Mücahid Dayan
 */

(function($){
    $.fn.onme = function(options){
        var defaults = {
            
        };
        var settings = $.extend(defaults,options);
        
        var self = this,
            positions = [],
            items = [],
            heights = [],
            nav = '<ul class="onme nav-items">';
        
        this.init = function(){
            $.each(self,function(index){
                var offsetTop = $(this).offset().top;
                nav += `<li class="onme nav-item" id="${index}">${$(this).text()}</li>`;
                positions.push(offsetTop);
            });

            nav += '</ul>';

            $(nav).prependTo('body').css({
                position : 'fixed',
                right    : 10,
                top      : 100,
                zIndex   : 10,
                padding  : 10,
                backgroundColor : 'rgba(0,0,0,.5)'
            });

            items = $('.onme.nav-item');
            console.log(items);

            $(window).scroll(function(){
                index = positions.findIndex(function(e){
                    return e >= $(this).scrollTop();
                })
                // console.log(index,positions);
                $(items).eq(index).addClass('active');
                $(items).eq(index).siblings('.onme.nav-item').removeClass('active');
                
            });

            $(items).on('click',function(){
                var offsetTop = positions[this.id];
                console.log(offsetTop);
                self.goTo(offsetTop);
            });
        }

        this.goTo = function(topx){
            $('html,body').stop().animate({scrollTop:topx}, 500, 'swing');
        }
        
        
        this.init();
        
        return this;
    }
})(jQuery)