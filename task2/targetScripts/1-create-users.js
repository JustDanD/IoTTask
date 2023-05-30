let userName = process.env.MONGO_INITDB_DATABASE;
let password = process.env.MONGO_INITDB_DATABASE;
let database = process.env.MONGO_INITDB_DATABASE;

console.log('Creating users and collections');
db.createUser({
	user: userName,
	pwd: password,
	roles: [
		{
			role: 'readWrite',
			db: database,
		},
		{
			role: 'dbOwner',
			db: database,
		},
	],
});
db.getSiblingDB(database).createCollection('users', {
	validator: {
		$jsonSchema: {
			bsonType: 'object',
			required: ['firstname', 'lastname', 'age', 'email'],
			properties: {
				_id: {
					bsonType: 'string',
					description: 'must be a string and is required',
				},
				firstname: {
					bsonType: 'string',
					description: 'must be a string and is required',
				},
				lastname: {
					bsonType: 'string',
					description: 'must be an string and is required',
				},
				age: {
					bsonType: 'long',
					description: 'must be an number and is required',
				},
				email: {
					bsonType: 'string',
					description: 'must be an string and is required',
				},
				sex: {
					bsonType: 'string',
					description: 'must be an string and is required',
				},
			},
		},
	},
});
