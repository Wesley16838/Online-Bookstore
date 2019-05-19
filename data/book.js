const mongoCollections = require("../mongoCollections");
const books = mongoCollections.books;
const objId = require('mongodb').ObjectID;
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {
 //////// Get book by ID ////////
    async get(id) {
        
        if (!id) throw "You must provide an id to search for";
       
        if(id.constructor != objId){
            if(id.constructor == String){
            if(objId.isValid(id)){
               
                var obj = new objId(id)
                const bookCollection = await books();
               
                const book = await bookCollection.findOne({_id:obj})
                
                if (book.length === 0) throw "No book with that id";
                return book;
            }else{
                throw "It is not a valid id"
            }
            }else{
            throw "Please input Id as object Id or string"
            }
        }else{
            const bookCollection = await books();
            const book = await bookCollection.findOne({_id:id})
            if (book.length === 0) throw "No book with that id";
            return book;
        }
    },
    //////// Upload books ////////
    async create(bookName,bookAuthor, bookPublisher, bookDescription, bookGenre, bookPrice, bookISBN, bookImage, bookType, bookLanguage,bookPublishTime, bookSeries) {
       
        if (!bookName|| typeof bookName != 'string') throw "You must provide a string of book name";
    
        if (!bookAuthor|| typeof bookAuthor != 'string') throw "You must provide a string of book name";

        if (!bookPublisher || typeof bookPublisher != 'string') throw "You must provide a string of book Publisher";

        if (!bookDescription|| typeof bookDescription != 'string') throw "You must provide a string of book Description";
    
        if (!bookGenre || typeof bookGenre != 'object') throw "You must provide book genre";
       
        if (!bookPrice|| typeof bookPrice != 'string') throw "You must provide book price";

        if (!bookISBN|| typeof bookISBN != 'string') throw "You must provide a book ISBN";

        if (!bookType|| typeof bookType != 'string') throw "You must provide a book type";

        if (!bookLanguage|| typeof bookLanguage != 'string') throw "You must provide a book language";

        if (!bookPublishTime|| typeof bookPublishTime != 'string') throw "You must provide a book publish time";

        if (!bookSeries || typeof bookSeries != 'string') throw "You must provide book series";

        if (!bookImage) throw "You must provide book images";
        
        const bookCollection = await books();
       
        var checkExist = await bookCollection.find({bookISBN: bookISBN}).toArray();
    
        if(checkExist.length>=1){

           throw "Book exists"

        }else{
           
            let newBook = {
                bookName: bookName,
                bookAuthor: bookAuthor,
                bookPublisher: bookPublisher,
                bookImage: bookImage,
                bookDescription: bookDescription,
                bookGenre: bookGenre,//Array
                bookPrice:bookPrice,
                bookISBN:bookISBN,
                bookUpload:new Date(Date.now()),/////// time\
                bookType: bookType,
                bookLanguage: bookLanguage,
                bookPublishTime: new Date(bookPublishTime),
                bookSeries: bookSeries
                };
            
                const insertInfo = await bookCollection.insertOne(newBook);

                if (insertInfo.insertedCount === 0) throw "Could not add user";

                const newId = insertInfo.insertedId;
                const book = await this.get(newId);
              

                return book
           
        } 
      },
      async getSeries(series) {
        if (!series || typeof series != 'string') throw "You must provide a series search for";
        
            const bookCollection = await books();
            const book = await bookCollection.find({bookSeries: series}).sort({bookPublishTime:1}).toArray();
            if (book.length === 0) throw "No book with that series";
            return book;
        
    },
    async getFourSeries(series) {
        if (!series || typeof series != 'string') throw "You must provide a series search for";
        
            const bookCollection = await books();
            const book = await bookCollection.find({bookSeries: series}).sort({bookPublishTime:1}).limit(4).toArray();
            if (book.length === 0) throw "No book with that series";
            return book;
        
    },
    async getByKeyword(keyword) {/////Search box
        if (!keyword || typeof keyword != 'string') throw "You must provide a keyword";
     
            
           
            let key = new RegExp('.*' + keyword + '.*', 'i');
            
            const bookCollection = await books();
            const book = await bookCollection.find({$or: 
                [
                    {bookName: key},
                    {bookAuthor: key},
                    {bookPublisher: key},
                    {bookSeries: key}
                ]
            }).toArray();
           
          
            return book;
        
    },
    async getAll() {
 
          const bookCollection = await books();
   
          
          const book = await bookCollection.find().toArray();

        
          if (book.length === 0) throw "No book found";
          
          return book;
      
  }
}