import Channel from "../models/Channel.js";
import Message from "../models/Message.js";

/* =====================================================
   CREATE CHANNEL
===================================================== */
export const createChannel = async (req, res) => {
    try {
        const { name } = req.body;

        const existing = await Channel.findOne({ name });
        if (existing)
            return res.json({ success: false, message: "Channel already exists" });

        const channel = await Channel.create({
            name,
            createdBy: req.user._id,
            members: [req.user._id]
        });

        const populated = await Channel.findById(channel._id).populate("members", "-password");

        res.json({ success: true, channel: populated });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

/* =====================================================
   GET CHANNELS (ONLY CHANNELS THE USER IS PART OF)
===================================================== */
export const getChannels = async (req, res) => {
    try {
        const channels = await Channel.find({
            members: req.user._id
        }).populate("members", "-password");

        res.json({ success: true, channels });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

/* =====================================================
   ADD MEMBER TO CHANNEL
===================================================== */
export const joinChannel = async (req, res) => {
    try {
        const channelId = req.params.id;
        const { userId } = req.body;

        const channel = await Channel.findById(channelId);
        if (!channel)
            return res.json({ success: false, message: "Channel not found" });

        const memberToAdd = userId || req.user._id;

        if (!channel.members.includes(memberToAdd)) {
            channel.members.push(memberToAdd);
            await channel.save();
        }

        const updated = await Channel.findById(channelId).populate("members", "-password");

        res.json({ success: true, channel: updated });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

/* =====================================================
   LEAVE CHANNEL
===================================================== */
export const leaveChannel = async (req, res) => {
    try {
        const channelId = req.params.id;

        const channel = await Channel.findById(channelId);
        if (!channel)
            return res.json({ success: false, message: "Channel not found" });

        channel.members = channel.members.filter(
            (m) => m.toString() !== req.user._id.toString()
        );

        await channel.save();

        const updated = await Channel.findById(channelId).populate("members", "-password");

        res.json({ success: true, channel: updated });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

/* =====================================================
   REMOVE MEMBER (ONLY CREATOR CAN REMOVE)
===================================================== */
export const removeMember = async (req, res) => {
    try {
        const channelId = req.params.id;
        const { userId } = req.body;

        const channel = await Channel.findById(channelId);
        if (!channel) return res.json({ success: false, message: "Channel not found" });

        if (channel.createdBy.toString() !== req.user._id.toString()) {
            return res.json({ success: false, message: "Only channel creator can remove members" });
        }

        channel.members = channel.members.filter(
            (m) => m.toString() !== userId
        );

        await channel.save();

        const updated = await Channel.findById(channelId).populate("members", "-password");

        res.json({ success: true, channel: updated });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

/* =====================================================
   DELETE CHANNEL (ONLY CREATOR CAN DELETE)
===================================================== */
export const deleteChannel = async (req, res) => {
    try {
        const channelId = req.params.id;

        const channel = await Channel.findById(channelId);
        if (!channel) return res.json({ success: false, message: "Channel not found" });

        if (channel.createdBy.toString() !== req.user._id.toString()) {
            return res.json({ success: false, message: "Only the captain can delete this channel" });
        }

        await Message.deleteMany({ channelId });
        await Channel.findByIdAndDelete(channelId);

        res.json({ success: true, message: "Channel deleted successfully" });

    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

export const getChannelMessages = async (req, res) => {
    try {
        const channelId = req.params.id;
        const page = parseInt(req.query.page) || 1;
        const limit = 20;

        const messages = await Message.find({ channelId })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({ success: true, messages });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};