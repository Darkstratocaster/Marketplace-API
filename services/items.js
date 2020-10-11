const { v4: uuidv4 } = require('uuid');

//hardcoded sensor for testing
let items = 
[
    {
        id: uuidv4(),
        title: "Arduino",
        description: "Arduino UNO-board 4, in good condition",
        category: "electronics",
        location: 
        {
            city: "Oulu",
            country: "Finland"
        },
        images: 
        {
            image0: "image0",
            image1: "image1",
            image2: "image2",
            image3: "image3"
        },
        price: "20e",
        postingDate: "2020-04-10",
        deliveryType: 
        {
          shipping: true,
          pickup: false
        },
        sellerInfo: 
        {
            name:  "James Sunderland",
            email: "james.sunderland@gmail.com"
        }
    }
]

module.exports = 
{
    //method used to insert a new item 
    insertItem: (title, description, category, location, images, price, postingDate, deliveryType, sellerInfo, userId) =>
    {
        items.push
        (
            {
                id: uuidv4(),
                title,
                description,
                category,
                location,
                images,
                price,
                postingDate,
                deliveryType,
                sellerInfo,
                userId
            }
        );
    },
    //method used to get all items
    getAllItems: () => items,
    //method used to get item(s) by the seller info
    getAllUserItems: (userId) => items.filter(t => t.userId == userId),
    //method used to get an item by id
    getItem: (itemId) => items.find(t => t.id == itemId),
    //method used to get an item index by item id
    getItemIndex : (itemId) => items.findIndex(t => t.id == itemId),
    //method used to get all items from a certain category
    getItemsCategory: (category) => items.filter(t => t.category == category),
    //method used to get all items from a certain location
    getItemsLocation: (location) => items.filter(t => t.location === location),
    //method used to get all items from a certain postingDate
    getItemsPostingDate: (postingDate) => items.filter(t => t.postingDate == postingDate),

    deleteItem: (result) => items.splice(result, 1)
}