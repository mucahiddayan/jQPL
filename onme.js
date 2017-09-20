/**
* @author Mücahid Dayan
*/

addJQuery();
(function($){
    $.fn.onme = function(options){
        var defaults = {
            text:{
                color:'#333',
                active:{
                    color:'#fff'
                },
                transition:.5
            },
            label:{
                selector:'id'
            },
            box:{
                css:{
                    position : 'fixed',
                    right    : 10,
                    top      : 100,
                    zIndex   : 10,
                    padding  : 10,
                    backgroundColor : 'rgba(0,0,0,.5)'
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
        wInner = window.innerHeight,
        nav = '<div class="onme-wrapper"><ul class="onme nav-items">';
        
        this.init = function(){
            $.each(self,function(index){
                if(!$(this).text().length){
                    return;
                }
                var offsetTop = $(this).offset().top;
                var label='';
                if(settings.label.selector.toLowerCase() == 'id'){
                    label = this.id;
                }
                else if(/data/i.test(settings.label.selector)){
                    var data = settings.label.split(/\-(.+)/);
                    label = this.dataset[data[1]];
                }
                else{
                    label = $(this).find(settings.label.selector).text();
                }
                console.log(settings.label.selector,label);
                nav += `<li class="onme nav-item" id="${counter}">${label}</li>`;
                positions.push(offsetTop);
                counter++;
            });
            
            nav += '</ul><span id="log"></span></div>';
            
            if(!$('body').find('.nav-items').length){
                $(nav).prependTo('body').css(settings.box.css);
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
                /* index = positions.findIndex(function(e,i,a){
                    return e+diffs[i]-1 >= $(this).scrollTop();
                });
                // console.log(index,positions[index],$(this).scrollTop());
                // self.log(index,positions[index],$(this).scrollTop(),'diffs:',diffs,'pos:',positions); */
                
                let tmp  = self.getOnScreen(window.scrollY);               
                self.activate(tmp.on,tmp.out);
                
                /* $(items).eq(index).addClass('active');
                $(items).eq(index).siblings('.onme.nav-item').removeClass('active'); */
                
                
            });
            
            $(items).on('click',function(){
                var offsetTop = positions[this.id];
                console.log(offsetTop);
                self.goTo(offsetTop);
            });
            
            $('body').append(`<style type="text/css">
            .nav-item{transition:color ${settings.text.transition}s;color:${settings.text.color};}
            .nav-item.active {
                color: ${settings.text.active.color};
                transition:color ${settings.text.transition}s;
            }
            </style>`);
        };
        
        this.activate = function(on,out){
            console.log(on,out);
            $.each(on,function(){$(this).addClass('active')});
            $.each(out,function(){$(this).removeClass('active')});
        };
        
        this.getOnScreen = function(scrollY){
            let temp = [].slice.call(items);        
            let onScreen = positions.filter(e=>{
                return  e >= scrollY && e <= scrollY + wInner;
            });
            let first = positions.findIndex(e=> e == self.min(onScreen));
            first = first == -1?items.length-1:first;
            /* console.group('log');
            console.log('onscreen',onScreen);
            console.log('onscreen length',onScreen.length);
            console.log('min of onscreen',self.min(onScreen));
            console.log('first',first);
            // console.log('last',last);
            console.log('removed',temp.splice(first,onScreen.length), Array.isArray(temp.splice(first,onScreen.length)));
            console.log('temp',temp,Array.isArray(temp));
            console.groupEnd('log'); */
            return { 
                on  : temp.splice(first,onScreen.length),
                out : temp
            };        
        };
        
        this.min = function(arr){
            return arr.sort((a,b)=>a>b)[0];
        };
        
        this.max = function(arr){
            return arr.sort((a,b)=>a<b)[0];
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

function addJQuery(){
    if(typeof $ == 'undefined' && typeof jQuery == 'undefined'){
        let head = document.getElementsByTagName('head')[0];
        let jQuery = document.createElement('script');
        jQuery.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js';
        jQuery.type = 'text/javascript';
        try{
            head.appendChild(jQuery);
            return true;
        }catch(e){
            console.log(e);
            return false;
        }
    }else{
        console.info('Good to know that you use jQuery');
        return true;
    }
}