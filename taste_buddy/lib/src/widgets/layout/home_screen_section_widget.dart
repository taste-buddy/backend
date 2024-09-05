import 'package:flutter/material.dart';

class HomeScreenSection extends StatelessWidget {
  final String title;
  final String? subtitle;

  const HomeScreenSection({
    super.key,
    required this.title,
    this.subtitle,
  });

  @override
  Widget build(BuildContext context) {
    return SliverPadding(
      padding: const EdgeInsets.all(16.0),
      sliver: SliverToBoxAdapter(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    color: Colors.orangeAccent,
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 4), // Small spacing between the title and subtitle
            subtitle != null ? Text(
              subtitle!,
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    color: Colors.grey[600],
                  ),
            ) :
            const SizedBox(height: 0), // No spacing if there is no subtitle
          ],
        ),
      ),
    );
  }
}
