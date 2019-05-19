const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check_auth')
const checkCookie = require('../middleware/check_cookie')
const multer = require('multer')
const data = require("../data");
const bookData = data.book;
const userData = data.user;
const storage = multer.diskStorage({
      destination: function(req, file, cb){
          cb(null,'./uploads/')
      },
      filename: function(req, file, cb){
          cb(null,new Date().toISOString() + file.originalname)
      }
  })
const fileFilter = (req, file, cb)=>{
      if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/png'){
            cb(null, true)
      }else{
            cb(null, false)
      }
}
const upload = multer({
      storage:storage, 
      limits:{
          fileSize: 1024*1024*5
      },
      fileFilter: fileFilter
  })

//Create books
router.post('/', upload.single('bookImage'),async (req, res) => { //check_Auth after --> use array('bookImage',10) to upload multiple images 
try{
      
        if(typeof req.body.bookName !== 'undefined' && typeof req.body.bookAuthor !== 'undefined' && typeof req.body.bookPublisher !== 'undefined' && typeof req.body.bookDescription !== 'undefined' && typeof req.body.bookGenre !== 'undefined' && typeof req.body.bookPrice !== 'undefined' && req.body.bookISBN !== 'undefined' && req.file.path !== 'undefined' && req.body.bookType !== 'undefined' && req.body.bookLanguage !== 'undefined' && req.body.bookPublishTime !== 'undefined' && req.body.bookSeries !== 'undefined'){
           
          const book = await bookData.create(req.body.bookName, req.body.bookAuthor, req.body.bookPublisher, req.body.bookDescription, req.body.bookGenre, req.body.bookPrice, req.body.bookISBN, req.file.path, req.body.bookType, req.body.bookLanguage, req.body.bookPublishTime, req.body.bookSeries)
      
         
          res.status(200).json({
             message:"Create book successfully",
             book: book
            })
        }else{
          throw 'Please fill all fields'
        }
    }catch(e){
      //   res.status(400).render("Component/signup",{
      //       error : e,
      //   })
        res.status(400).json({
          error:e
        })
    }
    
     
});

//get book by keywork from search box
router.get("/search", checkAuth, async (req, res) => { //check_Auth
    try{
   
        var total = 0;
        const id = req.cookies.userid;
   
        const userInfo = await userData.get(id);
        for(var i = 0; i < userInfo.cart.length; i++){
          total = total + userInfo.cart[i].qty
        }
        var keyword = req.query.keyword;
      
        const book = await bookData.getByKeyword(keyword);//unify to convert to upper or lower
        res.status(200).render('Component/search',{
          title:"Search Page",
          cartTotal: total,
          firstName: userInfo.firstName,
          books: book,
          keyword: keyword,
          number:book.length,
          noErrors: true
         })
        
    }catch(e){
      var total = 0;
      const id = req.cookies.userid;
 
      const userInfo = await userData.get(id);
      for(var i = 0; i < userInfo.cart.length; i++){
        total = total + userInfo.cart[i].qty
      }
      var keyword = req.query.keyword;
      
      res.status(400).render('Component/search',{
        title:"Search Page",
        cartTotal: total,
        firstName: userInfo.firstName,
        keyword: keyword,
        hasErrors: true,
        error: e
       })
    }
    
     
});


//get book by id
router.get("/:id", checkAuth, async (req, res) => { //check_Auth
    try{
        var total = 0;
        const userid = req.cookies.userid;
      
        const userInfo = await userData.get(userid);
        for(var i = 0; i < userInfo.cart.length; i++){
          total = total + userInfo.cart[i].qty
        }
        const bookid = req.params.id;
        const book = await bookData.get(bookid);
        var month = book.bookPublishTime.getUTCMonth() + 1; //months from 1-12
        var day = book.bookPublishTime.getUTCDate();
        var year = book.bookPublishTime.getUTCFullYear();

        var newdate = year + "/" + month + "/" + day;
      
        // res.status(200).json({
        //     message:"Search all book successfully",
        //     book: book
        //    })
        res.status(200).render('Component/detail',{
        title:"Detail Page",
        cartTotal: total,
        userid:userInfo._id,
        firstName: userInfo.firstName,
        book: book,
        date:newdate
        })
    }catch(e){
        res.status(400).json({
            error:e
          })
    }
    
     
});

module.exports = router;