import 'package:flutter/material.dart';
import 'package:formation_flutter/api/pocket_base_api.dart';

class RecallFetcher extends ChangeNotifier {
  RecallFetcher({required String barcode})
    : _barcode = barcode,
      _state = RecallFetcherLoading() {
    loadRecall();
  }

  final String _barcode;
  RecallFetcherState _state;

  Future<void> loadRecall() async {
    _state = RecallFetcherLoading();
    notifyListeners();

    try {
      final recall = await PocketBaseAPI().getRecallByBarcode(_barcode);
      if (recall != null) {
        _state = RecallFetcherFound(recall);
      } else {
        _state = RecallFetcherNotFound();
      }
    } catch (error) {
      _state = RecallFetcherError(error);
    } finally {
      notifyListeners();
    }
  }

  RecallFetcherState get state => _state;
}

sealed class RecallFetcherState {}

class RecallFetcherLoading extends RecallFetcherState {}

/// Un rappel a été trouvé pour ce code-barres
class RecallFetcherFound extends RecallFetcherState {
  RecallFetcherFound(this.recall);

  final RecallInfo recall;
}

/// Aucun rappel trouvé : le produit est OK
class RecallFetcherNotFound extends RecallFetcherState {}

class RecallFetcherError extends RecallFetcherState {
  RecallFetcherError(this.error);

  final dynamic error;
}

/// Modèle de données pour un rappel produit
class RecallInfo {
  final String externalId;
  final String gtin;
  final String libelle;
  final String marque;
  final String categorie;
  final String sousCategorie;
  final String motif;
  final String natureRappel;

  const RecallInfo({
    required this.externalId,
    required this.gtin,
    required this.libelle,
    required this.marque,
    required this.categorie,
    required this.sousCategorie,
    required this.motif,
    required this.natureRappel,
  });
}
