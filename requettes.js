const{Client}=require('pg')
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'stock',
    password: 'root',
    port: 5432,
})
client.connect()   



     
  

function getAllProduct(client,callback){
    client.query("SELECT * FROM products",callback)
}
function getAll(client,callback){
    client.query("SELECT * FROM products",callback )

}
function getProductId(client,[id],callback){
    client.query("SELECT* from products Where id =$1",[id],callback )
}
function postProduct(product, client,callback){
    let valueproduct=[product.name,product.description,product.price,product.stock]
    client.query("INSERT INTO products (name, description, price, stock ) values ($1,$2,$3,$4)",valueproduct,callback )
}
function putProduct(id,product, client,callback){
    let valueproduct1=[product.name,product.description,product.price,product.stock,id]
    client.query("UPDATE products SET name=$1, description=$2, price=$3, stock=$4 WHERE id=$5",valueproduct1,callback )
}
function deleteProduct(id, client,callback){
    client.query("DELETE FROM products WHERE id=$1",[id],callback )
}




module.exports.client=client
module.exports.getAllProduct = getAllProduct
module.exports.getAll = getAll
module.exports.getProductId = getProductId
module.exports.postProduct = postProduct
module.exports.putProduct = putProduct
module.exports.deleteProduct = deleteProduct