/**
 * @author Mücahid Dayan
 * jQuery plugin - Creates a Navbar on the given position
 * and highlights current elements on scroll.
 * 
 * usage : $('CSS_SELECTOR').onme(options?);
 */

addJQuery();
(function($){
    $.fn.onme = function(options){
        var defaults = {
            container : 'article',  // CSS_SELECTORs can be passed
            label:{
                selector:'id',      // CSS_SELECTORs can be passed
                color:'#333',
                active:{
                    color:'#fff'
                },
                transition:.5
            },       
            
            wrapper:{
                css:{
                    position : 'fixed', // ---------------------
                    right    : 10,      //                      -
                    top      : 100,     //                       ------- \ 
                                        //                                > CSS_SELECTORs can be passed                    
                    zIndex   : 10,      //                       ------- /
                    padding  : 10,      //                      -
                    backgroundColor : 'rgba(0,0,0,.5)' //-------
                }
            }
        };
        
        // default parametes are merged with given options
        var settings = $.extend(defaults,options);
        
        // this assigned to self to use in 
        // anonym functions
        var self = this,
        positions = [],  // an array for positions of the containers
        items = [],      // an array for created nav items
        heights = [],    // an array for height of the containers
        diffs = [],      // not used
        counter = 0,     // int value to count items , index could not be used , because it is not created nav item for every container
        wInner = window.innerHeight,  // window innerheight
        nav = '<div class="onme-wrapper"><ul class="onme nav-items">'; // nav string to add to begin of the body
        
        /**
         * initialize function
         */
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
                }else if(settings.label.selector.replace(/\s/,'') == ''){
                    label = this.id;
                }else if(/^self$/.test(settings.label.selector)){
                    label = this.innerText;
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
                $(nav).prependTo('body').css(settings.wrapper.css);
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
                let tmp  = self.getOnScreen(window.scrollY);               
                self.activate(tmp.on,tmp.out);                
            });
            
            $(items).on('click',function(){
                var offsetTop = positions[this.id];
                console.log(offsetTop);
                self.goTo(offsetTop);
            });
            
            $('body').append(`<style type="text/css">
            .nav-item{transition:color ${settings.label.transition}s;color:${settings.label.color};}
            .nav-item.active {
                color: ${settings.label.active.color};
                transition:color ${settings.label.transition}s;
            }
            </style>`);
        };
        
        /**
         * add class 'ACTIVE' to the on screen elements
         */
        this.activate = function(on,out){
            console.log(on,out);
            $.each(on,function(){$(this).addClass('active')});
            $.each(out,function(){$(this).removeClass('active')});
        };
        
        /**
         * filters and returns the items which are currently on screen
         */
        this.getOnScreen = function(scrollY){
            let temp = [].slice.call(items);        
            let onScreen = positions.filter(e=>{
                return  e >= scrollY && e <= scrollY + wInner;
            });
            let first = positions.findIndex(e=> e == self.min(onScreen));
            first = first == -1?items.length-1:first;            
            return { 
                on  : temp.splice(first,onScreen.length),
                out : temp
            };        
        };
        
        /**
         * returns the min value of an array
         */
        this.min = function(arr){
            return arr.sort((a,b)=>a>b)[0];
        };
        
        /**
         * returns the max value of an array
         */
        this.max = function(arr){
            return arr.sort((a,b)=>a<b)[0];
        };
        
        /**
         * scrolls to given px
         */
        this.goTo = function(topx){
            $('html,body').stop().animate({scrollTop:topx}, 500, 'swing');
        };
        
        /**
         * debugging function
         */
        this.log = function(...opt){
            var str = '';
            for(let i of opt){
                str += typeof i !== 'undefined'?' '+i.toString():'';
            }
            $('#log').text(str);
        };
        
        /**
         * initialize the code
         */
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