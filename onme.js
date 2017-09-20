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
                    //                                > CSS_PROPERTIES can be passed                    
                    zIndex   : 10,      //                       ------- /
                    padding  : 10,      //                      -
                    backgroundColor : 'rgba(0,0,0,.5)' //-------
                }
            }
        };
        
        // default parametes are merged with given options
        var settings = $.extend(true,defaults,options);
        
        // this assigned to self to use in 
        // anonym functions
        var self = this,
        positions = [],  // an array for positions of the containers
        items = [],      // an array for created nav items
        heights = [],    // an array for height of the containers
        // diffs = [],      // not used
        counter = 0,     // int value to count items , index could not be used , because it is not created nav item for every container
        wInner = window.innerHeight;  // window innerheight
        
        
             

        /**
        * initialize function
        */
        this.init = function(){
            var container = self.containerBox(),
                nav = self.navitemsbox(self);
                items = self.addToContainer(nav);
                // var test = self.addToContainer(nav);
                
            console.log(items);
            $.each(items,function(i,v){
                if(i == items.length-1){
                    return;
                }
                // diffs.push(positions[i+1]-positions[i]); 
            });
            
            
            $(window).scroll(function(){
                let tmp  = self.getOnScreen(window.scrollY);               
                self.activate(tmp.on,tmp.out);                
            });

            self.provideClick();

            $(items).on('click',function(){
                var offsetTop = positions[this.id];
                // console.log(offsetTop);
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
         * returns a containerbox
         * in which the navitemsboxes added
         */
        this.containerBox = function(){
            let container = `<div class="onme-wrapper"></div>`;
            if(!$('body').find('.onme-wrapper').length){
                $(container).prependTo('body').css(settings.wrapper.css);
            }

            return $('.onme-wrapper');
        }

        /**
         * creates and returns a navitemsbox
         * @param {HTMLCollection} elements
         */
        this.navitemsbox = function(elements){
            let selfSelector = $(elements).selector.replace(/[^a-zA-Z0-9]/ig,'');
            let nav = `<ul class="onme nav-items ${selfSelector}">`; // nav string to add to begin of the body
            $.each(elements,function(index){
                if(!$(this).html().length){
                    return;
                }
                
                var offsetTop = $(this).offset().top;
                var label= self.label(settings.label.selector,this);
                
                nav += `<li class="onme nav-item" id="${counter}">${label}</li>`;
                positions.push(offsetTop);
                counter++;
            });                        
            nav += '</ul><span id="log"></span>';
            return {
                str : nav,
                uniq: selfSelector
            };
        }


        this.provideClick = function(){
            $(items).on('click',function(){
                var offsetTop = positions[this.id];
                // console.log(offsetTop);
                self.goTo(offsetTop);
            });
        }

        /**
         * @param {Object} navitemsbox
         *  str : HTML String
         *  uniq: this.selector
         */
        this.addToContainer = function(navitemsbox){
            if(!$('.onme-wrapper').length){
                console.warn('Wrapper does not exist');
                return;
            }
            var selector = `.nav-items.${navitemsbox.uniq} .nav-item`;
            if(!$('.onme-wrapper').find(selector).length){
                $(navitemsbox.str).prependTo('.onme-wrapper');
            }            
            return $(selector);
        }

        /**
         * @param {HTMLCollection} inputs
         */
        this.updateItems = function(inputs){
            [].slice.call(items).concat([].slice.call(inputs));            
        }
        
        /**
         * add class 'ACTIVE' to the on screen elements
         * @param {HTML Element[]} on
         * @param {HTML Element[]} out
         */
        this.activate = function(on,out){
            // console.log(on,out);
            $.each(on,function(){$(this).addClass('active')});
            $.each(out,function(){$(this).removeClass('active')});
        };

        /**
         * Returns a label
         * @param {string} input
         * @param {HTML Element} el
         * @returns {string} label
         */
        this.label = function(input,el){
            if(input.toLowerCase() == 'id'){
                label = el.id;
            }
            else if(/data/i.test(input)){
                var data = input.split(/\-(.+)/);
                label = el.dataset[data[1]];
            }else if(input.replace(/\s/,'') == ''){
                label = el.id;
            }else if(/^self$/.test(input)){
                label = el.innerText;
            }
            else{
                label = $(el).find(input).text();
            }
            return label;
        }
        
        /**
         * filters and returns the items which are currently on screen
         * @param {number} scrollY - number to scroll
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
         * @param {number[]} arr
         */
        this.min = function(arr){
            return arr.sort((a,b)=>a>b)[0];
        };
        
        /**
         * returns the max value of an array
         * @param {number[]} arr
         */
        this.max = function(arr){
            return arr.sort((a,b)=>a<b)[0];
        };
        
        /**
         * scrolls to given px
         * @param {number} topx
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