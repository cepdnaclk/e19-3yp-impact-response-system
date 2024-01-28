import threading
import paho.mqtt.client as mqtt
from datetime import datetime
import time
import json
import re

# MQTT broker settings
broker_address = "127.0.0.1"
broker_port = 1883

# MQTT topics
impact_topic = "buddy/+/impact"
mapping_topic = "player_map"
session_topic = "session"
buddy_status_topic = "buddy/+/status"
# session_end_topic = "session_end"
# session_data = "session_data"
is_concussion_topic = "player/+/concussion"

# Player to device mapping (device_id:player_id)
player_device_mapping = {}

# Buddy Time (device_id: timestamp)
buddy_active_time_map: dict[int, float] = {}


# Session variables
broker_connected = False
session_started = False
start_time = None
data_buffer = {}
# data_buffer = {playerId: [{Impact}, {Impact}, ...]}
time_offset = 0


def on_connect(client, userdata, flags, rc):
    try:
        if rc == 0:
            broker_connected = True
            print("Connected to MQTT broker")
            client.subscribe("#")
        else:
            raise Exception(f"Connection failed with result code {rc}")
    except Exception as e:
        print(f"Error in on_connect: {str(e)}")


def on_message(client, userdata, msg):
    global session_started, start_time, data_buffer, player_device_mapping, time_offset

    try:
        # data from dashboards - JSON objects
        data = json.loads(msg.payload.decode())

    # data from impact buddies - ESP32 - text strings
    except json.JSONDecodeError:
        data = msg.payload.decode().split(" ")

    if msg.topic == mapping_topic:
        try:
            # Update player to device mapping
            player_device_mapping = data
            print("Player to device mapping updated:", player_device_mapping)
        except Exception as e:
            print(f"Error in handling mapping_topic: {str(e)}")

    elif msg.topic == session_topic:
        try:
            if data["active"] is False:
                if session_started:
                    end_session()
            else:
                session_started = True
                start_time = int(time.time() * 1000)
                time_offset = data["updatedAt"] - start_time
                print("time offset:", time_offset)
                print("Session updated!")
        except Exception as e:
            print(f"Error in handling session_topic: {str(e)}")

    elif bool(re.search(r"buddy/\d+/impact$", msg.topic)):
        try:
            if session_started:
                # Add timestamp to the received data and publish to the dashboards
                device_id = msg.topic.split("/")[1]
                if device_id in player_device_mapping:
                    player_id = player_device_mapping[device_id]
                    timestamp = int(time.time() * 1000) + time_offset
                    impact_json = data[0] + ' ' + \
                        data[1] + ' ' + str(timestamp)

                    impact_of_player_with_time = "player/" + \
                        str(player_id) + "/impact_with_timestamp"
                    client.publish(impact_of_player_with_time,
                                   impact_json, retain=True)
                    # impact_with_time = "buddy/" + device_id + "/impact_with_timestamp"
                    # client.publish(impact_with_time, impact_json, retain=True)
                    print(impact_json)

                    # Store the data in the buffer
                    if player_id not in data_buffer.keys():
                        print("player_id", player_id, "not in buffer")
                        data_buffer[player_id] = []
                    impact = {"magnitude": int(
                        data[0]), "direction": data[1], "timestamp": timestamp, "isConcussion": False}
                    print(f"Impact object created: {impact}")
                    data_buffer[player_id].append(impact)

                    print("Impact data stored in buffer:", data_buffer)
                    # Send total impact history to dashboards
                    impact_history = data_buffer[player_id]
                    impact_history_topic = "player/" + \
                        str(player_id) + "/impact_history"
                    client.publish(impact_history_topic, json.dumps(
                        impact_history), retain=True)
        except Exception as e:
            print(f"Error in handling impact data: {str(e)}")

    elif bool(re.search(r"player/\d+/concussion$", msg.topic)):
        try:
            # If concussion, record it in the buffer
            player_id = msg.topic.split("/")[1]
            timestamp = int(data)

            for impact in data_buffer[int(player_id)]:
                if impact["timestamp"] == timestamp:
                    impact["isConcussion"] = True
                    break

        except Exception as e:
            print(f"Error in handling concussion data: {str(e)}")

    elif bool(re.search(r"buddy/\d+/status$", msg.topic)):
        global buddy_active_time_map
        try:
            device_id = int(msg.topic.split("/")[1])
            status = int(data)

            if (status == 0):
                return
            else:
                buddy_active_time_map[device_id] = time.time()
                print("Buddy status updated:", buddy_active_time_map)
        except Exception as e:
            print(f"Error in handling buddy status: {e}")


def on_disconnect(client, userdata, rc):
    try:
        print("Disconnected with result code " + str(rc))
    except Exception as e:
        print(f"Error in on_disconnect: {str(e)}")


def end_session():
    print("Clearing Data_buffer")
    global session_started, start_time, data_buffer, player_device_mapping
    session_started = False

    # for entry in data_buffer:
    #     client.publish(session_data, json.dumps(entry), retain=True)

    data_buffer = {}  # Clear the buffer after sending the stored data
    start_time = None
    # player_device_mapping = {}
    print("Session ended!")


def check_for_inactive_buddies():
    global buddy_active_time_map
    while True:
        current_time = time.time()
        for device_id in list(buddy_active_time_map.keys()):
            if current_time - buddy_active_time_map[device_id] > 60:
                # Publish zero battery status for inactive buddy
                print(f"Buddy {device_id} is not active.")
                buddy_status_topic = f"buddy/{device_id}/status"
                client.publish(buddy_status_topic, 0, retain=True)

                # remove inactive buddy from the map
                del buddy_active_time_map[device_id]
                print("Buddy status sent")
        time.sleep(30)


# Create MQTT client
client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message
client.on_disconnect = on_disconnect

client.username_pw_set("impax", "impax")

# Maximum number of connection attempts
max_attempts = 15

# Attempt to connect to the broker(for 75 seconds) and exit if unsuccessful
attempts = 0
while attempts < max_attempts:
    try:
        # Connect to the broker
        client.connect(broker_address, broker_port, 60)
        break  # If connected, exit the loop
    except Exception as e:
        print(f"Connection attempt failed: {str(e)}")
        attempts += 1
        time.sleep(5)  # Wait for a few seconds before the next attempt


# Check if the maximum number of attempts is reached
if attempts == max_attempts:
    print(f"Failed to connect after {max_attempts} attempts. Exiting.")
    exit()

# Start the MQTT loop
client.loop_start()

# Start a separate thread to run the check_for_inactive_buddies function
check_buddies_thread = threading.Thread(
    target=check_for_inactive_buddies, daemon=True)
check_buddies_thread.start()

try:
    while True:
        pass
except KeyboardInterrupt:
    # Gracefully disconnect on keyboard interrupt
    client.disconnect()
    client.loop_stop()
