var room = require('room')

module.exports.loop = function(){
    
    
    for(var name in Game.rooms){
        room.update(Game.rooms[name])
        
    }
    
    
    new RoomVisual().text(Game.cpu.bucket, 1, 0);
};