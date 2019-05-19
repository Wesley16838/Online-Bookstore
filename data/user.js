const mongoCollections = require("../mongoCollections");
const users = mongoCollections.users;
const objId = require('mongodb').ObjectID;
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {

    //////// Get user by ID ////////
    async get(id) {
        if (!id) throw "You must provide an id to search for";
          if(id.constructor != objId){
            if(id.constructor == String){
              if(objId.isValid(id)){
                var obj = new objId(id)
                const userCollection = await users();
                const user = await userCollection.findOne({_id:obj})
               
                if (user.length === 0) throw "No user with that id";
                return user;
              }else{
                throw "It is not a valid id"
              }
            }else{
              throw "Please input Id as object Id or string"
            }
          }else{
            const userCollection = await users();
            const user = await userCollection.findOne({_id:id})
      
            if (user.length === 0) throw "No user with that id";
            return user;
          }
        },

    //////// Log in ////////
    async login(email, password){
      if (!email || typeof email != 'string') throw "You must provide a string of email";
      if (!password || typeof password != 'string') throw "You must provide a string password";

        var obj = {}
        const userCollection = await users();
        var user = await userCollection.find({ email: email }).toArray()
        if(user.length < 1){
            throw "Email or Password doesn\'t exist!"
            
        }
   
        var tmp = await bcrypt.compare(password, user[0].hashedPassword).then(function (data) {return data}).catch(e=> {throw e;});
    
        if(tmp != true){
            throw "Email or Password doesn\'t exist!"
        }else{
            const token = jwt.sign({
                email: user[0].email,
                userId: user[0]._id
            },
            process.env.JWT_KEY,
                {
                    expiresIn: "1h"
                }
            )
            obj["token"]=token
            obj["user"]=user
         
            return obj  
        }
    },

    //////// Sign up ////////
    async create(firstName,lastName, phoneNumber, email, password) {
       
        if (!firstName|| typeof firstName != 'string') throw "You must provide a string of first name";
    
        if (!lastName|| typeof lastName != 'string') throw "You must provide a string of last name";

        if (!phoneNumber || typeof phoneNumber != 'string') throw "You must provide a number of phone number";

        if (!email|| typeof email != 'string') throw "You must provide a string of email";
    
        if (!password|| typeof password != 'string') throw "You must provide a string of password";
       
        const userCollection = await users();
     
        var checkExist = await userCollection.find({email: email}).toArray();

        if(checkExist.length>=1){
           throw "Mail exists"
        }else{
 
        
            var tmp = await bcrypt.hash(password, 10).then(function (data) {return data}).catch(e=> {throw e;});
            let newUser = {
                firstName: firstName,
                lastName: lastName,
                phoneNumber: phoneNumber,
                email: email,
                hashedPassword: tmp,
                order:[],
                paymentMethod:[],
                address:[],
                cart:[]
                };
                const insertInfo = await userCollection.insertOne(newUser);
                if (insertInfo.insertedCount === 0) throw "Could not add user";

                const newId = insertInfo.insertedId;
                const user = await this.get(newId);

                return user
           
        } 
      },
      //////// Create address ////////
      async createAddress(id, address, city, state, zip, country) {
      
        if (!address|| typeof address != 'string') throw "You must provide a string of address";
    
        if (!city|| typeof city != 'string') throw "You must provide a string of city";

        if (!state || typeof state != 'string') throw "You must provide a string of state";

        if (!zip|| typeof zip != 'string') throw "You must provide a string of email";
    
        if (!country|| typeof country != 'string') throw "You must provide a string of password";
  
        if (!id) throw "You must provide an id to search for";
        
        if(id.constructor != objId){
          if(id.constructor == String){
            if(objId.isValid(id)){
              var obj = new objId(id)
              const userCollection = await users();
           
              var updatedUser = {
                $push:{
                    address:{ 
                        address:address, 
                        city:city,
                        state:state,
                        zip:zip,
                        country:country 
                    }
                }
            };
          
            
            var updatedInfo = await userCollection.updateOne({ _id: obj }, updatedUser);
      
            const user = await userCollection.findOne({_id:obj})
              if (updatedInfo.modifiedCount === 0) {
                throw "could not update successfully";
              }else{
                console.log('Update address successfully');
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
             
            var updatedUser = {
              $push:{
                  address:{ 
                      address:address, 
                      city:city,
                      state:state,
                      zip:zip,
                      country:country 
                  }
              }
          };
          var updatedInfo = await userCollection.updateOne({ _id: id}, updatedUser);
          const user = await userCollection.findOne({_id:id})
            if (updatedInfo.modifiedCount === 0) {
              throw "could not update successfully";
            }else{
              console.log('Update address successfully');
              return user;
            }
          if (user.length === 0) throw "No user with that id";
          return user;
        }
      },
      async createPayment(id,number, name, year, month) {
       
         if (!number|| typeof number != 'string') throw "You must provide a card number";
     
         if (!name|| typeof name!= 'string') throw "You must provide your name on the card";
 
         if (!year || typeof year != 'string') throw "You must provide year";
 
         if (!month|| typeof month != 'string') throw "You must provide month";
    
       
         if (!id) throw "You must provide an id to search for";
         if(id.constructor != objId){
           if(id.constructor == String){
             if(objId.isValid(id)){
               var obj = new objId(id)
               const userCollection = await users();
               
               var updatedUser = {
                 $push:{
                     paymentMethod:{ 
                         cardNumber:number, 
                         cardUser:name,
                         year:year,
                         month:month
                     }
                 }
             };
            
             
             var updatedInfo = await userCollection.updateOne({ _id: obj }, updatedUser);
        
             const user = await userCollection.findOne({_id:obj})
               if (updatedInfo.modifiedCount === 0) {
                 throw "could not update successfully";
               }else{
                 console.log('Update address successfully');
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
              
             var updatedUser = {
               $push:{
                paymentMethod:{ 
                    cardNumber:number, 
                    cardUser:name,
                    year:year,
                    month:month
                }
               }
           };
           var updatedInfo = await userCollection.updateOne({ _id: id}, updatedUser);
           const user = await userCollection.findOne({_id:id})
             if (updatedInfo.modifiedCount === 0) {
               throw "could not update successfully";
             }else{
               console.log('Update address successfully');
               return user;
             }
           if (user.length === 0) throw "No user with that id";
           return user;
         }
       }
}