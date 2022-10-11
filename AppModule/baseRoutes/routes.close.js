const express = require("express");
const router = express.Router();

// close routes


router.use('/api/v1/kidsInfo', require('../Api/v1/kidsinfo/routes'))
router.use('/api/v1/activateUser', require('../Api/v1/activateuser/routes'))
// router.use("/api/v1/products", require("../api/v1/products/routes"));
// router.use("/api/v1/users", require("../api/v1/users/routes"));
// router.use("/api/v1/admins", require("../api/v1/admins/routes"));
// router.use("/api/v1/categories", require("../api/v1/categories/routes"));
// router.use("/api/v1/company", require("../api/v1/company/routes"));
// router.use("/api/v1/consumer", require("../api/v1/consumer/routes"));
// router.use("/api/v1/consumerType", require("../api/v1/consumer_types/routes"));
// router.use("/api/v1/producerType", require("../api/v1/producer_types/routes"));
// router.use("/api/v1/producer", require("../api/v1/producer/routes"));

module.exports = router;
