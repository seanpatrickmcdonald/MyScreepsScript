var roomInitialPlan = require('room.planner').roomInitialPlan;
var buildRoadFromPath = require('room.planner').buildRoadFromPath;

var visualOpacity = 0.0625;

var room = {
    update : function(room){
        if(!room.initialLayout) roomInitialPlan(room);
        
            var sources = [];
            for(var cursor = 0; cursor < room.memory.sources.length; cursor++) {
                sources.push(Game.getObjectById(room.memory.sources[cursor]))
            }
            
            for(var name in Game.creeps){
                if(Game.creeps[name].room != room) continue;
                
                
            }
    
    
        drawRoomPaths(room);
        drawControllerRange(room.controller);
    }
};



var drawRoomPaths = function(room){
    if(!room) return;
    
    if(!room.memory.builtUpgradePath)
        drawRoadPath(room.memory.upgraderPath);
    if(!room.memory.builtHarvesterPath)
        drawRoadPath(room.memory.harvesterPath);
}

var drawRoadPath = function(path){
    if(!path) return;
    
    for(var cursor = 0; cursor < path.length - 1; cursor++)
        new RoomVisual(path[0].roomName).line(path[cursor].x, path[cursor].y,
                                              path[cursor+1].x, path[cursor+1].y,
                                              {opacity: visualOpacity*2})
}

var drawControllerRange = function(controller){
    controller.room.visual.circle(controller.pos, {radius: 3, opacity : visualOpacity});
}

module.exports = room;