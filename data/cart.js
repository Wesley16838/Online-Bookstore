const mongoCollections = require("../mongoCollections");
const users = mongoCollections.users;
const books = mongoCollections.books;
const bookData = require("./book");
const userData = require("./user");
const objId = require('mongodb').ObjectID;


module.exports = {
//1.update quantity
    async updateItem(userid, bookid, quantity) {
      if (!userid) throw "You must provide an id to search for user Id";
      if (!bookid) throw "You must provide an id to search for book Id";
      if (!quantity) throw "You must provide quantity of the book";
      if(await userData.get(userid) == 0) throw "User doesn't exist!";
      if(await bookData.get(bookid) == null) throw "Book doesn't exist";
      if(quantity.constructor != Number) throw "Please provide quantity as an integer";
      if(userid.constructor != objId || bookid.constructor != objId){
        if(userid.constructor == String || ubookid.constructor == String ){
          if(objId.isValid(userid)&&objId.isValid(bookid)){
            var userobj = new objId(userid)
            var bookobj = new objId(bookid)
            // var exist = false;
            var j = 0;
            const userCollection = await users();
            const bookCollection = await books();
            const old_user = await userCollection.findOne({ _id: userobj });
            // const book = await bookCollection.findOne({ _id: bookobj });
            console.log('test');
            console.log(old_user.cart)

            var updatedUser = {
                $set:{
                    "cart.$.qty":quantity
                }
            }
            var updatedInfo = await userCollection.updateOne({ _id: userobj, "cart.id":bookobj }, updatedUser);
                       
            const user = userCollection.findOne({ _id: userobj });
            return user;
            // if (updatedInfo.modifiedCount === 0) {
            //   throw "could not update successfully";
            // }else{
            //   console.log('Update item successfully');
            //   return user;
            // }

          }else{
            throw "It is not a valid id"
          }
        }else{
          throw "Please input Id as object Id or string"
        }
      }else{
        const userCollection = await users();
        const bookCollection = await books();
        const old_user = await userCollection.findOne({ _id: userid });
        const book = await bookCollection.findOne({ _id: bookid });

       
         
         
            var updatedUser = {
                $set:{
                    "cart.$.qty":quantity
                }
            }
            var updatedInfo = await userCollection.updateOne({ _id: userid, "cart.id":bookid.toString() }, updatedUser);
       

        const user = userCollection.findOne({ _id: userid });
        return user;
        // if (updatedInfo.modifiedCount === 0) {
        //   throw "could not update successfully";
        // }else{
        //   console.log('Add item successfully');
        //   return user;
        // }
      }

    },
    //add item  to the cart
    async addItem(userid, bookid, quantity) {
      if (!userid) throw "You must provide an id to search for user Id";
      if (!bookid) throw "You must provide an id to search for book Id";
      if (!quantity) throw "You must provide quantity of the book";
      if(await userData.get(userid) == 0) throw "User doesn't exist!";
      if(await bookData.get(bookid) == null) throw "Book doesn't exist";

      if(quantity.constructor != Number) throw "Please provide quantity as an integer";
      if(userid.constructor != objId || bookid.constructor != objId){
        if(userid.constructor == String || ubookid.constructor == String ){
          if(objId.isValid(userid)&&objId.isValid(bookid)){
            var userobj = new objId(userid)
            var bookobj = new objId(bookid)
            var exist = false;
            var j = 0;
            const userCollection = await users();
            const bookCollection = await books();
            const old_user = await userCollection.findOne({ _id: userobj });
            // const book = await bookCollection.findOne({ _id: bookobj });
            console.log('test');
            console.log(old_user.cart)
            for(var i = 0; i < old_user.cart.length; i++){
                if(old_user.cart[i].id!= bookid){
                }else{               
                    var new_quantity =  old_user.cart[i].qty
                    exist = true;
                }
            }
            if(exist == true){
             
                var total_quantity = quantity + new_quantity
                var updatedUser = {
                    $set:{
                        "cart.$.qty":total_quantity
                    }
                }
                var updatedInfo = await userCollection.updateOne({ _id: userobj, "cart.id":bookobj }, updatedUser);
            }else{
               
                var updatedUser = {
                    $push:{//////////how to increase quantity of same item
                        cart:{ id:bookobj, qty:quantity }//[fhihiefowj23432r, 12]
                    }
                };
                var updatedInfo = await userCollection.updateOne({ _id: userobj }, updatedUser);
            }

            
            const user = userCollection.findOne({ _id: userobj });
            if (updatedInfo.modifiedCount === 0) {
              throw "could not update successfully";
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
            const userCollection = await users();
            const bookCollection = await books();
            const old_user = await userCollection.findOne({ _id: userid });
            const book = await bookCollection.findOne({ _id: bookid });

            for(var i = 0; i < old_user.cart.length; i++){
                if(old_user.cart[i].id!= bookid){
                  
                }else{
                 
                    var new_quantity =  old_user.cart[i].qty
               
                    exist = true;
                }
            }
            if(exist == true){
             
                var total_quantity = quantity + new_quantity
                var updatedUser = {
                    $set:{
                        "cart.$.qty":total_quantity
                    }
                }
                var updatedInfo = await userCollection.updateOne({ _id: userid, "cart.id":bookid.toString() }, updatedUser);
            }else{
               
                var updatedUser = {
                    $push:{//////////how to increase quantity of same item
                        cart:{ id:bookid , qty:quantity }//[fhihiefowj23432r, 12]
                    }
                };
                var updatedInfo = await userCollection.updateOne({ _id: userid }, updatedUser);
            }

            const user = userCollection.findOne({ _id: userid });
            if (updatedInfo.modifiedCount === 0) {
              throw "could not update successfully";
            }else{
              console.log('Add item successfully');
              return user;
            }
      }
    }
  ,
  //Delete item from the cart
    async delete(userid, bookid) {
      console.log('inDelete')
      if (!userid) throw "You must provide an id to search for user";
      if (!bookid) throw "You must provide an id to search for book";
      console.log('inDelete')
      if(await userData.get(userid) == 0){ throw "No this user" }/////////
   
      if(await bookData.get(bookid) == null){ throw "No this books" }
      console.log('inDelete')
      if(userid.constructor != objId || bookid.constructor != objId){
        if(userid.constructor == String || bookid.constructor == String){
          if(objId.isValid(userid)&&objId.isValid(bookid)){
            var userobj = new objId(userid)
            var bookobj = new objId(bookid)
           
            const userCollection = await users();
            const bookCollection = await books();////
            console.log('inDelete1')
            const deletionInfo = await userCollection.update({ _id : userobj },{$pull:{ 'cart' : {id: bookobj} }});
            console.log('inDelete1')
            //get user after update 
            const user = userCollection.findOne({ _id: userobj});

            if (deletionInfo.deletedCount === 0) {
              throw `Could not delete`
            } else{
                console.log('Delete item successfully');
                return user;///////////
            };
          
          }else{
            throw "It is not a valid id"
          }
        }else{
          throw "Please input Id as object Id or string"
        }
      }else{
        const userCollection = await users();
        const bookCollection = await books();////

        const deletionInfo = await userCollection.update({ _id : userid },{$pull:{ 'cart' : {id: bookid} }});
        //get user after update 
        const user = userCollection.findOne({ _id: userid});
        if (deletionInfo.deletedCount === 0) {
          throw `Could not delete`
        } else{
            console.log('Delete item successfully');
        };
      }
    },
  
    async deleteAll(userid) {
      console.log('inDelete')
      if (!userid) throw "You must provide an id to search for user";
      console.log('inDelete')
      if(await userData.get(userid) == 0){ throw "No this user" }/////////

      if(userid.constructor != objId ){
        if(userid.constructor == String ){
          if(objId.isValid(userid)){
            var userobj = new objId(userid)
           
            const userCollection = await users();
          
            var updatedUser = {
              $set:{
                  "cart":[]
              }
            }
        
            var updatedInfo = await userCollection.updateOne({ _id: userobj}, updatedUser);
            //get user after update 
            const user = userCollection.findOne({ _id: userobj});

            
                console.log('Delete item successfully');
                return user;///////////
          
          
          }else{
            throw "It is not a valid id"
          }
        }else{
          throw "Please input Id as object Id or string"
        }
      }else{
        const userCollection = await users();
        

        var updatedUser = {
          $set:{
              "cart":[]
          }
        }
    
        var updatedInfo = await userCollection.updateOne({ _id: userobj}, updatedUser);
        //get user after update 
        const user = userCollection.findOne({ _id: userid});
        console.log('Delete item successfully');
        return user;///////////
      }
    }

  };