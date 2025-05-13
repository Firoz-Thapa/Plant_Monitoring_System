import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/moisture_provider.dart';
import '../widgets/moisture_card.dart';
import '../widgets/moisture_chart.dart';
import '../widgets/alert_widget.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Plant Monitoring System'),
        backgroundColor: Colors.green,
      ),
      body: Consumer<MoistureProvider>(
        builder: (context, provider, child) {
          return RefreshIndicator(
            onRefresh: () async {
              // Provider would refetch data
            },
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                if (provider.latestMoisture != null)
                  MoistureCard(moistureData: provider.latestMoisture!)
                else
                  const Card(
                    child: Padding(
                      padding: EdgeInsets.all(16.0),
                      child: Text('No moisture data available'),
                    ),
                  ),
                const SizedBox(height: 16),
                AlertWidget(moistureData: provider.latestMoisture),
                const SizedBox(height: 16),
                MoistureChart(moistureData: provider.moistureHistory),
                const SizedBox(height: 16),
                Container(
                  alignment: Alignment.center,
                  padding: const EdgeInsets.all(8),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        provider.isConnected
                            ? Icons.cloud_done
                            : Icons.cloud_off,
                        color: provider.isConnected ? Colors.green : Colors.red,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        provider.isConnected
                            ? 'Connected to server'
                            : 'Disconnected from server',
                        style: TextStyle(
                          color: provider.isConnected ? Colors.green : Colors.red,
                        ),
                      ),
                    ],
                  ),
                ),
                if (provider.error != null)
                  Container(
                    margin: const EdgeInsets.only(top: 16),
                    padding: const EdgeInsets.all(8),
                    color: Colors.red.withOpacity(0.1),
                    child: Text(
                      provider.error!,
                      style: const TextStyle(color: Colors.red),
                      textAlign: TextAlign.center,
                    ),
                  ),
              ],
            ),
          );
        },
      ),
    );
  }
}