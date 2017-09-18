/**
* @author Mücahid Dayan
*/

(function($){
    $.fn.onme = function(options){
        var defaults = {
            text:{
                color:'#333',
                active:{
                    color:'#fff'
                }
            }

        };
        var settings = $.extend(defaults,options);
        
        var self = this,
        positions = [],
        items = [],
        heights = [],
        diffs = [],
        counter = 0,
        nav = '<div class="onme-wrapper"><ul class="onme nav-items">';
        
        this.init = function(){
            $.each(self,function(index){
                if(!$(this).text().length){
                    return;
                }
                var offsetTop = $(this).offset().top;
                nav += `<li class="onme nav-item" id="${counter}">${$(this).text()}</li>`;
                positions.push(offsetTop);
                counter++;
            });
            
            nav += '</ul><span id="log"></span></div>';
            
            if(!$('body').find('.nav-items').length){
                $(nav).prependTo('body').css({
                    position : 'fixed',
                    right    : 10,
                    top      : 100,
                    zIndex   : 10,
                    padding  : 10,
                    backgroundColor : 'rgba(0,0,0,.5)'
                });
            }
            
            items = $('.onme.nav-item');
            
            $.each(items,function(i,v){
                if(i == items.length-1){
                    return;
                }
                diffs.push(positions[i+1]-positions[i]);
            });
            console.log(items);
            
            $(window).scroll(function(){
                index = positions.findIndex(function(e,i,a){
                    return e+diffs[i]-1 >= $(this).scrollTop();
                });
                // console.log(index,positions[index],$(this).scrollTop());
                // self.log(index,positions[index],$(this).scrollTop(),'diffs:',diffs,'pos:',positions);
                
                $(items).eq(index).addClass('active');
                $(items).eq(index).siblings('.onme.nav-item').removeClass('active');
                
                
            });
            
            $(items).on('click',function(){
                var offsetTop = positions[this.id];
                console.log(offsetTop);
                self.goTo(offsetTop);
            });
            
            $('body').append(`<style type="text/css">
            .nav-item{transition:color .5s;color:${text.color};}
            .nav-item.active {
                color: ${text.active.color};
                transition:color .5s;
            }
            </style>`);
        };
        
        this.goTo = function(topx){
            $('html,body').stop().animate({scrollTop:topx}, 500, 'swing');
        };
        
        this.log = function(...opt){
            var str = '';
            for(let i of opt){
                str += typeof i !== 'undefined'?' '+i.toString():'';
            }
            $('#log').text(str);
        };
        
        this.init();
        
        return this;
    }
})(jQuery)