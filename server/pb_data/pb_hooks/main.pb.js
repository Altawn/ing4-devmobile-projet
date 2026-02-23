
routerAdd("GET", "/api/import", function (e) {
    var type = e.requestInfo().query["type"] || "api";
    var items = [];

    if (type === "api") {
        var res = $http.send({
            url: "https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/rappelconso-v2-gtin-trie/records?limit=100",
            method: "GET"
        });
        items = res.json.results || [];
    } else {
        var path = $filepath.join(__hooks, "..", "..", "donnees-2026.json.txt");
        items = JSON.parse(toString($os.readFile(path)));
    }

    var coll = $app.findCollectionByNameOrId("recalls");
    var stats = { created: 0, updated: 0 };

    items.forEach(function (item) {
        var id = (item.id || "").toString();
        if (!id) return;
        var rec;
        try {
            rec = $app.findFirstRecordByData("recalls", "externalId", id);
            stats.updated++;
        } catch (e) {
            rec = new Record(coll);
            stats.created++;
        }
        rec.set("externalId", id);
        rec.set("gtin", (item.gtin || "").toString());
        rec.set("libelle", item.libelle || "");
        rec.set("marque", item.marque_produit || "");
        $app.save(rec);
    });

    return e.json(200, { success: true, stats: stats });
});

cronAdd("import_recalls", "0 0,12 * * *", function () {
    // Calling the API route itself via HTTP is the most reliable way to reuse the logic
    try { $http.send({ url: "http://127.0.0.1:8090/api/import?type=api", method: "GET" }); } catch (e) { }
});
