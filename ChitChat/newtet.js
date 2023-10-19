const axios = require('axios');

for (var i = 0; i < 15; i++) {
    console.log(`out of axios`);
    axios.post('http://192.168.1.185/',{"Hello":"World"})
        .then(res2 => {
            console.log(`inside axios`);
        }).
        catch(error => {
            console.error(error);
    });
}