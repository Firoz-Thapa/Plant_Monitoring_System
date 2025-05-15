import 'package:flutter_dotenv/flutter_dotenv.dart';

class ApiConfig {
  static String get baseUrl => dotenv.env['INFLUX_BASE_URL'] ?? 'http://localhost:8086';
  static String get wsUrl => dotenv.env['INFLUX_WS_URL'] ?? 'ws://localhost:3001';
  static String get historyEndpoint => dotenv.env['INFLUX_HISTORY_ENDPOINT'] ?? '/api/v2/query';
  static String get influxToken => dotenv.env['INFLUX_TOKEN'] ?? '';
  static String get influxOrg => dotenv.env['INFLUX_ORG'] ?? '';
  static String get influxBucket => dotenv.env['INFLUX_BUCKET'] ?? '';
}