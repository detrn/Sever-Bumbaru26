//dependente
const { createServer } = require('node:http');
const fs = require('fs');
const path = require('path');
const {connectDB,getReportsCollection} = require('./database.js'); //utilizatori, renovari, propuneri
const {ObjectId} = require("mongodb");
const port = 3000;

const server = createServer((req, res) => {
  let filePath=req.url;

  filePath = filePath.split('?')[0];
  filePath = filePath.startsWith('/') ? filePath.slice(1) : filePath;

  //lucru baza de date

  //adaugare sesizari baza de date
  //pentru adaugare se trimite la api/reports cu POST !

if(filePath==='api/reports' && req.method !== 'POST'){
  if(!db){
    console.log('No database connection fouund.');
    return;
  }
  let body='';
  req.on('data', (chunk) => body += chunk);
  req.on('end', () => {
    const sesizareDinFormular=JSON.parse(body);

    const sesizare = {
      nume: sesizareDinFormular.nume,
      prenume: sesizareDinFormular.prenume,
      locatie: sesizareDinFormular.locatie,
      data: sesizareDinFormular.data,
      sesizare: sesizareDinFormular.sesizare,
      criteriuSesizare: sesizareDinFormular.criteriuSesizare,
      cuvinteCheie: sesizareDinFormular.cuvinteCheie || [],
      nivelUrgenta: sesizareDinFormular.nivelUrgenta || 1,


      status: "in asteptare",
      numarVoturi: 0,
      dataCreare: new Date()
    };



    const collection=getReportsCollection();
    collection.insertOne(sesizare,(err,rescult)=>{
      if(err){
        console.error(err);
        return;
      }
      res.setHeader('Conent-Type','application/json');
      res.end(JSON.stringify({succes:true, id:insertedId, mesaj:"Sesizare inregistrata"}));
    })
  });
  return;
}

  //vizualizare sesizari baza de date
  //pentru adaugare se trimite la api/reports cu GET !

  if(filePath==='api/reports' && req.method==='GET'){
    if(!db){
      console.log('No database connection found.');
      return;
    }
    const colectie=getReportsCollection(db);
    colectie.find({}).toArray((err,docs)=>{
      if(err){
        console.error(err);
        return;
      }
      res.setHeader('Content-type','application/json');
      res.end(JSON.stringify(docs));
    })
  }
// PUT /api/reports/:id/vote pentru adaugfare coturi --url necesar pentru incrementarea voturilor
  if(filePath.startsWith('api/reports') && filePath.endsWith('/vote') && req.method === 'PUT'){
    const id = filePath.split('?')[0];
    const {ObjectId} = require('mongodb');
    const collection=getReportsCollection();
    collection.updateOne({_id: ObjectId}, {$inc: {numarVoturi:1}}, (err,docs)=>{
      if(err){
        console.error(err);
        return;
      }
      res.setHeader('Content-type','application/json');
      res.end(JSON.stringify({succes:true},{mesaj: "Vot intregistrat!"}));
    }
    );
    return;
    }
//pentru decrementat numarul de voturi -- acelasi apel la url
  if(filePath.startsWith('api/reports') && filePath.endsWith('/vote') && req.method === 'PUT'){
    const id = filePath.split('?')[0];
    const {ObjectId} = require('mongodb');
    const collection=getReportsCollection();
    collection.updateOne({_id: ObjectId}, {$inc: {numarVoturi:-1}}, (err,docs)=>{
          if(err){
            console.error(err);
            return;
          }
          res.setHeader('Content-type','application/json');
          res.end(JSON.stringify({succes:true},{mesaj: "Vot intregistrat!"}));
        }
    );
    return;
  }




//lucru pagini si server


  //gestionare pagini
  let fullPath;
  if(filePath===''){
    fullPath='../frontend/login.html';
  }
  else if(filePath.startsWith('assets/')) {
    fullPath = `../${filePath}`;
  }
  else {
    if(!path.extname(filePath) && !filePath.includes('.') && !filePath.startsWith('assets/'))
      filePath = filePath + '.html';
    fullPath='../frontend/' + filePath;
  }

  fs.readFile(fullPath, (err, data) => {
    if(err){
      res.statusCode = 404;
      console.error(err);
      return;
    }

    if(fullPath.endsWith('.html')){
      res.setHeader('Content-Type','text/html');
    }
    else if(fullPath.endsWith('.css')){
      res.setHeader('Content-Type','text/css');
    }
    else if(fullPath.endsWith('.js')){
      res.setHeader('Content-Type','application/javascript');
    }
    else if(fullPath.endsWith('.jpg')){
      res.setHeader('Content-Type','image/jpg');
    }
    else if(fullPath.endsWith('.mp4')){
      res.setHeader('Content-Type','video/mp4');
    }
    res.end(data);
  });
});
let db;
connectDB().then((database) => {
  db=database;
})
//ascultate e sv
server.listen(port, (err) => {
  if(err){
    console.log(err);
  }else console.log(`Listening on port ${port}`);
});

