import Member from '../models/Member.js';
import { isDemoMode } from '../config/db.js';
import { addDemoMember, deleteDemoMember, getDemoMembers, updateDemoMember } from '../config/demoStore.js';

export const getMembers = async (req, res) => {
  try {
    if (isDemoMode()) {
      return res.json(getDemoMembers());
    }

    const members = await Member.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch members', error: error.message });
  }
};

export const createMember = async (req, res) => {
  try {
    const { memberId, name, email, phone, membershipDate } = req.body;

    if (!memberId || !name || !email || !phone) {
      return res.status(400).json({ message: 'Member ID, name, email, and phone are required.' });
    }

    if (isDemoMode()) {
      const existingMember = getDemoMembers().find((member) => member.memberId === memberId.trim() || member.email.toLowerCase() === email.trim().toLowerCase());
      if (existingMember) {
        return res.status(400).json({ message: 'A member with this ID or email already exists.' });
      }

      const member = addDemoMember({
        memberId: memberId.trim(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        membershipDate: membershipDate ? new Date(membershipDate).toISOString() : new Date().toISOString(),
      });

      return res.status(201).json(member);
    }

    const existingMember = await Member.findOne({
      $or: [{ memberId: memberId.trim() }, { email: email.trim().toLowerCase() }],
    });

    if (existingMember) {
      return res.status(400).json({ message: 'A member with this ID or email already exists.' });
    }

    const member = await Member.create({
      memberId: memberId.trim(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      membershipDate: membershipDate || new Date(),
    });

    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create member', error: error.message });
  }
};

export const updateMember = async (req, res) => {
  try {
    const { memberId, name, email, phone, membershipDate } = req.body;

    if (isDemoMode()) {
      const member = getDemoMembers().find((item) => item._id === req.params.id);
      if (!member) {
        return res.status(404).json({ message: 'Member not found.' });
      }

      const updatedMember = updateDemoMember(req.params.id, {
        memberId: memberId ? memberId.trim() : member.memberId,
        name: name ? name.trim() : member.name,
        email: email ? email.trim().toLowerCase() : member.email,
        phone: phone ? phone.trim() : member.phone,
        membershipDate: membershipDate ? new Date(membershipDate).toISOString() : member.membershipDate,
      });

      return res.json(updatedMember);
    }

    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ message: 'Member not found.' });
    }

    if (memberId) member.memberId = memberId.trim();
    if (name) member.name = name.trim();
    if (email) member.email = email.trim().toLowerCase();
    if (phone) member.phone = phone.trim();
    if (membershipDate) member.membershipDate = membershipDate;

    await member.save();
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update member', error: error.message });
  }
};

export const deleteMember = async (req, res) => {
  try {
    if (isDemoMode()) {
      const removed = deleteDemoMember(req.params.id);
      if (!removed) {
        return res.status(404).json({ message: 'Member not found.' });
      }
      return res.json({ message: 'Member deleted successfully.' });
    }

    const member = await Member.findByIdAndDelete(req.params.id);

    if (!member) {
      return res.status(404).json({ message: 'Member not found.' });
    }

    res.json({ message: 'Member deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete member', error: error.message });
  }
};
