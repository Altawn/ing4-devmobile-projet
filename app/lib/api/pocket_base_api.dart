import 'package:pocketbase/pocketbase.dart';
import 'package:formation_flutter/screens/product/recall_fetcher.dart';

class PocketBaseAPI {
  static final PocketBaseAPI _instance = PocketBaseAPI._internal();
  factory PocketBaseAPI() => _instance;

  final pb = PocketBase('http://127.0.0.1:8090');

  PocketBaseAPI._internal();

  /// Cherche un rappel dans PocketBase par code-barres (gtin).
  /// Retourne un [RecallInfo] si trouvé, null sinon.
  Future<RecallInfo?> getRecallByBarcode(String barcode) async {
    final result = await pb
        .collection('api_projet')
        .getList(page: 1, perPage: 1, filter: 'gtin = "$barcode"');

    if (result.items.isEmpty) return null;

    final record = result.items.first;
    return RecallInfo(
      externalId: record.getStringValue('externalId'),
      gtin: record.getStringValue('gtin'),
      libelle: record.getStringValue('libelle'),
      marque: record.getStringValue('marque'),
      categorie: record.getStringValue('categorie'),
      sousCategorie: record.getStringValue('sous_categorie'),
      motif: record.getStringValue('motif'),
      natureRappel: record.getStringValue('nature_rappel'),
    );
  }
}
