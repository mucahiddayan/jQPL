/**
* @author Mücahid Dayan
* @version 1.0.2
*/

var objectCounter__ = 0;

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
            sub:{                   // sub nav items_
                selector:'',                
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
        $elf = $(this),
        positions_ = [],  // an array for positions__ of the containers
        items_ = [],      // an array for created nav items_
        subItems_ = [],
        navItems_ = [],
        heights_ = [],    // an array for height of the containers
        // diffs = [],      // not used
        navs_ = [],
        counter_ = 0,
        $wrapper_ = null,     // int value to count items , index could not be used , because it is not created nav item for every container
        wInner_ = window.innerHeight;  // window innerheight
        
        
        //create UniqID - src : https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript#answer-105074
        var guid = function () {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
        }
        
        var uniqID = guid();
        
        var init = function(){
            objectCounter__ ++; // instance number
            $wrapper_ = createWrapper();  // nav-wrapper created - private function
            console.log($wrapper_);
            self.createNav($elf,settings.label.selector);            
            if(settings.sub.selector.replace(/\s/ig,'') !== '' && $(settings.sub.selector).length){
                self.createNav($(settings.sub.selector),settings.label.selector);
            }
            
            addMainCss();
        }
        
        /**
        * cretes a wrapper with uniqID and $(this).selector
        * and returns it back
        * @returns {jQuery Object}
        */
        var createWrapper = function(){
            let selector = `onme-wrapper${selectorToStr($elf.selector)}`,
            $elector = strToSelector(selector,'.');
            console.log(selector,$elector,$elf.selector);
            let container = `<div class="${selector}" data-uniqID = "${uniqID}"></div>`;
            if(!$('body').find($elector).length){
                $(container).prependTo('body').css(settings.wrapper.css);
            }else{
                console.warn('Wrapper exists already');
            }
            console.log($elector);
            return $($elector).length ? $($elector):false;
        }
        
        /**
        * 
        * @param {jQuery Object} navItems 
        */
        var addToWrapper = function(){
            if($wrapper_){
                $.each(navs_,function(ind,el){
                    console.log(el.selector);
                    if($wrapper_.find(el.selector).length){
                        el.remove();
                        console.log('removed');
                    }
                    $wrapper_.append(el);
                    console.log('added');
                });
            }else{
                console.warn('Wrapper is not initialized yet');
            }
            provideClick();     
        }
        
        /**
        * removes every non-alphanumeric character from given str
        * so it can be used in HTML Attributes
        * @param {string} str 
        */
        var selectorToStr = function(str){
            return str.replace(/[#|.]/ig,' ');
        }
        
        /**
        * returns a CSS Selector from given string
        * @param {string} str - string to replace
        * @param {string} prefix - ex: for id #, for class . 
        */
        var strToSelector = function(str,prefix){
            return (selectorToStr(prefix+str)).replace(/[\s\d]\b/ig,prefix);
        }
        
        /**
        * create nav from given elements
        * @param {jQuery Object} $elements
        */
        this.createNav = function($elements,labelSelector){
            updateItems($elements);
            navs_.push(createNavItems($elements.selector,labelSelector));
            addToWrapper();                  
        }
        
        /** public functions to test*/
        this.getWrapper = function(){
            return $wrapper_;
        }
        
        this.getItems = function(){
            return items_;
        }
        
        this.getPositions = function(){
            return positions_;
        }
        
        this.getNavs = function(){
            return navs_;
        }
        
        
        /**
        * add new items to items array
        * @param {jQuery Object} $newItems 
        */
        var updateItems = function($newItems){
            if(
                typeof elements !== 'undefined' &&
                !elements.length &&
                elements == null
            ){console.warn('There is no elements to add to nav');return;}
            $.each($newItems,function(ind,el){
                if(items_.indexOf(el) == -1){
                    items_.push(el);
                }
            });
        }

        var addMainCss = function(){
            $('body').append(`<style type="text/css">
            .nav-items{transition:color ${settings.label.transition}s;color:${settings.label.color};}
            .nav-items.active {
                color: ${settings.label.active.color};
                transition:color ${settings.label.transition}s;
            }
            </style>`);
        }
        
        /**
        * 
        * @param {string} labelSelector 
        * @returns {string} html string
        */    
        var createNavItems = function(elementsSelector,labelSelector){
            let str = `<ul class="nav-item-box" id="${selectorToStr(elementsSelector)}">`;
            $.each(items_,function(ind,el){
                if(!$(el).html().length){return;} // ifthe item element has no content
                let label = getLabel(labelSelector,el);
                let position = $(el).offset().top;
                let distanceToNext = items_.length-1 > ind?$(items_[ind+1]).offset().top - position:0;
                
                str += `<li class="onme nav-items" data-position="${position}" data-distance="${distanceToNext}">${label}</li>`;
                positions_.push(position);
            });
            str += '</ul>';            
            return str;
        }
        
        
        /**
        * sets click listener to items
        */
        var provideClick = function(){
            navItems_ = $('.onme.nav-items');
            navItems_.on('click',function(){
                var offsetTop = $(this).data('position');
                var distanceToNext = $(this).data('distance');
                // console.log(offsetTop);
                goTo(offsetTop);
            });
            
            $(window).scroll(function(){
                let top = $(window).scrollTop();
                var onscreen = [].filter.call(navItems_,el=>{
                    return el.dataset.position >= top  && top + wInner_ >= el.dataset.position + el.dataset.distance 
                    // return el.dataset.position >= top && top <= el.dataset.position + el.dataset.distance
                });
                navItems_.removeClass('active');
                $.each(onscreen,function(ind,el){
                    $(el).addClass('active');
                });
            });
        }
        
        /**
        * scrolls to given px
        * @param {number} topx
        */
        var goTo = function(topx){
            $('html,body').stop().animate({scrollTop:topx}, 500, 'swing');
        };
        
        /**
        * Returns a label
        * @param {string} input
        * @param {HTML Element} el
        * @returns {string} label
        */
        var getLabel = function(input,el){
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
        
        init();
        
        return this;
        
    }
})(jQuery)