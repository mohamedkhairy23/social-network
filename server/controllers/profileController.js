import asyncHandler from "express-async-handler";
import Profile from "../models/profileModel.js";
import User from "../models/userModel.js";
import normalizeUrl from "normalize-url";
import request from "request";
import { response } from "express";

// @desc     GET Logged In User Profile
// @route    GET /api/profile/me
// @access   Private
const getLoggedInUserProfile = asyncHandler(async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      "name avatar"
    );

    if (!profile) {
      return res.status(400).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// @desc     Create or Update User Profile
// @route    Post /api/profile
// @access   Private
const createOrUpdateUserProfile = asyncHandler(async (req, res) => {
  const {
    website,
    skills,
    youtube,
    twitter,
    instagram,
    linkedin,
    facebook,
    // spread the rest of the fields we don't need to check
    ...rest
  } = req.body;

  // build a profile
  const profileFields = {
    user: req.user.id,
    website:
      website && website !== ""
        ? normalizeUrl(website, { forceHttps: true })
        : "",
    skills: Array.isArray(skills)
      ? skills
      : skills.split(",").map((skill) => " " + skill.trim()),
    ...rest,
  };

  // Build socialFields object
  const socialFields = { youtube, twitter, instagram, linkedin, facebook };

  // normalize social fields to ensure valid url
  for (const [key, value] of Object.entries(socialFields)) {
    if (value && value.length > 0)
      socialFields[key] = normalizeUrl(value, { forceHttps: true });
  }
  // add to profileFields
  profileFields.social = socialFields;

  try {
    // Using upsert option (creates new doc if no match is found):
    let profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: profileFields },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
});

// @desc     GET all profiles
// @route    GET /api/profile
// @access   Public
const getAllProfiles = asyncHandler(async (req, res) => {
  try {
    const searchQuery = req.query.search || "";
    const page = parseInt(req.query.page) || 1;

    let query = {};

    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, "i");
      query["$or"] = [
        { githubusername: searchRegex },
        { bio: searchRegex },
        { status: searchRegex },
      ];
    }

    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const profiles = await Profile.find(query)
      .populate("user", "name avatar")
      .skip(skip)
      .limit(pageSize)
      .lean();

    const total = await Profile.countDocuments(query);

    const response = {
      pagination: {
        total,
        page,
        pages: Math.ceil(total / pageSize),
      },
      data: profiles,
    };

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server Error");
  }
});

// @desc     GET profile by user ID
// @route    GET /api/profile/user/:user_id
// @access   Public
const getProfileByID = asyncHandler(async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", "name avatar");

    if (!profile) {
      return res.status(400).json({ msg: "Profile Not Found" });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.log(error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ msg: "Profile Not Found" });
    }
    return res.status(500).send("Server Error");
  }
});

// @desc     DELETE profile, user & posts
// @route    DELETE /api/profile
// @access   Private
const deleteProfile = asyncHandler(async (req, res) => {
  try {
    await Profile.findOneAndDelete({ user: req.user.id });
    await User.findOneAndDelete({ _id: req.user.id });

    res.status(200).json({ msg: "User deleted" });
  } catch (error) {
    console.log(error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ msg: "Profile Not Found" });
    }
    return res.status(500).send("Server Error");
  }
});

// @desc     PUT Add Profile Experience
// @route    PUT /api/profile/experience
// @access   Private
const addProfileExperience = asyncHandler(async (req, res) => {
  try {
    const { title, company, location, from, to, current, description } =
      req.body;

    const newExperience = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    const profile = await Profile.findOne({ user: req.user.id });

    profile.experience.unshift(newExperience);

    await profile.save();

    res.status(200).json(profile);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server Error");
  }
});

// @desc     DElETE Delete Profile Experience
// @route    DElETE /api/profile/experience/:exp_id
// @access   Private
const deleteProfileExperience = asyncHandler(async (req, res) => {
  try {
    const foundProfile = await Profile.findOne({ user: req.user.id });

    foundProfile.experience = foundProfile.experience.filter(
      (exp) => exp._id.toString() !== req.params.exp_id
    );

    await foundProfile.save();
    return res.status(200).json(foundProfile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error" });
  }
});

// @desc     PUT Add Profile Education
// @route    PUT /api/profile/education
// @access   Private
const addProfileEducation = asyncHandler(async (req, res) => {
  try {
    const { school, degree, fieldofstudy, from, to, current, description } =
      req.body;

    const newExperience = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    const profile = await Profile.findOne({ user: req.user.id });

    profile.education.unshift(newExperience);

    await profile.save();

    res.status(200).json(profile);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server Error");
  }
});

// @desc     DElETE Delete Profile Education
// @route    DElETE /api/profile/education/:edu_id
// @access   Private
const deleteProfileEducation = asyncHandler(async (req, res) => {
  try {
    const foundProfile = await Profile.findOne({ user: req.user.id });

    foundProfile.education = foundProfile.education.filter(
      (exp) => exp._id.toString() !== req.params.edu_id
    );

    await foundProfile.save();
    return res.status(200).json(foundProfile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error" });
  }
});

// @desc     GET user repos from github
// @route    GET /api/profile/github/:username
// @access   Private
const GetUserReposByUsername = asyncHandler(async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}`,
      method: "GET",
      headers: { "user-agent": "node.js" },
    };

    request(options, (error, response, body) => {
      if (error) console.log(error);

      if (response.statusCode !== 200) {
        res.status(404).json({ msg: "No Github Profile Found" });
      }
      res.status(200).json(JSON.parse(body));
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error" });
  }
});

export {
  getLoggedInUserProfile,
  createOrUpdateUserProfile,
  getAllProfiles,
  getProfileByID,
  deleteProfile,
  addProfileExperience,
  deleteProfileExperience,
  addProfileEducation,
  deleteProfileEducation,
  GetUserReposByUsername,
};
