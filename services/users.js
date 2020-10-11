const { v4: uuidv4 } = require('uuid');

let users = 
[
    {
        id: uuidv4(),
        username: 'Kalmankantaja',
        password: '$2y$06$PhZ74dT8/5g6B8SgssFq6ey4ojLxmP6pos2DcevMUGw25Vc9jGEou', //testerpassword
        name: 'James',
        birthDate: '1999-23-02',
        email: 'asdasdasd@asd.fi',
        address: {
            street: 'Kajaanintie 11',
            country: 'Finland',
            postalCode: '90590',
            city: 'Oulu'
        }
    }
]

module.exports = 
{
    //method used to get username
    getUserByName: (username) => users.find(u => u.username == username),
    //method used to add a new user     
    addUser: (username, password, name, birthDate, email, address) =>
    {
        users.push 
        (
            {
                id: uuidv4(),
                username, 
                password,
                name,
                birthDate,
                email,
                address
            }
        );
    }
}