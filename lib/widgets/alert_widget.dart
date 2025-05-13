import 'package:flutter/material.dart';
import '../models/moisture_data.dart';

class AlertWidget extends StatelessWidget {
  final MoistureData? moistureData;

  const AlertWidget({Key? key, this.moistureData}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    if (moistureData == null || !moistureData!.needsWatering) {
      return const SizedBox.shrink();
    }

    return Container(
      margin: const EdgeInsets.symmetric(vertical: 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.red.withOpacity(0.1),
        border: const Border(
          left: BorderSide(color: Colors.red, width: 4),
        ),
        borderRadius: BorderRadius.circular(4),
      ),
      child: Row(
        children: [
          const Icon(Icons.notifications_active, color: Colors.red),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              'Moisture level is low! Consider watering your plant.',
              style: TextStyle(color: Colors.red[700]),
            ),
          ),
        ],
      ),
    );
  }
}