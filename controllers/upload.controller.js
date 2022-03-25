const UserModel = require("../models/user.model");
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);
const { uploadErrors } = require("../utils/errors.utils");

module.exports.uploadProfil = async (req, res) => {
 console.log(req.file)
	try {
	  if (
		        req.file.mimetype != "image/jpg" &&
		        req.file.mimetype != "image/png" &&
		        req.file.mimetype != "image/jpeg"
		      )
			      throw Error("invalid file");
		if (req.file.size > 500000) throw Error("max size");
  } catch (err) {
    const errors = uploadErrors(err);
    return res.status(201).json({ errors });
  }
  const fileName = req.body.name + ".jpg";

  await pipeline(
  req.file.stream,
    fs.createWriteStream(
      `${__dirname}/../public/uploads/profil/${fileName}`
    )
  );

  try {
    await UserModel.findByIdAndUpdate(
      req.body.userId,
        { $set: { picture: "./uploads/profil/" + fileName } },
        { new: true, upsert: true, setDefaultsOnInsert: true })
        console.log(req.body.useId) .then((data) => res.send(data))
        .catch((err) => res.status(500).send({ message: err }));
        
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};
