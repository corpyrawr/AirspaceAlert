# AirspaceAlert
## Early WIP

AirspaceAlert is a TypeScript-based project designed to monitor air traffic data from a data source (such as tar1090 for ads-b) and trigger notifications when specific aircraft events occur. Notifications are sent via platforms like Telegram, Discord, and web-hooks based on user-configured rules and templates.

## Features
- **Configurable Data Sources:** Monitor aircraft data from sources like tar1090.
- **Event-Driven Alerts:** Trigger alerts when certain aircraft enter the airspace or squawk emergency codes (e.g., 7700).
- **Customizable Notifications:** Use templated messages for alerts and send them to various platforms (e.g., Telegram).
- **Flexible Configuration:** Use a YAML config file to customize settings, data sources, and notification rules.

# Getting Started
## Prerequisites
- Node.js (v14+ recommended)
- Yarn or npm for package management

## installation
Clone the repository:

```bash
git clone https://github.com/your-username/AirspaceAlert.git
cd AirspaceAlert
```

Install dependencies:

```bash
npm install
```

Copy the default configuration file and modify it:

```bash
cp ./config/default.yml ./config/config.yml
```
## Configuration
```yaml
log_level: debug

forget_after_intervals: 5
refresh_interval: 5

data_source:
  type: tar1090
  base: http://<IP>:8080/data/aircraft.json

notifiers:
  - type: telegram
    chat_id: <your_chat_id>
    message_thread_id: <optional_thread_id>
    api_key: <your_telegram_bot_api_key>

templates:
  - name: entered_airspace_template
    format: "Aircraft Type ${aircraft['t']} entered the airspace, reg ${aircraft['r']}, flight ${aircraft['flight']}, squawk ${aircraft['squawk']}"
  - name: squawk7700_template
    format: "reg ${aircraft['r']}, flight ${aircraft['flight']} Squawked 7700"

triggers:
  - name: entered_airspace
    rules:
      - type: eval
        expression: (['A388','GLEX','H47','GLF4','GA6C','GL7T','R135','GLF6','IL76','GL5T','A310','K35R','C130','FA7X','FA8X','C30J','P8','C27J'].some(e => e == aircraft['t'])) && aircraft["isNew"] == true
    notifiers:
      - type: telegram
        template: "entered_airspace_template"
  - name: squawk7700
    rules:
      - type: eval
        expression: aircraft["squawk"] == "7700"
    notifiers:
      - type: telegram
        template: "squawk7700_template"

```
### YAML Configuration Parameters:
- `log_level`: Set to `debug`, `verbose`, `info`, `warn`, or `error`
- `forget_after_intervals`: Number of iterations before forgetting an aircraft if it hasn't been seen.
- `refresh_interval`: Interval (in seconds) to refresh data from the source.
- `data_source`: Define the data source for aircraft information (e.g., tar1090).
    - base: URL to the data source (e.g., http://<IP>:8080/data/aircraft.json).

- `notifiers`: List of notifiers to send messages (e.g., Telegram).
    - `chat_id`: Your Telegram chat ID.
    - `message_thread_id`: Optional message thread ID for grouped messages.
    - `api_key`: Telegram bot API key.
- `templates`: Define message templates using placeholders like ${aircraft['t']}.
- `triggers`: Define event triggers and corresponding notification actions.

## Running AirspaceAlert
Once configured, start the application using the following command:
```bash
npm start
```
The app will begin monitoring the specified data source, evaluating the defined rules, and sending notifications via the configured notifiers.