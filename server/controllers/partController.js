const Part = require('../models/Part');

// @desc    Get all parts
// @route   GET /api/parts
// @access  Public
const getParts = async (req, res) => {
    try {
        const keyword = req.query.keyword
            ? {
                modelNumber: {
                    $regex: req.query.keyword,
                    $options: 'i',
                },
            }
            : {};

        const category = req.query.category && req.query.category !== 'All'
            ? { category: req.query.category }
            : {};

        // Sort options
        let sort = { createdAt: -1 }; // Default new to old
        if (req.query.sort === 'low') {
            sort = { price: 1 };
        } else if (req.query.sort === 'high') {
            sort = { price: -1 };
        }

        const parts = await Part.find({ ...keyword, ...category }).sort(sort);
        res.json(parts);
    } catch (error) {
        console.error('getParts Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single part
// @route   GET /api/parts/:id
// @access  Public
const getPartById = async (req, res) => {
    try {
        const part = await Part.findById(req.params.id);

        if (part) {
            res.json(part);
        } else {
            res.status(404).json({ message: 'Part not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a part
// @route   POST /api/parts
// @access  Private/Admin
const createPart = async (req, res) => {
    const { name, image, brand, category, description, modelNumber, price, countInStock } = req.body;

    try {
        const part = new Part({
            user: req.user._id,
            name,
            image,
            brand,
            category,
            description,
            modelNumber,
            price,
            countInStock
        });

        const createdPart = await part.save();
        res.status(201).json(createdPart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a part
// @route   PUT /api/parts/:id
// @access  Private/Admin
const updatePart = async (req, res) => {
    const { name, image, brand, category, description, modelNumber, price, countInStock } = req.body;

    try {
        const part = await Part.findById(req.params.id);

        if (part) {
            part.name = name || part.name;
            part.image = image || part.image;
            part.brand = brand || part.brand;
            part.category = category || part.category;
            part.description = description || part.description;
            part.modelNumber = modelNumber || part.modelNumber;
            part.price = price || part.price;
            part.countInStock = countInStock || part.countInStock;

            const updatedPart = await part.save();
            res.json(updatedPart);
        } else {
            res.status(404).json({ message: 'Part not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a part
// @route   DELETE /api/parts/:id
// @access  Private/Admin
const deletePart = async (req, res) => {
    try {
        const part = await Part.findById(req.params.id);

        if (part) {
            await part.deleteOne();
            res.json({ message: 'Part removed' });
        } else {
            res.status(404).json({ message: 'Part not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getParts,
    getPartById,
    createPart,
    updatePart,
    deletePart,
};
