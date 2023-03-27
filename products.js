const express = require('express')
const app = express()
const port = 8080
const { request } = require('http')
const { response } = require('express')
const { Console } = require('console')
//utilis le app .use pour lir le json
app.use(express.json())
const requettes = require('./requettes')
//let client = requettes.getConnect()
const client = require('./requettes')

app.get('/products', (req, res) => {
    let client =requettes.client
    function callback(err,data){
        if(err){
            res.status(500).send(err)      
          }
          res.json(data.rows)
     
          
    }
    requettes.getAllProduct(client,callback)
  
});

app.get('/all', (req, res) => {
    res.json({message:"rappel express!"})
});

//Récupération d'un produit selon son ID

app.get('/products/:id', (req, res) => {
  let id = req.params.id;
  let client=requettes.client 
   requettes.getProductId(client,id,(error,data)=>{
    if(error){
        console.log(error)
        return
      }
      res.json(data.rows)
     
  })
  
  
});

// Ajout d'un produit
app.post('/Ajproducts', (req, res) => {
let client=requettes.client 
  let {id, name, description, price, stock } = req.body;
  let newProduct = { id, name, description, price, stock };
  requettes.postProduct(newProduct,client,(error,data)=>{
    if(error){
        console.log(error)
        return
    }});

  res.status(201).json(newProduct);
  
  
});

// Mise à jour d'un produit selon son ID
app.put('/MJproducts/:id', (req, res) => {
    let client=requettes.client;
    let id = req.params.id;
    let { name, description, price, stock } = req.body;
    let newProduct1 = { id, name, description, price, stock };  
     requettes.putProduct(id,newProduct1,client, (error,data) => {
      if (error){
        console.log(error)
        res.status(500).send("Erreur lors de la mise à jour du produit");
        return
      }
      res.send("Produit mis à jour avec succès !");
      });
      
  });

// Suppression d'un produit selon son ID
app.delete('/Supproducts/:id', (req, res) => {
    let client=requettes.client 
    let id = req.params.id;
    requettes.deleteProduct(id,client, (error, data) => {
      if (error) {
        console.log(error)
        res.status(500).send("Erreur lors de la suppression du produit");
        return
      }
      res.send('Produit supprimé avec succès !');
    });
    
  });



app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
  });
 