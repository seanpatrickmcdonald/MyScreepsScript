var roomInitialPlan = require('room.planner').roomInitialPlan;
var buildRoadFromPath = require('room.planner').buildRoadFromPath;

var CreepBase = require('creep');


var visualOpacity = 0.0625;

const extensionPositions = {
    2:    [{dx: 1, dy: 1}, {dx: 1, dy: -1}, {dx: -1, dy: -1}, {dx: 2, dy: 0}, {dx: 2, dy: -1}],
    3:    []
};

var room = {
    update : function(room){
        if(!room.initialLayout) roomInitialPlan(room);
        
            if(!Memory.rooms)
                Memory.rooms = {};
            if(!Memory.rooms[room.name])
                Memory.rooms[room.name] = {};        
        
            var sources = [];
            for(var cursor = 0; cursor < room.memory.sources.length; cursor++) {
                sources.push(Game.getObjectById(room.memory.sources[cursor]))
            }
            
            for(var name in Game.creeps){
                if(Game.creeps[name].room != room) continue;
                
                
            }
        var room_level = room.controller.level;
        room.memory.level = room.memory.level || room_level;
        //If controller level changed
        if (room_level != room.memory.level) levelUpgraded[room_level(room)];
        room.memory.level = room.controller.level;
    
        drawRoomPaths(room);
        drawContainerLocations(room);
        drawControllerRange(room.controller);
    },
    
    run : function(room){
        
    }
};



var levelUpgraded = {
  2 : function(room){
      const spawn = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_SPAWN}});
      
      for(var index = 0; index < 5; index++)
      room.createConstructionSite(spawn.pos.x + extensionPositions[2].dx,
          spawn.pos.y + extensionPositions[0].dy, STRUCTURE_EXTENSION);
  }  
};


var drawRoomPaths = function(room){
    if(!room) return;
    
    drawRoadPath(room.memory.upgraderPath);
    drawRoadPath(room.memory.sourcePaths[0]);
    drawRoadPath(room.memory.sourcePaths[1]);
}

var drawRoadPath = function(path){
    if(!path) return;
    
    for(var cursor = 0; cursor < path.length - 1; cursor++)
        new RoomVisual(path[0].roomName).line(path[cursor].x, path[cursor].y,
                                              path[cursor+1].x, path[cursor+1].y,
                                              {opacity: visualOpacity*2})
}

var drawContainerLocations = function(room){
    room.visual.circle(room.memory.containerPositions[0], {radius: 0.4, fill: '#FFFF00', opacity: visualOpacity*4});
    room.visual.circle(room.memory.containerPositions[1], {radius: 0.4, fill: '#FFFF00', opacity: visualOpacity*4});
}

var drawControllerRange = function(controller){
    controller.room.visual.circle(controller.pos, {radius: 3, opacity: visualOpacity});
}

module.exports = room;