/**
 * @author Mücahid Dayan
 * creates and manages MessageBoxes
 */
var MessageBox = (function(){
    var that__ = this;
    var instance__;	
    var branches__ = 0;
    var defaults__ = {
        wait : 5000,
        msg : '',
        pos: {
            top : 10,
            right: 20,
        },
        opacity: .5
    };

    var boxes__ = {		
        error:0,
        warn:0,
        success:0,
        info:0,
    };

    var settings__,top__;

    var construct = function(settings){
        if (typeof jQuery == 'undefined' && typeof $ == 'undefined') {
            console.warn('jquery undefined! Please add jquery lib to your header.');
            return;
        }
        if (typeof $ == 'undefined' && typeof jQuery == 'function') {
            $ = jQuery;
        }
        settings__ = $.extend({},defaults__,settings);		

        if (!instance__) {
            instance__ = that__;
           // var pos = $.extend({},defaults__.pos.split(' '),settings__.pos.split(' ')),
           if (typeof settings__.pos != 'object') {
               var pos = settings__.pos.split(' '),
               hor = pos[1],
               ver = pos[0],			
               style = {};
               style[hor] = 10;
               style[ver] = 10;
           }else{
               style = settings__.pos;
               var keys = Object.keys(settings__.pos);
               top__ = keys[0] == 'top' || (keys.indexOf('top') == -1 && keys.indexOf('bottom') == -1) ? true:false;
               console.log(keys[0],top__);
           }
           $.extend(style,{'position':'fixed','pointer-events':'none','z-index':99999999});
           $('<div id="message-boxes-wrapper"></div>').prependTo('body').css(style);
           
           // this.info('MessageBox instance created!');
       }else{
           branches__++;	
       }
       return instance__;
   };

   

   var box = function(cl,msg,pos,id,color){
       return '<div id="'+id+'" class="message-box '+cl+'" style="background-color:'+color+';width:100%;padding:5px;margin:3px;">'+msg+'</div>';
   }

   this.getBranches = function(){
       return branches__;
   };

   this.getBoxes = function(total){
       if(total){
           var tot = 0;
           for (var i = boxes__.length - 1; i >= 0; i--) {
               tot += boxes__[i];
           }
           return tot;
       }else{
           return boxes__;	
       }		
   }

   that__.error = function(msg){
   if(msg == '' || typeof msg == 'undefined'){return;}		
       var id = boxes__.error++,timestamp = ~~(Date.now()/100),bx = box('error '+timestamp,msg,settings__.pos,id,'rgba(255,0,0,'+settings__.opacity+')');
       if (top__) {
           $('#message-boxes-wrapper').prepend(bx);
       }else{
           $('#message-boxes-wrapper').append(bx);
       }
       setTimeout(function() {
           $('.error#'+id).remove();
           $('.'+timestamp).remove();
           boxes__.error--;
       }, settings__.wait);
       return that__;
   };

   that__.warn = function(msg){
       if(msg == '' || typeof msg == 'undefined'){return;}
       var id = boxes__.warn++,timestamp = ~~(Date.now()/100),bx = box('warn '+timestamp,msg,settings__.pos,id,'rgba(255,140,0,'+settings__.opacity+')');
       if (top__) {
           $('#message-boxes-wrapper').prepend(bx);
       }else{
           $('#message-boxes-wrapper').append(bx);
       }
       setTimeout(function() {
           $('.warn#'+id).remove();
           $('.'+timestamp).remove();
           boxes__.warn--;
       }, settings__.wait);
       return that__;
   }

   that__.success = function(msg){
       if(msg == '' || typeof msg == 'undefined'){return;}
       var id = boxes__.success++,timestamp = ~~(Date.now()/100),bx = box('success '+timestamp,msg,settings__.pos,id,'rgba(65,230,85,'+settings__.opacity+')');
       if (top__) {
           $('#message-boxes-wrapper').prepend(bx);
       }else{
           $('#message-boxes-wrapper').append(bx);
       }
       setTimeout(function() {
           $('.success#'+id).remove();
           $('.'+timestamp).remove();
           boxes__.success--;
       }, settings__.wait);
       return that__;
   };

   that__.info = function(msg){
       if(msg == '' || typeof msg == 'undefined'){return;}
       var id = boxes__.info++,timestamp = ~~(Date.now()/100),bx = box('info '+timestamp,msg,settings__.pos,id,'rgba(30,95,240,'+settings__.opacity+')');
       if (top__) {
           $('#message-boxes-wrapper').prepend(bx);
       }else{
           $('#message-boxes-wrapper').append(bx);
       }
       setTimeout(function() {
           $('.info#'+id).remove();
           $('.'+timestamp).remove();
           boxes__.info--;
       }, settings__.wait);
       return that__;
   }
   that__.custom = function(msg,color){
       var color = $.extend(true,{},[30,95,40,settings__.opacity],color);		
       var id = boxes__.info++,timestamp = ~~(Date.now()/100),bx = box('info '+timestamp,msg,settings__.pos,id,'rgba('+color[0]+','+color[1]+','+color[2]+','+color[3]+')');
       if (top__) {
           $('#message-boxes-wrapper').prepend(bx);
       }else{
           $('#message-boxes-wrapper').append(bx);
       }
       setTimeout(function() {
           $('.info#'+id).remove();
           $('.'+timestamp).remove();
           boxes__.info--;
       }, settings__.wait);
       return that__;
   }

   //returns
   return {
       getInstance : function(settings){			
           return construct(settings);
       },
   }
})();