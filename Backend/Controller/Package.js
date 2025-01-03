import Packafe from "../Model/Package.js";

export const createPackage = async (req, res) => {
    try {
        const { name, price, description, offer } = req.body;
        const newPackage = new Packafe({ name, price, description, offer });
        await newPackage.save();
        res.status(201).json(newPackage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getPackages = async (req, res) => {
    try {
        const packages = await Packafe.find();
        res.status(200).json(packages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const deletePackage = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPackage = await Packafe.findByIdAndDelete(id);
        if (!deletedPackage) {
            return res.status(404).json({ error: "Package not found" });
        }
        res.status(200).json({ message: "Package deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updatePackage = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedPackage = await Packafe.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedPackage) {
            return res.status(404).json({ error: "Package not found" });
        }
        res.status(200).json(updatedPackage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
