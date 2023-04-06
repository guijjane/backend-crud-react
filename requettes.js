const{Client}=require('pg')
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'stock',
    password: 'root',
    port: 5432,
})
client.connect()   


function GetAllProduct(client,callback){
    client.query("SELECT * FROM products",callback)
}
function GetAll(client,callback){
    client.query("SELECT * FROM products",callback )

}
function GetProductId(client,[id],callback){
    client.query("SELECT * FROM products WHERE id =$1",[id],callback )
}
function PostProduct(product, client,callback){
    let valueproduct=[product.name,product.description,product.price,product.stock]
    client.query("INSERT INTO products (name, description, price, stock ) values ($1,$2,$3,$4)",valueproduct,callback )
}
function PutProduct(id,product, client,callback){
    let valueproduct1=[product.name,product.description,product.price,product.stock,id]
    client.query("UPDATE products SET name=$1, description=$2, price=$3, stock=$4 WHERE id=$5",valueproduct1,callback )
}
function DeleteProduct(id, client,callback){
    client.query("DELETE FROM products WHERE id=$1",[id],callback )
}
function addUser (client,newUser,callback){
    let sql = `INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4)`;
    client.query(sql,newUser,callback);
}

//les fonction sans hach code 2eme methode 
// function PostRegister(users, client,callback){
//     let valueuser=[users.firstname,users.lastname,users.email,users.password]
//     client.query("INSERT INTO users (firstname, lastname, email, password ) values ($1,$2,$3,$4)",valueuser,callback )
// }
// function GetAllEmailUsers(client,callback){
//     client.query("select email from users",callback)
// }







module.exports.client=client
module.exports.GetAllProduct = GetAllProduct
module.exports.GetAll = GetAll
module.exports.GetProductId = GetProductId
module.exports.PostProduct = PostProduct
module.exports.PutProduct = PutProduct
module.exports.DeleteProduct = DeleteProduct
module.exports.addUser = addUser

// module.exports.PostRegister = PostRegister
// module.exports.GetAllEmailUsers = GetAllEmailUsers

