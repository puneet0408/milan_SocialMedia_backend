import { Feed } from "../Model/Feed.js";

export const createFeed = (req, res) => {
  const feed = new Feed(req.body);
  feed
    .save()
    .then((doc) => res.status(200).json(doc))
    .catch((err) => res.status(401).json(err));
};

export const fetchAllFeed = async (req, res) => {
  const feed = await Feed.find();
  res.json(feed);
};

export const fetchAllFeedsByUser = async (req, res) => {
  const { id } = req.params;
  try {
    const feed = await Feed.find({ userId: id });
    res.status(200).json(feed);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const fetchFeedById = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const feed = await Feed.findById(id);
    res.status(200).json(feed);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const DeleteFeed = async (req, res) => {
  console.log(req.body);
  const { id } = req.params;
  try {
    const doc = await Feed.findOneAndDelete({ _id: id });
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

export const UpdateFeed = async (req, res) => {
  const { id } = req.params;
  try {
    if (req.body.likeCount) {
      const existingFeed = await Feed.findOne({
        _id: id,
        "likeCount.userId": req.body.likeCount.userId,
      });

      if (existingFeed) {
        const result = await Feed.updateOne(
          { _id: id, "likeCount.userId": req.body.likeCount.userId },
          {
            $pull: { likeCount: { userId: req.body.likeCount.userId } },
          }
        );
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
        res.status(200).json(doc);
        return;
      }
    } else if (req.body.Comment) {
      const doc = await Feed.findOneAndUpdate(
        { _id: id },
        {
          $push: { Comment: req.body.Comment },
        },
        {
          new: true,
        }
      );
      res.status(200).json(doc._id);
      return;
    } else {
      const doc = await Feed.findOneAndUpdate({ _id: id }, req.body, {
        new: true,
      });
      res.status(200).json(doc);
      return;
    }
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
};
