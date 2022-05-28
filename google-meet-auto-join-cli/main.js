require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;


app.set(express.static(__dirname + '/google-meet-auto-join-cli/src'));

app.get('/control', function (req, res) {
    // if the parameter is 'stop' then stop the joiner
    if (req.query.action === 'stop') {
        
    } else if(req.query.action === 'text'){
        
    }

});


app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`);
});