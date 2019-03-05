var room = require('room')

module.exports.loop = function(){
    
    for(var name in Game.rooms){
        room.update(Game.rooms[name]);
        room.run(Game.rooms[name]);
    }
    
    
};