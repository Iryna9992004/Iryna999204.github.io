const express = require("express");
const app = express();
const Datastore = require("nedb");
const fs = require("fs");

app.use(express.json());

const port = 3000;

// === Streets ===
const streetsDb = new Datastore({ filename: "streets.db", autoload: true });

// завантаження з JSON у БД
app.post("/streets/load", (req, res) => {
  try {
    let data = fs.readFileSync("./data/streets.json");
    let list = JSON.parse(data);

    streetsDb.insert(list, (err, newDocs) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ message: "Помилка при вставці даних" });
      }
      console.log(
        `Успішно створено streets.db з ${newDocs.length} документами.`
      );
      res.status(200).send(newDocs);
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "Виникла помилка" });
  }
});

// отримати всі вулиці
app.get("/streets", (req, res) => {
  streetsDb.find({}, (err, docs) => {
    if (err) return res.status(500).send({ message: "Помилка при читанні" });
    res.status(200).send(docs);
  });
});

app.get("/streets/:id", (req, res) => {
  streetsDb.findOne({ _id: req.params.id }, (err, doc) => {
    if (err) return res.status(500).send({ message: "Помилка при читанні" });
    if (!doc) return res.status(404).send({ message: "Не знайдено" });
    res.status(200).send(doc);
  });
});

app.post("/streets", (req, res) => {
  const newStreet = req.body;
  streetsDb.insert(newStreet, (err, doc) => {
    if (err) return res.status(500).send({ message: "Помилка при вставці" });
    res.status(201).send(doc);
  });
});

const buildingsDb = new Datastore({ filename: "buildings.db", autoload: true });

app.post("/buildings/load", (req, res) => {
  try {
    let data = fs.readFileSync("./data/buildings.json");
    let list = JSON.parse(data);

    buildingsDb.insert(list, (err, newDocs) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ message: "Помилка при вставці даних" });
      }
      console.log(
        `Успішно створено buildings.db з ${newDocs.length} документами.`
      );
      res.status(200).send(newDocs);
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "Виникла помилка" });
  }
});

app.get("/buildings", (req, res) => {
  buildingsDb.find({}, (err, docs) => {
    if (err) return res.status(500).send({ message: "Помилка при читанні" });
    res.status(200).send(docs);
  });
});

app.get("/buildings/:id", (req, res) => {
  buildingsDb.findOne({ _id: req.params.id }, (err, doc) => {
    if (err) return res.status(500).send({ message: "Помилка при читанні" });
    if (!doc) return res.status(404).send({ message: "Не знайдено" });
    res.status(200).send(doc);
  });
});

app.post("/buildings", (req, res) => {
  const newBuilding = req.body;
  buildingsDb.insert(newBuilding, (err, doc) => {
    if (err) return res.status(500).send({ message: "Помилка при вставці" });
    res.status(201).send(doc);
  });
});

app.listen(port, (err) => {
  if (err) {
    return console.log("Виникла аварійна ситуація: ", err);
  }
  console.log(`Сервер почав прослуховувати порт ${port}…`);
});
