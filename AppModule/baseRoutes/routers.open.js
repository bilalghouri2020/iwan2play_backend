const express = require('express')
const app = express()

const router = express.Router()


router.use('/', (req, res) => {
    console.log('req..is running');
})
router.use("/api/v1/auth", require("../Api/v1/auth/routes"));

module.exports = router;