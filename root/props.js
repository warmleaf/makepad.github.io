module.exports = function(){
	var types = require('types')
	// special names for property with name: key
	// this.key  <- getter setter for the key
	// this._key  <- the storage for a key
	// this.onkey  <- the listener chain for a key value change if(this.onkey) this.onkey({...})
	// this._onkey <- the listener flagset for flagged value change monitoring
	
	// define props
	function defineProp(key, value){
		// default
		if(Object.getPrototypeOf(value) !== Object.prototype){
			value = {value:value}
		}
		var initvalue = value.value

		if(!this.hasOwnProperty('_props')){
			this._props = this._props?Object.create(this._props):{}
		}

		var config = this._props[key] = this._props[key]?Object.create(this._props[key]):{}
		for(var cpy in value) config[cpy] = value[cpy]

		// lets define a property
		var _key = '_' + key
		var onkey = 'on' + key
		var _onkey = '_on' + key

		Object.defineProperty(this, key, {
			configurable:true,
			get:function(){
				if(this.onflag) this[_onkey] |= this.onflag
				return this[_key]
			},
			set:function(value){
				var old = this[_key]
				this[_key] = value
				var flags = this[_onkey]
				if(flags){
					var id = 1
					while(flags){
						if(flags&1) this['onflag'+id]({key:key, old:old, value:value})
						id = id<<1, flags = flags>>1
					}
				}
				if(this[onkey]) this[onkey]({setter:true, old:old, value:value})
			}
		})
	}

	Object.defineProperty(this, 'props', {
		set:function(props){
			for(var key in props){
				defineProp.call(this, key, props[key])
			}
		},
		get:function(){
			return this._props
		}
	})
}