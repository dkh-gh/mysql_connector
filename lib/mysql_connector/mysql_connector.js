
/* 
 * MYSQL Connector
 * v 0.1
 * created Dmitry Kholostov
 * https://github.com/dkh-gh/mysql_connector
 */

class MYSQL_Connector {

	constructor() {
		this.config = {}
		this.stack_list = [];
	}

	configure(_config) {
		for(let _conf in _config) {
			this.config[_conf] = _config[_conf];
		}
	}

	ask(act, data) {
		let stack_id = this.stack('add', {
			'type': act,
			'data': data,
		});
	}

	stack(act, data) {
		if(act == 'add') {
			let new_elem = {
				'timestamp': Date.now(),
				'status': 'query',
				'data': data,
			};
			let _timestamp_changing = true;
			while(_timestamp_changing) {
				_timestamp_changing = false;
				for(var i = 0; i < this.stack_list.length; i++) {
					if(this.stack_list[i]['timestamp']
					== new_elem['timestamp']) {
						new_elem['timestamp']++;
						_timestamp_changing = true;
					}
				}
			}
			this.stack_list.push(new_elem);
			this.query(new_elem);
			return new_elem['timestamp'];
		}
		if(act == 'update_post_attrs') {
			let stack_id = -1;
			for(var i = 0; i < this.stack_list.length; i++) {
				if(this.stack_list[i]['timestamp']
				== data['timestamp']) {
					stack_id = i;
					break;
				}
			}
			this.stack_list[stack_id]['post_attrs'] = 
				data['post_attrs'];
			//-console.log('stack()', act, data['timestamp'], data['post_attrs']);
		}
		if(act == 'catch') {
			let stack_id = -1;
			for(var i = 0; i < this.stack_list.length; i++) {
				if(this.stack_list[i]['timestamp']
				== data['timestamp']) {
					stack_id = i;
					break;
				}
			}
			// console.log('stack()', act, data['timestamp'], data);
			this.stack_list[stack_id]['server_response'] = data;
			this.stack_list[stack_id]['status'] = 'complete';
			if(!data['status'])
				this.stack_list[stack_id]['status'] = 'failed';
			// //-console.log(this.stack_list[stack_id]['skey']);
			if(data['skey'] != undefined) {
				this.config['skey'] = data['skey'];
				delete this.config['user'];
				delete this.config['passw'];
			}
			if(this.config['catcher'] != undefined)
				this.config['catcher'](data)
		}
		if(act == 'delete') {
			let stack_id = NaN;
			for(var i = 0; i < this.stack_list.length; i++) {
				if(this.stack_list[i]['timestamp']
				== data) {
					stack_id = i;
					break;
				}
			}
			this.stack_list.splice(stack_id, 1);
		}
	}

	query(obj) {
		let _this = this;
		let string_data = this.prepare_string_data(obj);
		this.stack('update_post_attrs', {
			'timestamp': obj['timestamp'],
			'post_attrs': string_data,
		});
		let connection = new XMLHttpRequest();
		connection.open('POST', this.config['connector_url']);
		connection.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		connection.onreadystatechange = function() {
			if(connection.readyState == 4 && connection.status == 200)
				_this.stack('catch', JSON.parse(connection.responseText));
			else
				return false;
		}
		connection.send(string_data);
	}

	prepare_string_data(obj) {
		let string_data = `timestamp=` + obj['timestamp'];
		if(this.config['skey'] == undefined) {
			string_data += ``
			+`&user=${this.config['user']}`
			+`&passw=${this.config['passw']}`;
		}
		else string_data += `&skey=${this.config['skey']}`;

		for(let key in obj['data']) {
			if(key != 'data')
				string_data += `&${key}=${obj['data'][key]}`;
			else string_data += `&${key}=${JSON.stringify(obj['data'][key])}`;
		}
		return string_data;
	}

}
