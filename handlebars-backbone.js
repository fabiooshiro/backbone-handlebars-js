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
			var tp = typeof(obj[p]); 
			if(tp == 'function'){
				res[p] = obj[p]();
			}else if(tp == 'object'){
				var un = obj[p]; 
				if(obj[p] && obj[p]['toJSON']){
					un = obj[p]['toJSON']();
				}
				res[p] = unwrapFunctions(un);
			}else{
				res[p] = obj[p];
			}
		}
		return res;
	}

	var htmlesc = Handlebars.Utils.escapeExpression;
	var widgets = {
		select: function(name, val, opts){
			var source = typeof(opts.source) == 'function' ? opts.source() : opts.source;
			var out = $('<select>').attr('name', name);
			for(var i = 0; i < source.length; i ++){
				var item = source[i];
				out.append($('<option>').attr('value', item.get('id')).text(item.get('name')));
			}
			return $('<div>').append(out).html();
		}
	};
	
	var handleWidget;
	Handlebars.registerHelper('backHand', function(name, v2) {
		var opts = handleWidget[name];
		var obj = this[name];
		if(opts){
			var html = widgets[opts.widget](name, obj, opts);
			var path = name.split('\.');
			var co = obj;
			var lp;
			for(var i = 0; i < path.length; i++){
				lp = path[i];
				if(i < path.length - 1)
					co = co[lp];
			}
			return new Handlebars.SafeString(html);
		}
		return "define " + name;
	});
	
	function bind2way(name, jel, model, handleWidget){
		jel.find('[name="' + name + '"]').each(function(i, el){
			var _jel = $(el);
			var val = model.get(name);
			if(val){
				if(val && typeof(val) == 'object' && val['id']){
					_jel.val(val.id);
				}else{
					_jel.val(val);	
				}
			}
			_jel.change(function(){
				var val = _jel.val();
				if(handleWidget && handleWidget[name]){
					var source = typeof(handleWidget[name].source) == 'function' ? handleWidget[name].source() : handleWidget[name].source;
					for(var i = 0; i < source.length; i++){
						if(source[i].id == val){
							val = source[i];	
							break;
						}
					} 
				}
				//console.log("set " + name + " = " + val);
				model.set(name, val);
			});
		});	
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
			handleWidget = self.handleWidget;
			var jel = $(this.el); 
			jel.html(self.compiledTemplate(jsonModel));
			
			for(name in jsonModel){
				bind2way(name, jel, model, self.handleWidget);
			}
		}
	});	
})();
