const mongoCollections = require("../mongoCollections");
const users = mongoCollections.users;
const books = mongoCollections.books;
const orders = mongoCollections.orders;
const bookData = require("./book");
const userData = require("./user");
const objId = require('mongodb').ObjectID;

module.exports = {
//////// Get order by ID ////////
    async get(id) {
    if (!id) throw "You must provide an id to search for";
      if(id.constructor != objId){
        if(id.constructor == String){
          if(objId.isValid(id)){
            var obj = new objId(id)
            const orderCollection = await orders();
            const order = await orderCollection.findOne({_id:obj})
            if (order.length === 0) throw "No user with that id";
            return order;
          }else{
            throw "It is not a valid id"
          }
        }else{
          throw "Please input Id as object Id or string"
        }
      }else{
        const orderCollection = await users();
        const order = await orderCollection.findOne({_id:id})
        if (order.length === 0) throw "No user with that id";
        return order;
      }
    },
    //Get order by userid
    async getById(uid) {
      if (!uid) throw "You must provide an user id to search for";
        if(uid.constructor != objId){
          if(uid.constructor == String){
            if(objId.isValid(uid)){
              var obj = new objId(uid)
              const orderCollection = await orders();
              const order = await orderCollection.find({user:obj}).toArray()
              
              return order;
            }else{
              throw "It is not a valid id"
            }
          }else{
            throw "Please input Id as object Id or string"
          }
        }else{
          const orderCollection = await users();
          const order = await orderCollection.find({user:uid}).toArray()
    
          return order;
        }
      },

    async createOrder(userid, content, address, payment){
      console.log('in create order')
        if (!userid) throw "You must provide an id to search for user Id";
        console.log('in create order1')
        if (!content || typeof content != 'object' || content.length == 0) throw "You must provide content";
        console.log('in create order2')
        if (!address || typeof address != 'string') throw "You must provide an address";
        console.log('in create order3')
        if (!payment || typeof payment != 'string') throw "You must provide payment";
        console.log('in create order4')
        if(await userData.get(userid) == 0) throw "User doesn't exist!";

        if(userid.constructor != objId){
            if(userid.constructor == String){
              if(objId.isValid(userid)){
                var userobj = new objId(userid)
                
                const orderCollection = await orders();
                const userCollection = await users();
                //Create new order
                let newOrder = {
                    user : userobj,
                    content : content,
                    address: address,
                    payment: payment,
                    date: new Date(Date.now())
                }
                const insertInfo = await orderCollection.insertOne(newOrder);
                
                if (insertInfo.insertedCount === 0) throw "Could not add user";
                const newId = insertInfo.insertedId;

                //Push item to the order
                var updatedUser = {
                    $push:{//////////how to increase quantity of same item
                        order:{ id:newId }//[fhihiefowj23432r, 12]
                    }
                };
                var updatedInfo = await userCollection.updateOne({ _id: userobj }, updatedUser);
                if (updatedInfo.modifiedCount === 0) throw "Could not add order";
                //Remove cart item
                var updatedUserNext = {
                     $set : {'cart': [] }
                };
                var updatedInfoNext = await userCollection.updateOne({ _id: userobj }, updatedUserNext);
                
                const user = userCollection.findOne({ _id: userobj });
                if (updatedInfoNext.modifiedCount === 0) {
                  throw "could not remove it from cart";
                }else{
                  console.log('Add item successfully');
                  return user;
                }
    
              }else{
                throw "It is not a valid id"
              }
            }else{
              throw "Please input Id as object Id or string"
            }
          }else{
            const orderCollection = await orders();
            const userCollection = await users();
            //Create new order
            let newOrder = {
                user : userid,
                content : content,
                address: address,
                payment: payment,
                date: new Date(Date.now())
            }
            const insertInfo = await orderCollection.insertOne(newOrder);
            
            if (insertInfo.insertedCount === 0) throw "Could not add user";
            const newId = insertInfo.insertedId;

            //Push item to the order
            var updatedUser = {
                $push:{//////////how to increase quantity of same item
                    order:{ id:newId }//[fhihiefowj23432r, 12]
                }
            };
            var updatedInfo = await userCollection.updateOne({ _id: userid }, updatedUser);
            if (updatedInfo.modifiedCount === 0) throw "Could not add order";
            //Remove cart item
            var updatedUserNext = {
                 $set : {'cart': [] }
            };
            var updatedInfoNext = await userCollection.updateOne({ _id: userid }, updatedUserNext);
            
            const user = userCollection.findOne({ _id: userid });
            if (updatedInfoNext.modifiedCount === 0) {
              throw "could not remove it from cart";
            }else{
              console.log('Add item successfully');
              return user;
            }

          }


    },
     //Get order by userid
     async removeOrder(orderid) {
      if (!orderid) throw "You must provide an user id to search for";
        if(orderid.constructor != objId){
          if(orderid.constructor == String){
            if(objId.isValid(orderid)){
              var obj = new objId(orderid)
              const orderCollection = await orders();
              console.log('before')
              const order = await orderCollection.remove({_id:obj})
              console.log('after')
              return order;
            }else{
              throw "It is not a valid id"
            }
          }else{
            throw "Please input Id as object Id or string"
          }
        }else{
          const orderCollection = await orders();
          console.log('before')
          const order = await orderCollection.remove({_id:orderid})
          console.log('after')
    
          return order;
        }
      }

}