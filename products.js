const express = require('express')
const app = express()
const port = 5000
const { request } = require('http')
const { response } = require('express')
const { Console } = require('console')
//utilis le app .use pour lir le json
const cors=require('cors')
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const requettes = require('./requettes')
//let client = requettes.getConnect()
const client = require('./requettes')
const secret = 'ma-cle-secrete';
const User = require("./requettes");
app.use(cors({
  credentials:true,
  origin:'http://localhost:3000'
}));


app.get('/products', (req, res) => {
    let client =requettes.client
    function callback(err,data){
        if(err){
            res.status(500).send(err)      
          }
          res.json(data.rows)
     
          
    }
    requettes.GetAllProduct(client,callback)
  
});

app.get('/all', (req, res) => {
    res.json({message:"rappel express!"})
});

//Récupération d'un produit selon son ID

app.get('/products/:id', (req, res) => {
  let id = req.params.id;
  let client=requettes.client 
   requettes.GetProductId(client,id,(error,data)=>{
    if(error){
        console.log(error)
        return
      }
      res.json(data.rows)
     
  })
  
  
});
// Middleware : la fonction pour authentifier l'utilisateur à chacune de ses requetes
const authenticate = (req, res, next) => {
  const headerToken = req.headers.authorization;
  if (!headerToken) {
     return res.status(401).json({ message: 'Authorization header missing' });
  }
  const token = headerToken.split(' ')[1];
  try {
     const decodedToken = jwt.verify(token, secret);
     req.user = decodedToken;
     next();
  } catch (error) {
     return res.status(401).json({ message: 'Invalid token' });
  }
};


// Ajout d'un produit
app.post('/ajproducts',authenticate, (req, res) => {
let client=requettes.client 
  let {id, name, description, price, stock } = req.body;
  let newProduct = { id, name, description, price, stock };
  requettes.PostProduct(newProduct,client,(error,data)=>{
    if(error){
        console.log(error)
        return
    }});

  res.status(201).json(newProduct);
  
  
});

// Mise à jour d'un produit selon son ID
app.put('/mjproducts/:id',authenticate,(req, res) => {
    let client=requettes.client;
    let id = req.params.id;
    let { name, description, price, stock } = req.body;
    let newProduct1 = { id, name, description, price, stock };  
     requettes.PutProduct(id,newProduct1,client, (error,data) => {
      if (error){
        console.log(error)
        res.status(500).send("Erreur lors de la mise à jour du produit");
        return
      }
      res.send("Produit mis à jour avec succès !");
      });
      
  });

// Suppression d'un produit selon son ID
app.delete('/supproducts/:id',authenticate, (req, res) => {
    let client=requettes.client 
    let id = req.params.id;
    requettes.DeleteProduct(id,client, (error, data) => {
      if (error) {
        console.log(error)
        res.status(500).send("Erreur lors de la suppression du produit");
        return
      }
      res.send('Produit supprimé avec succès !');
    });
    
  });
//backend de register 
//la 1er methode avec hach code 
app.post('/register', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    console.log(email,password)
    let client = requettes.client;
    let sql = 'SELECT * FROM users WHERE email = $1';
    client.query(sql, [email], (error,result) =>{
      if (error){
        console.error("Error checking if user exists: ", error);
        return res.status(500).json({ message: 'Internal server error' });
      }
      if (result.rows.length > 0) {
        return res.status(409).json({ message: "Email already registered" });
      }
      bcrypt.hash(password, 10, (error, hashedPassword) => {
        if (error) {
          console.error("Error hashing password: ", error);
          return res.status(500).json({ message: "Internal server error" });
        }
        const newUser = [req.body.firstname, req.body.lastname, req.body.email, hashedPassword]
        requettes.addUser(client, newUser, callback)
        function callback (error,data){
          if (error) {
            console.error("Error saving user: ", error);
            return res.status(500).json({ message: "Internal server error" });
          }
          res.json({message:"User Added successfully"})}
        });
      });
    });
  

// la 2eme methode sans hache
// function getRegisteredUsersFromDb() {
//   return new Promise((resolve, reject) => {
//     let client = requettes.client;
//     requettes.GetAllEmailUsers(client, (err, data) => {
//       if (err) {
//         console.log('Erreur lors de la récupération des utilisateurs enregistrés : ', err);
//         reject(err);
//       } else {
//         const users = data.rows.map(row => row.email);
//         resolve(users);
//       }
//     });
//   });
// }
// async function checkCredentials2(email) {
//   const users = await getRegisteredUsersFromDb();
//   const user = users.find(u => u === email);
//   console.log(user);
//   return user;

// }
// app.post('/register', async (req, res) => {
//  let {firstname, lastname, email, password} = req.body;
//   const userExists = await checkCredentials2(email);
//   if (userExists) {
//     res.status(401).json({ message: 'Email exists' });
//     return;
//   } else {
//       let newUser = {firstname,lastname,email,password};
//       let client = requettes.client;
//       requettes.PostRegister(newUser, client, (error, data) => {
//         if (error) {
//           console.log(error);
//           return;
//         }
//       res.status(201).json(newUser);
//     });
//     }
// });



//backend de login 
// async function checkCredentials(email, password) {
//   let client =requettes.client
//   try {
//     const result = await client.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
//     return result.rows[0];
//   } catch(err) {
//     console.error(err);
//   }
// }
async function checkCredentials(email, password) {
  let client =requettes.client
  const sql = { 
  text: 'SELECT * FROM users WHERE email = $1', 
  values: [email],}; 
  const results = await client.query(sql); 
  if (results.rows.length > 0) {
    const user = results.rows[0]; 
    const chek = await bcrypt.compare(password, user.password);
    if (chek) { 
      return user; 
    } 
  
  }
  return null;
}

app.post('/login',async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await checkCredentials(email, password);
  console.log(user);
  if (!user) {
    res.status(403).send('Wrong credentials');
  } else {
    const token = jwt.sign({email},secret);
    // res.cookie('authToken', authToken);
    res.json({ message: 'Authentication success',token});
    console.log(token)

  }
});






app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
  });




//---------------------------------------------------------------

//   let  registereUsers = [
//     {firstname: "admin",
//     lastname: "admin",
//     email: "admin@gmail.com",
//     password: "azerty"},
//     {firstname: "jalal",
//     lastname: "jalal",
//     email: "jalal@gmail.com",
//     password: "azert"},
//     {firstname: "monir",
//     lastname: "monir",
//     email: "monir@gmail.com",
//     password: "azer"}
//   ];
//   function getRegisteredUsers() {
//     return registereFindUser;
//   }


// function checkCredentials(email, password) {
//   const users = getRegisteredUsers();
//   const user = users.find(u => u.email === email && u.password === password);
//   return user
// }

// app.post('/login', (req, res) => {
//   let email =req.body.email
//   let password =req.body.password
//   let user = checkCredentials(email,password)
//   console.log(user)
//   if(!user){
//     res.status(403).send("wrong credentials")
//   }else{
//     authToken =Math.random().toString()
//     res.cookie("authToken",authToken)
//     res.json({message:"authentification success"})
//   }
// })










