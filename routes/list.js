const router = require("express").Router();
const { catchErrors } = require("../handlers/errorHandlers");
const listController = require("../controllers/listController");



const auth = require("../middlewares/auth");
const verify = require("../middlewares/verify");

router.get("/", auth, catchErrors(listController.getAllList));
router.post("/", auth, catchErrors(listController.createList));
router.get("/:id", auth, catchErrors(listController.getList)); //get list by list id or get all list of user
router.put("/:id", auth, catchErrors(listController.updateList));
router.delete("/:id", auth, catchErrors(listController.deleteList))
//---------------------------------------------------------------

// router.get("/", auth, verify, catchErrors(listController.getAllByFilter));
//this route is to get lists according to filters as well as without filters
// //in query pass category/title to find or sort= new/old to find list
// router.get("/user/:userId", auth, catchErrors(listController.getUserList));
// router.get("/all/:id", auth, catchErrors(listController.getAllListAdmin));
// -------------------------------------------------------------------------------------------

router.get("/user/:id", auth, catchErrors(listController.getUserList2)); //all list by user by user id from params
router.put("/like/:id", auth, catchErrors(listController.likeList)); //like a list by user , list id from params
router.put("/unlike/:id", auth, catchErrors(listController.unlikeList));//unlike a list by user, list id from params
router.post("/rating/:id",auth,catchErrors(listController.addRating));//add comment and rate by user,list id by params
//router.get("/rating/",auth,catchErrors(listController.getByRating));//sorting by filter
router.get("/done/:id",auth,catchErrors(listController.doneList));//geting task which are track done,params=userid
//-----------------------------------------------------------------

router.post("/tag/:id", auth, catchErrors(listController.addTag))//adding a tag, postid=params
router.put("/tag/:id", auth, catchErrors(listController.updateTag))//updating a tag, tagid=params
router.delete("/tag/:id", auth, catchErrors(listController.updateTag))//delete a tag, tagid=params
router.put("/rating/:id", auth,catchErrors(listController.editRating))// editing a rating ,params= rate id
router.get("/rating/:id", auth,catchErrors(listController.viewRating))// view coments rating pn list ,params= rate id
router.delete("/rating/:id",auth,catchErrors(listController.deleteRating))// params = rat id


module.exports = router;
