/**
 * This program is free software. It comes without any warranty, to
 * the extent permitted by applicable law. You can redistribute it
 * and/or modify it under the terms of the Do What The Fuck You Want
 * To Public License, Version 2, as published by Sam Hocevar. See
 * http://sam.zoy.org/wtfpl/COPYING for more details.
 * 
 * The source code is at
 * https://github.com/fabiooshiro/backbone-handlebars-js
 * 
 * author: Fabio Issamu Oshiro (Sr. Oshiro)
 */
(function(){
	
	/**
	 * For Handlebars.registerHelper render results correctly
	 */
	function unwrapFunctions(obj){
		var res = {};
		for(var p in obj){
			if(typeof(obj[p]) == 'function'){
				res[p] = obj[p]();
			}else{
				res[p] = obj[p];
			}
		}
		return res;
	}
	
	/**
	 * Inject handleView method
	 */
	_.extend(Backbone.View.prototype, {
		handleView: function(model){
			var self = this;
			if(!self.compiledTemplate){ // cached
				var source = this.template.html();
				self.compiledTemplate = Handlebars.compile(source);	
			}
			var jsonModel = unwrapFunctions(model.toJSON());
			var jel = $(this.el); 
			jel.html(self.compiledTemplate(jsonModel));
			jel.find('input').each(function(i, el){
				var _jel = $(el);
				var name = _jel.attr('name');
				var val = model.get(name);
				if(val){
					_jel.val(val);
					_jel.change(function(){
						model.set(name, _jel.val());
					});
				}
			});
		}
	});	
})();
