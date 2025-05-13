import 'package:flutter/material.dart';
import '../models/moisture_data.dart';

class MoistureCard extends StatelessWidget {
  final MoistureData moistureData;

  const MoistureCard({Key? key, required this.moistureData}) : super(key: key);

  Color _getStatusColor() {
    switch (moistureData.status) {
      case 'Low':
        return Colors.red;
      case 'Optimal':
        return Colors.green;
      case 'High':
        return Colors.blue;
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Icons.water_drop, color: Colors.blue),
                const SizedBox(width: 8),
                Text(
                  'Soil Moisture',
                  style: Theme.of(context).textTheme.titleMedium,
                ),
              ],
            ),
            const Divider(),
            Center(
              child: Text(
                '${moistureData.value.toStringAsFixed(1)}%',
                style: TextStyle(
                  fontSize: 36,
                  fontWeight: FontWeight.bold,
                  color: _getStatusColor(),
                ),
              ),
            ),
            const SizedBox(height: 8),
            Center(
              child: Text(
                'Status: ${moistureData.status}',
                style: TextStyle(
                  fontSize: 16,
                  color: _getStatusColor(),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}