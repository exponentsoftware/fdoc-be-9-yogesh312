const router = require("express").Router();
const { catchErrors } = require("../handlers/errorHandlers");
const userController = require("../controllers/userController");
const adminController = require("../controllers/adminController")

const auth = require("../middlewares/auth");

router.post("/login", catchErrors(userController.login));
router.get("/login", catchErrors(userController.logins));
router.post("/register", catchErrors(userController.register));
router.get("/register", catchErrors(userController.registers));
router.get("/", catchErrors(userController.home));

router.get("/admin", auth, catchErrors(adminController.getAll))
router.post("/admin/download", auth, catchErrors(adminController.download))

module.exports = router;
