class MoistureData {
  final double value;
  final DateTime timestamp;

  MoistureData({required this.value, required this.timestamp});

  factory MoistureData.fromJson(Map<String, dynamic> json) {
    return MoistureData(
      value: double.parse(json['value'].toString()),
      timestamp: DateTime.parse(json['timestamp']),
    );
  }

  String get status {
    if (value < 30) return 'Low';
    if (value > 70) return 'High';
    return 'Optimal';
  }

  bool get needsWatering => value < 30;
}