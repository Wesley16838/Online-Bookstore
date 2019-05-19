const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.user;
const cartData = data.cart
const bookData = data.book;
const orderData = data.order;
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const checkAuth = require('../middleware/check_auth')
const checkCookie = require('../middleware/check_cookie')
var errarr;

router.get("/signup", checkCookie, async (req, res) => {
  console.log("sign up")
 

  res.status(200).render("Component/signup", {

    title:"Signup Page",
 
  });
});
router.get("/dashboard", checkAuth, async (req, res) => {
  console.log("4");
  console.log("dashboard")
  const userId = req.cookies.userid;
  const userInfo = await userData.get(userId)
  const orderInfo = await orderData.getById(userId);
  // console.log(orderInfo)
  var total = 0;
  var arr=[];
  var empty = false;
  for(var i = 0; i < userInfo.cart.length; i++){
    
    total = total + userInfo.cart[i].qty;
  
  }

  var arr1 = [];
  for(var i = 0; i < orderInfo.length; i++){
    var obj ={};
    var month = orderInfo[i].date.getUTCMonth() + 1; //months from 1-12
    var day = orderInfo[i].date.getUTCDate();
    var year = orderInfo[i].date.getUTCFullYear();
    var newdate = year + "/" + month + "/" + day;
    orderInfo[i].payment =  "Visa end in "+orderInfo[i].payment.substring(15,19)
    orderInfo[i].date = newdate
    
    
    for(var j = 0; j< orderInfo[i].content.length; j++){
      var orderitem = await bookData.get(orderInfo[i].content[j].id);
      console.log(orderInfo[i].content[j].id)
      orderInfo[i].content[j].id = orderitem
    }
    
  }
  console.log(arr1)

  for(var j = 0; j < userInfo.paymentMethod.length; j++){
    var obj={};
    obj['cardNumber']=userInfo.paymentMethod[j].cardNumber.substring(15,19);
    obj['username']=userInfo.paymentMethod[j].cardUser;
    arr.push(obj)
  }

  var data =  {
    title:"Dashboard Page",
    userid:userId,
    cartTotal: total,
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
    phonenumber: userInfo.phoneNumber,
    email: userInfo.email,
    addresses:userInfo.address,
    payment: arr,
    order: orderInfo
  }
  
  
  
   if(errarr != undefined){
    data['hasErrors']=true;
    data['error']=errarr;
    errarr = [];

   }



  res.status(200).render("Component/dashboard",data);
});

router.post("/add/order", async (req, res) => {

  try{

    const address = req.body.shippingaddress;

    const payment = req.body.paymentmethod;

    const userId = req.cookies.userid;

    //get user
    const userInfo = await userData.get(userId);
    console.log('next');
    const content = userInfo.cart;
    console.log('next1');
    const addInfo = await orderData.createOrder(userId, content, address, payment);//createOrder(userid, content, address, payment)
    console.log('next2');
    var total = 0;

    for(var i = 0; i < userInfo.cart.length; i++){
      
      total = total + userInfo.cart[i].qty;
    
    }

    res.status(200).render('Component/success',{
      title: 'Successful Page',
      cartTotal: total,
      firstName: userInfo.firstName
    })

  }catch(e){
    const userId = req.cookies.userid;
    
    errarr=[]
    errarr.push(e)

    res.status(400).redirect("/user/cart/"+userId); 
  }
});

router.post("/cart/add/", async (req, res) => {
 
  try{
    var total = 0;
    console.log("inCart");
    const bookId = req.query.bookId;
    console.log("1");
    const userId = req.cookies.userid;
    console.log("2");
    const quantity = parseInt(req.body.quantity);
    console.log(quantity);
    console.log(typeof quantity);
    const addInfo = await cartData.addItem(userId, bookId, quantity);
    for(var i = 0; i < addInfo.cart.length; i++){
      total = total + addInfo.cart[i].qty
    }
    res.status(200).redirect("/user/cart/"+userId);
 
  }catch(e){
    const userId = req.cookies.userid;
    errarr=[]
    errarr.push(e)

    res.status(400).redirect("/user/cart/"+userId); 
 
  }
});


router.get("/cart/:userid", async (req, res) => {
  console.log("cart");
  try{
    var arr = [];
    var arr1=[]
    
    var bookInfo;
    var bookTotal=0;
    var eachtotal;
    const id = req.params.userid;
    const userid = req.cookies.userid;
    if(userid != id) throw "Error id"
    console.log("inCart");
    var total = 0;
    console.log(id)
    const userInfo = await userData.get(id)
    var empty = false;
    
    for(var i = 0; i < userInfo.cart.length; i++){
      eachtotal = 0;
      total = total + userInfo.cart[i].qty;
      bookInfo = await bookData.get(userInfo.cart[i].id);
      
      eachtotal = parseFloat(bookInfo.bookPrice)*userInfo.cart[i].qty
      bookTotal = bookTotal + eachtotal
      bookInfo['bookQuantity'] = userInfo.cart[i].qty
      bookInfo['eachTotal'] = eachtotal.toFixed(2);
      arr.push(bookInfo)
    }

    for(var j = 0; j < userInfo.paymentMethod.length; j++){
    var obj1 = {};
     obj1['number']=userInfo.paymentMethod[j].cardNumber.substring(15,19);
     obj1['cardnumber']=userInfo.paymentMethod[j].cardNumber
     arr1.push(obj1)
    }
   if(total ==0){
     empty = true
   }
     var data = {
    title:"Cart",
    userid:userid,
    cartTotal: total,
    firstName: userInfo.firstName,
    books:arr,
    bookTotal: bookTotal.toFixed(2),
    addresses:userInfo.address,
    payments: arr1,
    empty: empty
  }
  
  
 
   if(errarr != undefined){
    data['hasErrors']=true;
    data['error']=errarr;
    errarr = [];

   }
    res.status(200).render("Component/cart",data)
  }catch(e){
    res.status(400).redirect('/homepage')
  }
});

router.post("/cart/delete/:bookId", async (req, res) => {///delete
  console.log("cart");
  try{
    var arr = [];
    var bookInfo;
    var total = 0;
    var bookTotal;
    console.log("inCart");
    const bookId = req.params.bookId;
    console.log(bookId)

    const userId = req.cookies.userid;
    console.log(userId)

    const deleteInfo = await cartData.delete(userId, bookId);
    const userInfo = await userData.get(userId)
    console.log('test')
    for(var i = 0; i < userInfo.cart.length; i++){
      bookTotal = 0;
      total = total + userInfo.cart[i].qty
      bookInfo = await bookData.get(userInfo.cart[i].id);
      bookTotal = bookTotal + bookInfo.bookPrice
      bookInfo['bookQuantity'] = userInfo.cart[i].qty
      bookInfo['bookTotal'] = bookTotal;
      arr.push(bookInfo)
    }

    console.log(arr)
    console.log('test1')
 

    res.status(200).redirect("/user/cart/"+userId)

  }catch(e){
    const userId = req.cookies.userid;
    errarr=[]
    errarr.push(e)

    res.status(400).redirect("/user/cart/"+userId); 
  }
});

///Update quantity
router.post("/cart/update/:bookId", async (req, res) => {
  console.log("Updatecart");
  try{
    var arr = [];
    var bookInfo;
    var total = 0;
    var bookTotal;
    console.log("inCart");
    const bookId = req.params.bookId;
    console.log(bookId)
    const quantityString = req.body.quantity;
    // console.log(req.body);
    // console.log(typeof quantity);
    const quantity = parseInt(quantityString);
    const userId = req.cookies.userid;
    console.log(userId)

    const deleteInfo = await cartData.updateItem(userId, bookId, quantity);
    const userInfo = await userData.get(userId)
    console.log('test')
    for(var i = 0; i < userInfo.cart.length; i++){
      bookTotal = 0;
      total = total + userInfo.cart[i].qty
      bookInfo = await bookData.get(userInfo.cart[i].id);
      bookTotal = bookTotal + bookInfo.bookPrice
      bookInfo['bookQuantity'] = userInfo.cart[i].qty
      bookInfo['bookTotal'] = bookTotal;
      arr.push(bookInfo)
    }

    console.log(arr)
    console.log('test1')
 

    res.status(200).redirect("/user/cart/"+userId)
    // res.status(200).json({
    //   user:userInfo
    // })
  }catch(e){
    const userId = req.cookies.userid;
    errarr=[]
    errarr.push(e)

    res.status(400).redirect("/user/cart/"+userId); 
  }
});

router.post("/signup", async (req, res) => {
  try{
 console.log(req.body)
        if(req.body.firstname ==  '' || req.body.lastname == '' || req.body.phonenumber == '' || req.body.email == '' || req.body.pwd == '') throw 'Please fill all fields'
       
        if(req.body.pwd != req.body.comfirm) throw "Password doesn't match"
   
        //test illegal email
        var mail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        if(!mail.test(req.body.email)) throw "email format is not correct"

        //test illegal phone number
        var phoneno = /^\d{10}$/;
        if(!req.body.phonenumber.match(phoneno)) throw "Phone number format is not correct"
   
        
        //test illegal first name and last name
        var format_name = /[!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?]/;
        if(format_name.test(req.body.firstname) || format_name.test(req.body.lastname)) throw "Don't contain special character like !@#$%^&*.,<>/\'\";:? in firstname or lastname";
   
        //test illegal password format
        var format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
        if(format.test(req.body.pwd)) throw "Don't contain special character like !@#$%^&*.,<>/\'\";:? in password";
   
        const user = await userData.create(req.body.firstname, req.body.lastname, req.body.phonenumber, req.body.email, req.body.pwd)
        const token = jwt.sign({/////////put tolen in the data
          email: user.email ,
          userId: user._id
        },
        process.env.JWT_KEY,
            {
                expiresIn: "1h"
            }
        )
   
        res.cookie('token', token);
        res.cookie('userid', user._id);
     
        res.status(200).redirect("/homepage")     
        // res.status(200).render("Component/homepage", {
        //   title:"Home Page",
        //   user: user
        // })    
      
  }catch(e){
      res.status(400).render("Component/signup",{
          hasErrors: true,
          error : e,
      })
      // res.status(400).json({
      //   error:e
      // })
  }
});

router.get("/login", checkCookie,async (req, res) => {
  console.log("log in")
  res.status(200).render("Component/login", {
    title:"Log In Page"
  });
});

router.post("/login", async (req, res) => {
  try{
    console.log(req.body)
      if(req.body.email ==  '' || req.body.pwd ==  '' ) throw 'Please fill all fields'
        
        const user = await userData.login(req.body.email, req.body.pwd)
       
        
        res.cookie('token', user['token']);
        res.cookie('userid', user['user'][0]._id);
        res.status(200).redirect("/homepage")     
      
    
       
      
  }catch(e){
      res.status(400).render("Component/login",{
          hasErrors:true,
          error : e,
      })
      // res.status(400).json({
      //   error:e
      // })
  }
});

//////Update address
router.post("/update/address", async (req, res) => {
  console.log("cart");
  try{
  
    console.log("inAddress");
    console.log(req.body);
    const userId = req.cookies.userid;
    // const userId = req.params.userid;
    console.log(userId)

    const uodateInfo = await userData.createAddress(userId, req.body.address, req.body.city, req.body.state, req.body.zip, req.body.country) ;
    const userInfo = await userData.get(userId)
    console.log('test')
   
    res.status(200).redirect("/user/dashboard")
    // res.status(400).json({
    //   user:userInfo
    // })
  }catch(e){
    const userId = req.cookies.userid;
    errarr=[]
    errarr.push(e)

    res.status(400).redirect("/user/dashboard"); 
  }
});

router.post("/update/payment/", async (req, res) => {
  console.log("payment");
  try{
    console.log(req.body)
    const userId = req.cookies.userid;
    // const userId = req.params.userid;
    console.log(userId)
    const month =  req.body.expiration.substring(0,2)
    const year = req.body.expiration.substring(3,5)
    const uodateInfo = await userData.createPayment(userId, req.body.cardnumber, req.body.name, year, month) ;
    const userInfo = await userData.get(userId)
    console.log('test')
   
    res.status(200).redirect("/user/dashboard")
    // res.status(200).json({
    //   user:userInfo
    // })
  }catch(e){
    const userId = req.cookies.userid;
    errarr=[]
    errarr.push(e)

    res.status(400).redirect("/user/dashboard"); 
  }
});

///Update quantity
router.delete("/cart/delete", async (req, res) => {
  console.log("Deletecart");
  try{
    var arr = [];
 
    var total = 0;
    var bookTotal;
    console.log("inCart");
  
    const userId = req.cookies.userid;
    console.log(userId)

    const bookInfo = await cartData.deleteAll(userId)
    const userInfo = await userData.get(userId)
    console.log('test')
    for(var i = 0; i < userInfo.cart.length; i++){
      bookTotal = 0;
      total = total + userInfo.cart[i].qty
      bookInfo = await bookData.get(userInfo.cart[i].id);
      bookTotal = bookTotal + bookInfo.bookPrice
      bookInfo['bookQuantity'] = userInfo.cart[i].qty
      bookInfo['bookTotal'] = bookTotal;
      arr.push(bookInfo)
    }

    console.log(arr)
    console.log('test1')
 

    res.sendStatus(200)
    
  }catch(e){
    const userId = req.cookies.userid;
    errarr=[]
    errarr.push(e)

    res.status(400).redirect("/user/cart"+userId); 
  }
});

router.delete("/order/delete/:orderid", async (req, res) => {
 
  try{
    
    console.log("inCart");
   
    console.log("1");
    const userId = req.cookies.userid;
    console.log("2");
    const orderId = req.params.orderid;
    console.log("2.5");
    const removeInfo = await orderData.removeOrder(orderId);
    console.log("3");
    res.sendStatus(200)
 
  }catch(e){
    const userId = req.cookies.userid;
    errarr=[]
    errarr.push(e)

    res.status(400).redirect("/user/dashboard/"); 
 
  }
});

module.exports = router;
