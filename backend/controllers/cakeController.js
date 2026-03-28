const Cake = require('../models/Cake');

exports.getAllCakes = async (req, res) => {
  try {
    const { category, minRating, maxPrice, search, sort = '-reviewCount' } = req.query;
    let query = {};

    if (category && category !== 'All') query.category = category;
    if (minRating) query.rating = { $gte: parseFloat(minRating) };
    if (maxPrice) query['sizes.small'] = { $lte: parseInt(maxPrice) };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    query.isAvailable = true;

    // Use default sort if specific fields fail
    let sortObj = {};
    if (sort === 'price-asc') sortObj = { 'sizes.small': 1 };
    else if (sort === 'price-desc') sortObj = { 'sizes.small': -1 };
    else if (sort === 'rating') sortObj = { rating: -1 };
    else sortObj = { reviewCount: -1 };

    const cakes = await Cake.find(query).sort(sortObj);
    res.json({ status: 'success', count: cakes.length, data: cakes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCakeById = async (req, res) => {
  try {
    const cake = await Cake.findById(req.params.id);
    if (!cake) return res.status(404).json({ message: 'Cake not found' });
    res.json({ status: 'success', data: cake });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createCake = async (req, res) => {
  try {
    const cake = await Cake.create(req.body);
    res.status(201).json({ status: 'success', data: cake });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateCake = async (req, res) => {
  try {
    const cake = await Cake.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!cake) return res.status(404).json({ message: 'Cake not found' });
    res.json({ status: 'success', data: cake });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteCake = async (req, res) => {
  try {
    await Cake.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
