
/* 
 * MYSQL Connector
 * v 0.1
 * created Dmitry Kholostov
 * https://github.com/dkh-gh/mysql_connector
 */

document.addEventListener('DOMContentLoaded', init);

var conn;
var mouse_sync = {
	'x': 0,
	'y': 0,
	'updated': false,
};
var users_list = false;
var another_user_id = 1;
// var users_list;
function init() {
	conn = new MYSQL_Connector();
	conn.configure({
		'connector_url': 'https://wilocod.ru/prj/mysql_connector/lib/mysql_connector/mysql_connector.php',
		'catcher': catcher,
		// 'user': 'test',
		// 'passw': 'test',
	});

	document.addEventListener('mousemove', function(e) {
		mouse_sync = {
			'x': e.clientX,
			'y': e.clientY,
			'updated': true,
		};
	});
	
	document.querySelector('#save').addEventListener('click', function() {
		conn.configure({
			'user': document.querySelector('#name').value,
			'passw': document.querySelector('#passw').value,
		});
		document.querySelector('#name').style.display = 'none';
		document.querySelector('#passw').style.display = 'none';
		document.querySelector('#save').style.display = 'none';

		conn.ask('get_users_list');
		sender();
	});
}

function sender() {
	if(mouse_sync['updated']) {
		conn.ask('update_user_dataset', {'key':'data1_100','value':mouse_sync['x']});
		conn.ask('update_user_dataset', {'key':'data2_1000','value':mouse_sync['y']});
	}
	window.setTimeout(sender, 250);
}

function catcher(data) {
	// console.log('catcher data:', data);
	document.querySelector('.info').innerHTML = 'catcher data:' + data.timestamp;
	if(data.status == true 
		&& data.inform == "Users list.") {
		users_list = data.data;
		for(let i = 0; i < users_list.length; i++) {
			conn.ask('get_user_dataset_last', users_list[i].id);
			let user = document.createElement('div');
			user.setAttribute('class', 'cursor2');
			user.setAttribute('id', 'user_'+users_list[i].id);
			let user_name = document.createElement('span');
			user_name.innerHTML = users_list[i].name;
			user.appendChild(user_name);
			document.body.appendChild(user);
		}
	}

	if(data['inform'] == 'User dataset last line.' 
		&& users_list) {
		document.querySelector('#user_'+data.data.user_id).style.left = data.data.data1_100 + 'px';
		document.querySelector('#user_'+data.data.user_id).style.top = data.data.data2_1000 + 'px';
		if(data.data.user_id == data.user_id)
			document.querySelector('#user_'+data.data.user_id).style.display = 'none';
		window.setTimeout(function() {
			conn.ask('get_user_dataset_last', data.data.user_id);
		}, 250);
	}
	conn.stack('delete', data['timestamp']);
}

