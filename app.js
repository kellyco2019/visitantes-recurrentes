const express = require ("express");
const mongoose = require ("mongoose");

const app = express();

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/test', { 
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on("error", function (err) {
    if (err) {
        return console.error(err);
    }
});

const VisitorSchema=mongoose.Schema({
 
    name: String,
    count: {
        type : Number,
        default: 1,
    },
});

const VisitorModel= mongoose.model("visitor", VisitorSchema)

app.get("/", async (req, res) => {
    const { name } = req.query;
   
    if (name) { 
    await VisitorModel.findOne(
        {
        name, 
        }, 
        async function (err ,visitor){
        if (err) {
            return console.error(err);
        }

        if (visitor) {
            visitor.count = visitor.count + 1;
        await    visitor.save()
        } else {
        await     VisitorModel.create({
            name,
             });
        }
        }   
    );
    } else {

    await VisitorModel.create({
        name : "Anónimo",   
    });
    }

    VisitorModel.find({}, function (err, visitors){
        if (err) {
            return console.error(err);
        }
        
        let template = '<table><th>ID</th><th>Name</th><th>Visits</th>';


        visitors.forEach((visitors) => {
            template += `<tr>
                <td>${visitors.id}</td>
                <td>${visitors.name}</td>
                <td>${visitors.count}</td>
            </tr>`;
        });
            template += "</table>"; 

             res.send(template);     
    });
});

app.listen(3000, () => {
    console.log("server listening on port 3000")
});
