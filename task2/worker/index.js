const { Kafka } = require('kafkajs');
const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://root:root@mongo-target:27017');

const kafka = new Kafka({
	clientId: 'my-app',
	brokers: ['kafka:9092'],
});

const consumer = kafka.consumer({ groupId: 'test-group' });

let generateId = (n) => {
	let text = '';
	let possible =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (let i = 0; i < n; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
};

let main = async () => {
	await client.connect();
	const db = client.db('test');
	const collection = db.collection('users');

	await consumer.connect();
	await consumer.subscribe({ topic: 'move', fromBeginning: true });

	await consumer.run({
		eachMessage: async ({ topic, partition, message }) => {
			let data = JSON.parse(message.value?.toString());
			let newRecord = {
				_id: data._id.toString(),
				firstname: data.firstname,
				lastname: data.lastname,
				age: BigInt(data.age),
				email: data.email,
				sex: '',
			};

			let documentWithSameId = await collection.findOne(
				{ _id: newRecord._id },
				{ firstname: 1 }
			);
			if (documentWithSameId !== null) {
				let ids = await collection.distinct('_id', {});
				let newId;
				do {
					newId = generateId(10);
				} while (ids.includes(newId));
				newRecord._id = newId;
			}
			const insertRes = await collection.insertOne(newRecord);
			console.log('Inserted document =>', insertRes);
		},
	});
};

main();
