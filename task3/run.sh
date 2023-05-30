docker compose down
docker compose up --build -d

#  CREATE TABLE queue (
#     timestamp UInt64,
#     level String,
#     message String
#   ) ENGINE = Kafka('kafka:9092', 'metrics', 'group1', 'JSONEachRow');

#   CREATE TABLE metrics (
#     day Date,
#     level String,
#     total UInt64
#   ) ENGINE = SummingMergeTree(day, (day, level), 8192);

#   CREATE MATERIALIZED VIEW consumer TO metrics
#     AS SELECT toDate(toDateTime(timestamp)) AS day, level, count() as total
#     FROM queue GROUP BY day, level;

#    SELECT level, sum(total) FROM metrics GROUP BY level;

docker exec -it clickhouse-server clickhouse-client --query="CREATE TABLE metrics (   id String,    area Nullable(String),	   event_time DateTime64(6),    details_json String)  ENGINE  = MergeTree() PARTITION BY toYYYYMM(event_time) ORDER BY (id, event_time) SETTINGS index_granularity=8192;"
docker exec -it clickhouse-server clickhouse-client --query="CREATE TABLE mylogger_kafka ( payload String ) ENGINE = Kafka('kafka:9092', 'metrics', 'group', 'JSONAsString');"

docker exec -it clickhouse-server clickhouse-client --query="CREATE MATERIALIZED VIEW mylogger_kafka_consumer TO metrics AS SELECT JSONExtractString(payload, 'payload', 'after', 'id')
                               as id, JSONExtractString(payload, 'payload', 'after', 'area')
                               as area, toDateTime64(JSONExtractString(payload, 'payload', 'after', 'event_time'), 3, 'Asia/Jerusalem')
                               as event_time, JSONExtractString(payload, 'payload', 'after', 'details_json')
                              as details_json FROM mylogger_kafka;"

docker exec -it kafka kafka-topics --bootstrap-server localhost:9092 --create --if-not-exists --partitions 1 --replication-factor 1 --topic metrics
docker exec -it kafka sh -c "kafka-console-producer --broker-list localhost:9092 --topic metrics < topic_input"
