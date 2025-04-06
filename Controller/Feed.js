import { Feed } from "../Model/Feed.js";
import asyncerrorHandler from "../utils/asyncerrorHandler.js";
import CustomError from "../utils/customError.js";

export const createFeed = asyncerrorHandler(async (req, res, next) => {
  const feed = await Feed.create(req.body);
  console.log(feed, "comming data");
  res.status(201).json({
    status: "success",
    data: {
      feed,
    },
  });
});

// export const fetchAllFeed = asyncerrorHandler(async (req, res , next) => {

//   let feed = await Feed.find();

//   const page = req.query.page*1 || 1;
//   const limit = req.query.limit*1 || 10;
//   // initally skip   page = 1 (1-1) * 10 = 0
//   // page = 2 (2-1) * 10 = 10
//   const skip = (page-1) * limit;
//   feed = feed.skip(skip).limit(limit);

//   if(req.query.page){
//     const movieCount = Feed.countDocuments();
//     if(skip >= movieCount){
//       throw new Error("no more post avaailble");
//     }
//   }

//   res.json(feed);

// });

export const fetchAllFeed = asyncerrorHandler(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;
  let feedQuery = Feed.find().skip(skip).limit(limit);
  const feed = await feedQuery;

  const feedCount = await Feed.countDocuments();
  if (req.query.page && skip >= feedCount) {
    return res.status(400).json({ error: "No more posts available" });
  }
  res.json(feed);
});

export const fetchAllFeedsByUser = asyncerrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const feed = await Feed.find({ userId: id });
  res.status(200).json(feed);
});

export const fetchFeedById = asyncerrorHandler(async (req, res, next) => {
  const { id } = req.params;

  const feed = await Feed.findById(id);

  if (!feed) {
    const error = new CustomError(`post not found!`, 404);
    return next(error);
  }

  res.status(200).json(feed);
});

export const DeleteFeed = asyncerrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const feed = await Feed.findOneAndDelete({ _id: id });
  if (!feed) {
    const error = new CustomError(`post not found!`, 404);
    return next(error);
  }
  res.status(200).json(feed);
});

export const UpdateFeed = asyncerrorHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.likeCount) {
    const existingFeed = await Feed.findOne({
      _id: id,
      "likeCount.userId": req.body.likeCount.userId,
    });

    if (existingFeed) {
      console.log(existingFeed, "existing");
      const result = await Feed.updateOne(
        { _id: id, "likeCount.userId": req.body.likeCount.userId },
        {
          $pull: { likeCount: { userId: req.body.likeCount.userId } },
        }
      );
      const updatedFeed = await Feed.findById(id);
      return res.status(200).json(updatedFeed);
    } else {
      const doc = await Feed.findOneAndUpdate(
        { _id: id },
        {
          $push: { likeCount: req.body.likeCount },
        },
        {
          new: true,
        }
      );
      if (!doc) {
        const error = new CustomError(`post not found!`, 404);
        return next(error);
      }
      console.log(doc, "final response");
      res.status(200).json(doc);
      return;
    }
  } else if (req.body.Comment) {
    const updatedFeed = await Feed.findOneAndUpdate(
      { _id: id },
      { $push: { Comment: req.body.Comment } },
      { new: true }
    );
    if (!updatedFeed) {
      return next(new CustomError("Post not found!", 404));
    }
    console.log(updatedFeed, "comment added");
    return res.status(200).json(updatedFeed);
  } else {
    const doc = await Feed.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    if (!doc) {
      const error = new CustomError(`post not found!`, 404);
      return next(error);
    }
    res.status(200).json(doc);
    return;
  }
});
