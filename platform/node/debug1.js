module.exports = class extends require('/platform/service'){

	constructor(...args){
		super(...args)
		this.name = 'debug1'
		this.args.test = '1'
	}

	// service log
	user_log(msg){
		console.log("RECEIVED", msg)
	}
}