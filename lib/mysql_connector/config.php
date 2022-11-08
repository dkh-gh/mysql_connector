<?php
	
	/* 
	 * MYSQL Connector
	 * v 0.1
	 * created Dmitry Kholostov
	 * https://github.com/dkh-gh/mysql_connector
	 */

	$conf = [
		"database" => [
			"host" => "XXXXX",
			"base" => "XXXXX",
			"user" => "XXXXX",
			"pass" => "XXXXX",
		],
		"data" => [
			"columns" => [
				"data1" => "VARCHAR(100)",
				"data2" => "VARCHAR(100)",
			],
		],
		"sql" => [
			"get_user" => "SELECT * FROM users WHERE name = '{{name}}'",
			"get_users" => "SELECT * FROM users",
			"get_user_by_skey" => "SELECT * FROM users WHERE skey = '{{skey}}'",
			"update_skey" => "UPDATE users SET skey = '{{skey}}' WHERE name = '{{name}}'",
		],
		"ansvers" => [
			"test_ok" => '{"status": true, "timestamp": "{{timestamp}}", "inform": "Test ansver: ok."}',
			"mysql_connect_error" => '{"status": false, "timestamp": "{{timestamp}}", "inform": "Failed to connect to MySQL."}',
			"user_auth_error" => '{"status": false, "timestamp": "{{timestamp}}", "inform": "Failed to authorise user."}',
			"no_user_data" => '{"status": false, "timestamp": "{{timestamp}}", "inform": "Failed to accept user data for auth."}',
			"ask_type_not_set" => '{"status": false, "timestamp": "{{timestamp}}", "skey": "{{skey}}", "inform": "Ask type is not set."}',
			"ask_type_not_found" => '{"status": false, "timestamp": "{{timestamp}}", "skey": "{{skey}}", "inform": "Ask type is not found."}',
			"get_users_list" => '{"status": true, "timestamp": "{{timestamp}}", "user_id": "{{user_id}}", "skey": "{{skey}}", "data": {{data}}, "inform": "Users list."}',
			"get_user_data" => '{"status": true, "timestamp": "{{timestamp}}", "user_id": "{{user_id}}", "skey": "{{skey}}", "data": {{data}}, "inform": "User data."}',
			"get_user_dataset" => '{"status": true, "timestamp": "{{timestamp}}", "user_id": "{{user_id}}", "skey": "{{skey}}", "data": {{data}}, "inform": "User dataset."}',
			"get_user_dataset_last" => '{"status": true, "timestamp": "{{timestamp}}", "user_id": "{{user_id}}", "skey": "{{skey}}", "data": {{data}}, "inform": "User dataset last line."}',
			"update_user_dataset" => '{"status": true, "timestamp": "{{timestamp}}", "user_id": "{{user_id}}", "skey": "{{skey}}", "inform": "User dataset updated."}',
		],
	];

	// config for lib db_php
	$dbBaseName = $conf['database']['base'];
	$dbUserName = $conf['database']['user'];
	$dbPassword = $conf['database']['pass'];
	$dbHostName = $conf['database']['host'];
?>