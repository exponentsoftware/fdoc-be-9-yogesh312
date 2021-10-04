const mongoose = require("mongoose");
//const user = require("../models/user");
const List = mongoose.model("List");
const User = mongoose.model("User");
const Rating = mongoose.model("Rating");
const Tag = mongoose.model("Tag");
const bodyParser = require("body-parser")
const XLSX = require('xlsx')
const json2xls = require("json2xls");
const fs = require("fs")


const convertJsonToExcel = () => {

    const workSheet = XLSX.utils.json_to_sheet(students);
    const workBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workBook, workSheet, "students")
    // Generate buffer
    XLSX.write(workBook, { bookType: 'xlsx', type: "buffer" })

    // Binary string
    XLSX.write(workBook, { bookType: "xlsx", type: "binary" })

    XLSX.writeFile(workBook, "studentsData.xlsx")

}

exports.getAll = async (req, res)=>{
    const userId = req.payload.id;
    const type = req.query.type;
    const user = await User.findById(userId);
    if(user.role="admin"&& type =="userdata"){
        const data = await User.find({})
        return res.json(data)
    } else if(user.role="admin"&& type =="listdata"){
        const data = await List.find({})
        return res.json(data)
    }else if(user.role="admin"&& type =="ratingdata"){
        const data = await Rating.find({})
        return res.json(data)
    }else if(user.role="admin"&& type =="tagdata"){
        const data = await Tag.find({})
        return res.json(data)
    }
}
exports.download = async (req, res)=>{
    const userId = req.payload.id;
    const dataName = req.query.dataName;
    // const fileName = req.query.fileName;
    // const type = req.query.type;

    const user = await User.findById(userId);
    if(user.role=="admin" && dataName == "user"){
        const data = await User.find({})
        var eOutput = Date.now()+"output.xlsx";
        var xls = json2xls(data);
        fs.writeFileSync(eOutput, xls, 'binary');
        res.download(eOutput,(err)=>{
        if(err){
            fs.unlinkSync(eOutput);
            res.json("unable to download data")
        }
        fs.unlinkSync(eOutput);
    })
    } else if(user.role=="admin" && dataName == "list"){
        const data = await List.find({})
        var eOutput = Date.now()+"output.xlsx";
        var xls = json2xls(data);
        fs.writeFileSync(eOutput, xls, 'binary');
        res.download(eOutput,(err)=>{
        if(err){
            fs.unlinkSync(eOutput);
            res.json("unable to download data")
        }
        fs.unlinkSync(eOutput);
    })
    } else if(user.role=="admin" && dataName == "rating"){
        const data = await Rating.find({})
        var eOutput = Date.now()+"output.xlsx";
        var xls = json2xls(data);
        fs.writeFileSync(eOutput, xls, 'binary');
        res.download(eOutput,(err)=>{
        if(err){
            fs.unlinkSync(eOutput);
            res.json("unable to download data")
        }
        fs.unlinkSync(eOutput);
    })
    }else if(user.role=="admin" && dataName == "tag"){
        const data = await Tag.find({})
        var eOutput = Date.now()+"output.xlsx";
        var xls = json2xls(data);
        fs.writeFileSync(eOutput, xls, 'binary');
        res.download(eOutput,(err)=>{
        if(err){
            fs.unlinkSync(eOutput);
            res.json("unable to download data")
        }
        fs.unlinkSync(eOutput);
    })
    }else{
        res.json("admin role required/enter correct modeltype")
    }
    
}