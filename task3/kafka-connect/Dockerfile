FROM confluentinc/cp-kafka-connect

RUN confluent-hub install --no-prompt confluentinc/kafka-connect-avro-converter:5.5.4
RUN confluent-hub install --no-prompt mongodb/kafka-connect-mongodb:1.10.0
RUN confluent-hub install --no-prompt confluentinc/kafka-connect-jdbc:10.1.1