import jwt from "jsonwebtoken";

// doctor authentication middleware
const authDoctor = async (req, res, next) => {
  try {
    const { dtoken } = req.headers;
    if (!dtoken) {
      return res.json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }
    // console.log("yaha aa gye")
    const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET);
    req.body = req.body || {};
    req.body.docId = token_decode.id;
    next();
    // console.log("yaha bhi aa gye")
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


export default authDoctor;