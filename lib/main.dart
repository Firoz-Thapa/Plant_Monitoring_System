import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/moisture_provider.dart';
import 'screens/dashboard_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => MoistureProvider(),
      child: MaterialApp(
        title: 'Plant Monitoring System',
        theme: ThemeData(
          primarySwatch: Colors.green,
          useMaterial3: true,
        ),
        home: const DashboardScreen(),
      ),
    );
  }
}