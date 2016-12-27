	(function(){
	var methods = {
		'hasClass':function(element,attr){
			var classArr = element.className.split(' ');
			return !!classArr.find(function(value){
				return value == attr;
			})
		},
		'parents' : function(element,attr){
			if(attr.charAt(0) == '.'){
				while(element.nodeType != 9&&!methods.hasClass(element,attr.substr(1))){
					element = element.parentNode;
				}
			}else if(attr.charAt(0) == '#'){
				while(element.nodeType != 9 && element.id != attr.substr(1)){
					element = element.parentNode;
				}
			}else {
				while(element.nodeType != 9 && element.nodeName != attr.toUpperCase()){
					element = element.parentNode;
				}
			}
			return element.nodeType == 9?null:element;
		},
		'removeClass':function(element,attr){
			if(methods.hasClass(element,attr)){
				var classArr = element.className.split(' ')
				classArr = classArr.filter(function(value){
					return value != attr;
				})
				element.className = classArr.join(' ');
			}
		},
		'addClass':function(element,className){
			if( !methods.hasClass(element,className) ){
				element.className += " "+ className;
			}
		},
		'toggleClass':function(element,className){
			if(methods.hasClass(element,className)){
				methods.removeClass(element,className);
				return false;
			}else{
				methods.addClass(element,className);
				return true;
			}
		}
	}
	window.t = methods;
})()
