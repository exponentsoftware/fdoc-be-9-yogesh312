const mongoose = require("mongoose");
//const user = require("../models/user");
const List = mongoose.model("List");
const User = mongoose.model("User");
const Rating = mongoose.model("Rating");
const Tag = mongoose.model("Tag");
const bodyParser = require("body-parser")

var mongoosePaginate = require('mongoose-paginate');

exports.createList = async (req, res) => {
  const { title,description, track, category} = req.body;
  const userId = req.payload.id;
  const listExist = await List.findOne({ title });
  if (listExist) throw "form with that name already exists!";
  const list = new List({
    userId,
    title, 
    description,
    track,
    category
  });
  await list.save();
  res.json({message: "list created!",
  });
};

exports.getAllList = async (req, res) => {
    try{
        const lists = await List.find({}).populate("rating");
        res.json(lists);
    } catch(err){
        console.log(err)
    }
    
};

exports.getAllListAdmin = async (req, res) => {
    try{
        const id=req.params.id;
        const pageno=req.query.page;
        const limitno =parseInt(req.query.limit);
        //console.log(page,limit)
        const user = await User.findById(id);
        //console.log(user);
        if(user.role=="admin"){
            await List.paginate({},{page:pageno,limit:limitno} ,function(err, result){
                if(err){
                    res.json(err)
                }else{
                    res.json(result)
                }

            });
            
        } else if(user.role=="user"){
            res.json("admin role required")
        }
         
    } catch(err){
        console.log(err)
    }
    
};


exports.getList = async (req, res) => {
    const id = req.params.id;
    let list = await List.findById(id);
    res.json(list);
    
};
exports.getUserList = async (req, res) => {
    
    const userId = req.params.userId
    //console.log(userId)
    let list = await List.find({"userId":userId});
    res.json(list);
    
};

exports.deleteList = async (req, res) => {
    const id = req.params.id;
    //console.log(id);
    

    await List.findByIdAndDelete(id);
    res.json(`id ${id} list has been deleted`);
};



exports.updateList = async (req, res) => {
    try{
        const id = req.params.id;
        const userId = req.payload.id;
        const user = await User.findById(userId)
        const list = await List.findById(id)
        if(user.id==list.userId){
            const updated= await List.findByIdAndUpdate(id, req.body, {new: true})
            res.json({ message: updated });
        }else{
            res.json("list doesnt belong to you to update")
        }
    
        
    } catch(err){
        console.log(err)
    }
    
};
//-----------------------------------------------------------------------
exports.getAllByFilter = async (req, res) => {
    try{
        let cat =req.query.category;
        let title= req.query.title
        let sort = req.query.sort
        if(sort=="new"){
            if(cat){
                let listByCat= await List.find({"category": cat}).sort({createdAt:-1})
                res.json({message:`list by ${cat}`,listByCat});
            } else if(title){
                let listByTitle= await List.find({"title": title}).sort({createdAt:-1})
                res.json({message:`list by ${cat}`,listByTitle});
            }else{
                let lists = await List.find({}).sort({createdAt:-1});
            res.json(lists);
            }
        } else if (sort=="old"){
            if(cat){
                let listByCat= await List.find({"category": cat}).sort({createdAt:1})
                res.json({message:`list by ${cat}`,listByCat});
            } else if(title){
                let listByTitle= await List.find({"title": title}).sort({createdAt:1})
                res.json({message:`list by ${cat}`,listByTitle});
            }else{
                let lists = await List.find({}).sort({createdAt:1});
            res.json(lists);
            }
        } else if (cat){
            let listByCat= await List.find({"category": cat}).sort({createdAt:1})
            res.json({message:`list by ${cat}`,listByCat});
        } else if(title){
            let listByTitle= await List.find({"title": title}).sort({createdAt:1})
            res.json({message:`list by ${cat}`,listByTitle});
        }else{
            let lists = await List.find({});
        res.json(lists);
        }
    } catch(err){
        console.log(err)
    }
    
};
//---------------------------------------------------------------------------

exports.getUserList2 = async (req, res) => {
    //const userId = req.payload.id
    //.log(userId)
    const userId = req.params.id;
    let list = await List.find({"userId":userId});
    res.json(list);
};

exports.likeList = async(req,res) =>{
    const userId= req.payload.id;
    //console.log(userId)
    const listId=req.params.id;
    await List.findByIdAndUpdate(listId,{$push:{likes:userId}},{new:true}).exec((err,result)=>{
        if(err){
            res.status(422).json({error:err});
        }else{
            res.json(result);
        }
    });
}
exports.unlikeList = async(req,res) =>{
    const userId= req.payload.id;
    const listId=req.params.id;
    await List.findByIdAndUpdate(listId,{$pull:{likes:userId}},{new:true}).exec((err,result)=>{
        if(err){
            res.status(422).json({error:err});
        }else{
            res.json(result);
        }
    });
}
exports.addRating= async(req,res)=>{
    try{
        const listId=req.params.id;
        const userId=req.payload.id;
        const {comment,rate}=req.body;
        const rating  = new Rating({
            userId,
            listId, 
            comment,
            rate
        });
        await rating.save();
        let list = await List.findByIdAndUpdate(listId,{$push:{rating:rating._id}},{new:true});
        res.json(list)
    }catch(err){
        console.log(err)}
};

exports.getbyRating = async (req, res) => {
    try{
        let userId =req.payload.id;
        let like= req.query.like
        let rating = req.query.rating
        if(like=="yes"){
            let list = await List.aggregate.sortByCount(likes);
            res.json(list)
        }else if(rating=="yes"){
            let list = await List.aggregate.sortByCount(rating);
            res.json(list)
        }else{
            res.json("put either like or rating as yes")
        }
    }catch(err){
        res.json(err)
    }
}

exports.doneList = async(req,res) =>{
    const userId= req.params.id;
    // const listId=req.params.id;
    await List.find({userId:userId, track:true}).exec((err,result)=>{
        if(err){
            res.status(422).json({error:err});
        }else{
            res.json(result);
        }
    });
}
 //-------------------------------------------------------------------------
 exports.addTag= async(req,res)=>{
    try{
        const listId=req.params.id;
        const userId=req.payload.id;
        const {tagtitle}=req.body;
        const checkTag = await Tag.find({tagtitle})
        if(checkTag){
            await Tag.findByIdAndUpdate(checkTag.id,{$push:{listId:listId}})
            let list = await List.findByIdAndUpdate(listId,{$push:{tag:checkTag._id}},{new:true});
            res.json(list)

        }
        const tag  = new Tag({
            tagtitle,
        });
        await tag.save();
        await Tag.findOneAndUpdate({tagtitle:tagtitle},{$push:{listId:listId}})
        let list = await List.findByIdAndUpdate(listId,{$push:{tag:tag._id}},{new:true});
        res.json(list)
        

    }catch(err){
        console.log(err)}
};

exports.editRating = async (req, res) => {
    try{
        const rateId = req.params.id;
        const updated= await List.findByIdAndUpdate(id, req.body, {new: true})
        res.json({ message: updated });
    } catch(err){
        console.log(err)
    }
}

exports.viewRating = async (req, res) => {
    const postId = req.params.id;
    let list = await List.findById(postId).populate("rating");
    res.json(list);
    
};
exports.deleteRating = async(req,res)=>{
    const rateId=req.params.id;
    const userId=req.payload.id;
    
    const user = await User.findById(userId)
    const rate = await Rating.findById(rateId)
    if(user.role=="admin" ||user.Id==rate.userId){
        await Rating.findByIdAndDelete(rateId);
        res.json(`id ${id} rating has been deleted`);
    }
    res.json(rate)
}
exports.updateTag = async (req, res) => {
    try{
        const tagId = req.params.id;
        const userId = req.payload.id;
        const user = await User.findById(userId)
        if(user.role=="admin"){
            const updated= await Tag.findByIdAndUpdate(tagId, req.body, {new: true})
            res.json({ message: updated });
        }
    } catch(err){
        console.log(err)
    }
    
};
exports.deleteTag = async (req, res) => {
    try{
        const tagId = req.params.id;
        const userId = req.payload.id;
        const user = await User.findById(userId)
        if(user.role=="admin"){
            const updated= await Tag.findByIdAndUpdate(tagId, req.body, {new: true})
            res.json({ message: updated });
        }
    } catch(err){
        console.log(err)
    }
    
};