import pandas as pd
import json
import time
from confluent_kafka import Producer

# Redpanda broker address
BROKER = "localhost:9092"
TOPIC = "trade-data"

# Configure Kafka/Redpanda producer
conf = {
    'bootstrap.servers': BROKER,
    'client.id': 'csv-producer'
}

producer = Producer(conf)

# Load CSV data
df = pd.read_csv("trades_data.csv")

# Iterate through each row and send to Redpanda
for index, row in df.iterrows():
    message = row.to_dict()
    producer.produce(TOPIC, json.dumps(message).encode('utf-8'))
    print(f"✅ Sent: {message}")
    # Optional: small delay to simulate streaming
    time.sleep(0.5)

# Wait for all messages to be delivered
producer.flush()
print("\n🎉 All messages sent successfully!")
