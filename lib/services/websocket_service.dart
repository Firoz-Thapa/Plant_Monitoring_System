import 'dart:convert';
import 'package:web_socket_channel/web_socket_channel.dart';
import '../config/api_config.dart';
import '../models/moisture_data.dart';

class WebSocketService {
  WebSocketChannel? _channel;
  Function(MoistureData)? onDataReceived;
  Function(bool)? onConnectionStatusChanged;

  bool get isConnected => _channel != null;

  void connect() {
    try {
      _channel = WebSocketChannel.connect(Uri.parse(ApiConfig.wsUrl));
      
      if (onConnectionStatusChanged != null) {
        onConnectionStatusChanged!(true);
      }

      _channel!.stream.listen(
        (message) {
          try {
            final data = jsonDecode(message);
            final moistureData = MoistureData(
              value: double.parse(data['value'].toString()),
              timestamp: DateTime.parse(data['timestamp']),
            );
            
            if (onDataReceived != null) {
              onDataReceived!(moistureData);
            }
          } catch (e) {
            print('Error processing message: $e');
          }
        },
        onDone: () {
          if (onConnectionStatusChanged != null) {
            onConnectionStatusChanged!(false);
          }
          _reconnect();
        },
        onError: (error) {
          print('WebSocket error: $error');
          if (onConnectionStatusChanged != null) {
            onConnectionStatusChanged!(false);
          }
          _reconnect();
        },
      );
    } catch (e) {
      print('Failed to connect: $e');
      _reconnect();
    }
  }

  void _reconnect() {
    Future.delayed(const Duration(seconds: 5), () {
      connect();
    });
  }

  void disconnect() {
    _channel?.sink.close();
    _channel = null;
    if (onConnectionStatusChanged != null) {
      onConnectionStatusChanged!(false);
    }
  }
}