import 'package:flutter/foundation.dart';
import '../models/moisture_data.dart';
import '../services/api_service.dart';
import '../services/websocket_service.dart';

class MoistureProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();
  final WebSocketService _webSocketService = WebSocketService();
  
  List<MoistureData> _moistureHistory = [];
  MoistureData? _latestMoisture;
  bool _isConnected = false;
  String? _error;

  List<MoistureData> get moistureHistory => _moistureHistory;
  MoistureData? get latestMoisture => _latestMoisture;
  bool get isConnected => _isConnected;
  String? get error => _error;

  MoistureProvider() {
    _initWebSocket();
    _fetchHistoricalData();
  }

  void _initWebSocket() {
    _webSocketService.onDataReceived = (data) {
      _latestMoisture = data;
      
      // Add to history but limit to last 20 entries
      _moistureHistory.add(data);
      if (_moistureHistory.length > 20) {
        _moistureHistory.removeAt(0);
      }
      
      notifyListeners();
    };
    
    _webSocketService.onConnectionStatusChanged = (status) {
      _isConnected = status;
      notifyListeners();
    };
    
    _webSocketService.connect();
  }

  Future<void> _fetchHistoricalData() async {
    try {
      final data = await _apiService.fetchHistoricalData();
      if (data.isNotEmpty) {
        _moistureHistory = data;
        _latestMoisture = data.last;
        notifyListeners();
      }
    } catch (e) {
      _error = 'Failed to load historical data';
      notifyListeners();
    }
  }

  @override
  void dispose() {
    _webSocketService.disconnect();
    super.dispose();
  }
}