const asyncHandler = require("express-async-handler");
const Plan = require("../../models/Plan/Plan");

const planController = {
  createPlan: asyncHandler(async (req, res) => {
    const { planName, features, price, billingCycle,discountPercentage } = req.body;
    if (await Plan.findOne({ planName })) throw new Error("Plan already exists");
    if (await Plan.countDocuments() >= 5) throw new Error("Maximum plan limit reached");
    if (price <= 0) throw new Error("Price must be a positive value");

    const planCreated = await Plan.create({
      planName,
      features,
      price,
      billingCycle,
      discountPercentage,
    });
    res.json({ message: "Plan created successfully", planCreated });
  }),

  lists: asyncHandler(async (req, res) => {
    const plans = await Plan.find();
    res.json({ message: "Plans fetched successfully", plans });
  }),

  getPlan: asyncHandler(async (req, res) => {
    const planFound = await Plan.findById(req.params.planId);
    if (!planFound) throw new Error("Plan not found");
    res.json({ message: "Plan fetched successfully", planFound });
  }),

  delete: asyncHandler(async (req, res) => {
    //get the plan id from params
    const planId = req.params.planId;
    //find the plan
    await Plan.findByIdAndDelete(planId);
    res.json({
      status: "success",
      message: "Plan deleted successfully",
    });
  }),

  update: asyncHandler(async (req, res) => {
    const { planName, features, price, billingCycle, hasTrial, trialDays, discountPercentage } = req.body;
    const planUpdated = await Plan.findByIdAndUpdate(
      req.params.planId,
      { planName, features, price, billingCycle, hasTrial, trialDays, discountPercentage },
      { new: true }
    );
    if (!planUpdated) throw new Error("Plan not found");
    res.json({ message: "Plan updated successfully", planUpdated });
  }),
};

module.exports = planController;
