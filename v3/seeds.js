var mongoosse  = require("mongoose");
var Spot = require("./models/spots");
var Comment = require("./models/comments");

var data = [
    {
        name: "Kolkata",
        image: "https://images.unsplash.com/photo-1496372412473-e8548ffd82bc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=60",
        description: "A vibrant 350-year-old metropolis located on India's Eastern Coast, the capital of West Bengal thrives on contradictions and imposing spectacles; nothing is commonplace in this city. Famously known as the City of Joy, Kolkata is, in every sense, the artistic, cultural and intellectual capital of the country. Kolkata's streets are vivid, hectic, chaotic, and yet, brimming with life and creativity. Driven by the indomitable spirit of the self-made middle class, the city has created a beautiful juxtaposition of the old colonial-era charm with the nascent upcoming hipster culture that thrives amongst the city's millennial residents."
    },
    {
        name: "Amritsar",
        image: "https://images.unsplash.com/photo-1556656416-74183d01093d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=60",
        description: "Home of the glorious Golden Temple, the iconic city of Amritsar, portrays the heroic character of the Punjab. A day in this peaceful city starts with the spiritual prayers from Gurudwaras. The original name of first the ancient lake, then of the temple complex, and later the surrounding city, meaning 'pool of ambrosial nectar.'"
    },
    {
        name: "Kanyakumari",
        image: "https://images.unsplash.com/photo-1527705381526-469031509a9d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=60",
        description: "Located at the southernmost tip of the Indian peninsula, Kanyakumari is a coastal town in the state of Tamil Nadu. Earlier known as Cape Comorin, Kanyakumari is surrounded by mountains and bordered by vibrant sea shores, lined with paddy fields and coconut trees, and also boasts of aesthetic elevated patches of hills with undulating valleys and plains in between the sea and the mountainous terrain."
    }
]

function seedDB(){
    //Remove all campgrounds
    Spot.deleteMany({}, function(err){ 
        if(err){
            console.log(err);
        } 
        console.log("removed spots");
        //add a few spots
        data.forEach(function(seed){
            Spot.create(seed, function(err, addedSpot){
                if(err){
                    console.log(err);
                } else {
                    console.log("Added a spot");
                    Comment.create(
                        {
                            text: "Beautiful tourist spot with breathtaking sites",
                            author: "Ananya Khanna"
                        },
                    function(err, addedComment){
                        if(err){
                            console.log(err);
                        } else {
                            addedSpot.comments.push(addedComment);
                            addedSpot.save()
                            console.log("Added a comment");
                        }
                    })
                }
            });
        });
    });
}

module.exports = seedDB;
