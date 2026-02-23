routerAdd("GET", "/api/import", function (e) {
    var type = e.requestInfo().query["type"] || "api";
    var items = [];

    try {
        var path = $filepath.join(__hooks, "..", "donnees-2026.json");
        items = JSON.parse(toString($os.readFile(path)));

        // --- ICI : REMPLACE 'recalls' PAR LE NOM EXACT DE TA COLLECTION ---
        var collectionName = "api_projet";
        var coll = $app.findCollectionByNameOrId(collectionName);

        if (!coll) {
            throw new Error("La collection '" + collectionName + "' n'existe pas !");
        }

        var stats = { created: 0, updated: 0 };

        items.forEach(function (item) {
            // --- FILTRE : On utilise le nom exact du JSON 'categorie_produit' ---
            if (item.categorie_produit !== "alimentation") {
                return;
            }

            var id = (item.id || "").toString();
            if (!id) return;
            var rec;
            try {
                rec = $app.findFirstRecordByData(collectionName, "externalId", id);
                stats.updated++;
            } catch (err) {
                rec = new Record(coll);
                stats.created++;
            }

            rec.set("externalId", id);
            rec.set("gtin", (item.gtin || "").toString());
            rec.set("libelle", item.libelle || "");

            // --- MAPPING : item.NOM_DANS_JSON -> rec.set("NOM_DANS_POCKETBASE") ---
            rec.set("marque", item.marque_produit || "");
            rec.set("categorie", item.categorie_produit || "");
            rec.set("sous_categorie", item.sous_categorie_produit || "");
            rec.set("motif", item.motif_rappel || "");
            rec.set("nature_rappel", item.nature_juridique_rappel || "");

            $app.save(rec);
        });

        return e.json(200, { success: true, stats: stats });

    } catch (err) {
        // Cela va afficher l'erreur précise dans ton terminal noir (celui de PocketBase)
        console.log("ERREUR IMPORT : " + err.message);
        return e.json(500, { success: false, error: err.message });
    }
});