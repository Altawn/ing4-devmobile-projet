/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_862999789")

  // remove field
  collection.fields.removeById("text2420462245")

  // remove field
  collection.fields.removeById("text2895943165")

  // remove field
  collection.fields.removeById("text2443638570")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_862999789")

  // add field
  collection.fields.addAt(9, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2420462245",
    "max": 0,
    "min": 0,
    "name": "date_publication",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2895943165",
    "max": 0,
    "min": 0,
    "name": "image_url",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(11, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2443638570",
    "max": 0,
    "min": 0,
    "name": "fiche_url",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
})
