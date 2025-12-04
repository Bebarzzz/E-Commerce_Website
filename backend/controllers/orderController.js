const orderModel = require('../Models/orderModel');


const showOrders = async (req, res) => {
    try {
        const result = await orderModel.showOrders();

        if (result.success) {
            res.status(200).json({
                message: result.message,
                allOrdersShown: result.orders
            });
        } else {
            res.status(404).json({ error: result.message });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



module.exports = {
    showOrders,
};