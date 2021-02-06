import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";

import Bidding from "../models/biddingModel.js";
import nodemailer from "nodemailer";

export const getProducts = asyncHandler(async (req, res, next) => {
  const pageSize = 100;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .populate("user")
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  console.log(count);

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

export const userStoreProducts = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const storeId = req.params.storeId;
  console.log("userId = " + userId);
  console.log("storeId = " + storeId);

  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({
    ...keyword,
    user: userId,
    storeId: storeId,
  })
    .populate("user")
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  console.log(count);
  console.log(products);
  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

export const getTopProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);
  res.json(products);
});

export const getProductsById = asyncHandler(async (req, res) => {
  let product;
  try {
    product = await Product.findById(req.params.id).populate("user");
    console.log(product);
    res.json(product);
  } catch (error) {
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
  }
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: "Sample name",
    price: 0,
    user: req.user._id,
    image: "../../../assets/images/sample.jpg",
    brand: "Sample brand",
    category: "Sample category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample description",
    biddingProduct: false,
    storeId: req.body.storeId,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.remove();
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

export const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStocks,
    biddingProduct,
  } = req.body;

  console.log("Stock = Count", countInStocks);

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image ? image : product.image;
    product.brand = brand;
    product.category = category;
    product.countInStocks = countInStocks;
    product.biddingProduct = biddingProduct || false;

    const bid = await Bidding.findOne({ product: product._id });
    if (bid) {
      bid.isActive = biddingProduct;
      if (bid.isActive == false) {
        bid.startDate = new Date().toISOString();
        bid.endDate = new Date().toISOString();
        bid.save();
      } else {
        bid.save();
      }
    }
    console.log(product);

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

export const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating = (
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length
    ).toFixed(2);

    await product.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

export const getProductsByUser = asyncHandler(async (req, res) => {
  console.log(req.params.id);
  console.log(req.params.storeId);

  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const count = await Product.countDocuments({
    user: req.params.id,
    storeId: req.params.storeId,
    ...keyword,
  });
  const products = await Product.find({
    user: req.params.id,
    storeId: req.params.storeId,
    ...keyword,
  })
    .populate("user")
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  console.log(count);
  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// createOrUpdateProductBid  bid
export const createOrUpdateProductBid = asyncHandler(async (req, res) => {
  try {
    const bid = await Bidding.findOne({ product: req.params.id });
    console.log(bid);

    if (bid && req.body.status && req.body.status === "update") {
      console.log("update bid API");
      bid.isActive = req.body.isActive;
      await bid.save();
      res.send(200).json(bid);
    } else if (bid) {
      console.log(req.body.startDate);
      console.log(req.body.endDate);
      console.log(req.body.bidStartingPrice);
      console.log(req.body.isActive);

      console.log(bid.startDate);
      console.log(bid.endDate);
      console.log(bid.bidStartingPrice);
      console.log(bid.isActive);

      bid.startDate = req.body.startDate.toString();
      bid.endDate = req.body.endDate.toString();
      bid.bidStartingPrice = req.body.bidStartingPrice;
      bid.isActive = req.body.isActive;
      // bid.bidders.push(req.body.bidders[0]);
      bid.save();
      if (
        bid.bidders.length > 0 &&
        bid.bidders[0].bidPrice < req.body.bidders[0].bidPrice
      ) {
        bid.bidders.unshift(req.body.bidders[0]);
        const bidd = await bid.save();

        res.status(201).json(bidd);

        // res.json(bid);
      } else {
        // bid.save();
        res.status(404).send({
          message: `bid should be higher than - ${bid.bidders[0].bidPrice}`,
        });
      }
    } else {
      console.log(req.body);

      const bidding = new Bidding({
        ...req.body,
      });

      const bidd = await bidding.save();
      res.status(201).json(bidd);
    }
  } catch (error) {
    // if (!bid) {
    //   res.status(404);
    //   throw new Error("Product not found");
    // }
  }
});

export const endBid = asyncHandler(async (req, res) => {
  const id = req.params.id;
  console.log(req.body);
  const bid = await Bidding.findOne({ product: req.params.id }).populate(
    "product bidders.user"
  );
  console.log(bid);

  if (bid && req.body.status && req.body.status === "update") {
    bid.isActive = req.body.isActive;
    // bid.bidders[0].mailSent = true;
    let updatedBid;
    const mail = bid.bidders.length > 0 ? bid.bidders[0].mailSent : true;
    console.log("---" + mail);
    if (!mail) {
      console.log("mail sent " + mail);
      console.log(bid.bidders[0].user.email);
      console.log("Sending mail to = " + bid.bidders[0].user);
      let obj = {
        link: `http://localhost:4200/product/${id}`,
        time: new Date().toISOString(),
        mail: bid.bidders[0].user.email,
      };

      await bid.save();

      main(JSON.stringify(obj)).catch(console.error);
      // bid.bidders[0].mailSent = true;
      console.log("------------------");
      console.log(bid.bidders[0]);
      console.log(bid.bidders.length);
      if (bid.bidders.length > 0) {
        for (let i = 0; i < bid.bidders.length; i++) {
          bid.allBids.push({
            user: bid.bidders[i].user,
            bidPrice: bid.bidders[i].bidPrice,
            date: bid.bidders[i].date,
            mailSent: bid.bidders[i].mailSent,
            googleUser: bid.bidders[i].googleUser,
          });
        }
      }

      console.log("------------------");

      // after mail sent , remove all bidders
      bid.bidders = [];
      updatedBid = await bid.save();

      const product = await Product.findById(req.params.id);
      if (product) {
        console.log("Product found");
        console.log(product);
        product.biddingProduct = false;
        await product.save();
      }

      res.status(200).send({
        updatedBid,
        message: "Bid updated successfully",
        mailTo: bid.bidders[0].user.email,
      });
    }
    // send mail to user
  } else {
    console.log("else part");
  }
});

export const getProductBiddingDetail = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const product = await Bidding.findOne({ product: id }).populate("user");
  if (!product) {
    res.status(404);
    throw new Error("Bidding Product not found");
  } else {
    res.status(200).send({ product });
  }
});

export const placeBid = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (req.body.googleUser) {
    console.log("Google User = " + req.user);
    req.body.bidders[0].googleUser = req.user;
  }

  const bid = await Bidding.findOne({ product: req.params.id });
  if (bid.bidders.length === 0) {
    console.log("First bid");
    bid.bidders.unshift(req.body.bidders[0]);
    const bidd = await bid.save();
    res.status(201).json(bidd);
  } else if (
    bid.bidders.length > 0 &&
    bid.bidders[0].bidPrice < req.body.bidders[0].bidPrice
  ) {
    bid.bidders.unshift(req.body.bidders[0]);
    const bidd = await bid.save();
    res.status(201).json(bidd);

    // res.json(bid);
  } else {
    // bid.save();
    res.status(404).send({
      message: `bid should be higher than - ${bid.bidders[0].bidPrice}`,
    });
  }
});

// send mail

// async..await is not allowed in global scope, must use a wrapper
async function main(dataa) {
  console.log(dataa);

  let data = JSON.parse(dataa);
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "mohitproshop@gmail.com", // generated ethereal user
      pass: "proshop@123#", // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: "mohitproshop@gmail.com", // sender address
    to: data["mail"], // list of receivers
    subject: "Hello ✔", // Subject line
    // text: data, // plain text body
    html: `<a href='${data["link"]}'> Click to purchase </a>
    <br>
    Link Expires at  - ${data["time"]} `, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
