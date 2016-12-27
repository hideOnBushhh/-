var fn = {
	'getSelfById': function(data, id) {
		return data.find(function(value) {
			return value.id == id;
		})
	},
	'getChildsById': function(data, id) {
		return data.filter(function(value) {
			return value.pid == id;
		})
	},
	'getParentById': function(data, id) {
		var arr = [];
		var obj = fn.getSelfById(data, id);
		if(obj) {
			arr.push(obj);
			arr = arr.concat(fn.getParentById(data, obj.pid))
		}
		return arr;
	},
	'getAllChildsById': function(data, id) {
		var arr = [];
		var self = fn.getSelfById(data, id);
		arr.push(self);
		var childs = fn.getChildsById(data, self.id);
		childs.forEach(function(value) {
			arr = arr.concat(fn.getAllChildsById(data, value.id));
		})
//		console.log(arr)
		return arr;
	},
	'getAllChildsByIdArr': function(data, idArr) {
		var arr = [];
		idArr.forEach(function(value) {
			arr = arr.concat(fn.getAllChildsById(data,value));
		})
		return arr;
	},
	'addData': function(data, obj) {
		data.unshift(obj);
	},

	'removeData': function(data, idArr) {
		var arr = fn.getAllChildsByIdArr(data, idArr);
		for(var i = 0; i < arr.length; i++) {
			data = data.filter(function(value) {
				return value.id != arr[i].id;
			})
		}
		return data;
	},
	'changeData': function(data, id, index, value) {
		data.forEach(function(item) {
			if(item.id == id) {
				item[index] = value;
			}
		})
	},
	'findExisted': function(data, id, index, value) {
		var childs = fn.getChildsById(data, id);
		return(childs.findIndex(function(item) {
			return item[index] == value;
		}) + 1)
	}
}