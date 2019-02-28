

var roomInitialPlan = function(room){
    
    var cpu = Game.cpu.getUsed();
    
    const sources = room.find(FIND_SOURCES);
    const spawns = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_SPAWN}});
    
    room.memory.sources = [];
    for(var cursor = 0; cursor < sources.length; cursor++) room.memory.sources.push(sources[cursor].id);
    
    //In event this is our starting room
    if(spawns && spawns.length == 1){
        //console.log('Welcome, Welcome to Papa\'s House');
        firstBasePlan(room, sources, spawns[0]);
        
    }
    
    if(!Memory.cpuTotal) Memory.cpuTotal = 0, Memory.cpuTicks = 0;
    
    Memory.cpuTotal += Game.cpu.getUsed() - cpu;
    Memory.cpuTicks++;
    
    Memory.cpuAvg = Memory.cpuTotal / Memory.cpuTicks;
};

/*
    First Base
*/ 
var firstBasePlan = function(room, sources, spawn){
    //Store all slots adjacent to source
    var sourceAdjacentSquares = [];
    const terrain = new Room.Terrain(room.name);
    const controllerPos = room.controller.pos;
    for(var name in sources){
        var source = sources[name];
        var sourceAdjacents = [];
        var sourcePos = {x: source.pos.x, y:source.pos.y};
        
        for(var x = -1; x <= 1; x++){
            for(var y = -1; y<= 1; y++){
                if(x == 0 && y == 0) continue;
                if(terrain.get(sourcePos.x + x, sourcePos.y + y) != TERRAIN_MASK_WALL){
                    sourceAdjacents.push(
                        {x: sourcePos.x + x, y: sourcePos.y});
                }
            }
        }
        
        var groups = makeAdjacentsGroups(sourcePos, sourceAdjacents);
        
        sourceAdjacentSquares.push(sourceAdjacents);
    }
    
    
    if(sources.length == 2){
       var source1Path = PathFinder.search(sources[0].pos, {pos: controllerPos, range: 3}, {maxRooms: 1});
       var source2Path = PathFinder.search(sources[1].pos, {pos: controllerPos, range: 3}, {maxRooms: 1});
    
       //pick source for upgrading
       if(source1Path.cost >= source2Path.cost){
           room.memory.upgraderSource = sources[1].id;
           room.memory.upgraderPath = source2Path.path;
       }
       else{
           room.memory.upgraderSource = sources[0].id;
           room.memory.upgraderPath = source1Path.path;
       }
       
       room.memory.initialUpgradeContainerPosition = room.memory.upgraderPath[0];
       
       //Just making road within one range of dest..
       room.memory.upgraderPath.shift(); 
       room.memory.upgraderPath.pop();
       
       
       source1Path = PathFinder.search(sources[0].pos, {pos: spawn.pos, range: 1}, {maxrooms: 1});
       source2Path = PathFinder.search(sources[1].pos, {pos: spawn.pos, range: 1}, {maxrooms: 1});
       
       //pick source for spawn
       if(source1Path.cost >= source2Path.cost){
           room.memory.harvesterSoure = sources[1].id;
           room.memory.harvesterPath = source2Path.path;
       }
       else{
           room.memory.harvesterSoure = sources[0].id;
           room.memory.harvesterPath = source1Path.path;
       }
       
       //If we're harvesting, no need to have road at it..
       room.memory.harvesterPath.pop();
    }
};

var makeAdjacentsGroups = function(sourcePos, adjacentSquares){
    
}

/*

*/
var buildRoadFromPath = function(path, room){
    if(!path) {console.log("Path improperly or not defined"); return;}
    
    for(var pathPoint = 0; pathPoint < path.length; pathPoint++){
        Game.rooms[path[0].roomName].createConstructionSite(path[pathPoint], STRUCTURE_ROAD);
    }
}

/*
    Clear all construction sites from a room. If passed a room, only removes
    construction sites from that room, else kills all construction sites
*/
var clearConstructionSites = function(room){
    for(var name in Game.constructionSites){
        if(room && room.name == Game.constructionSites[name].room.name)
            Game.constructionSites[name].remove();
        
        else if(!room) 
            Game.constructionSites[name].remove();
    }
}



module.exports.roomInitialPlan = roomInitialPlan;
module.exports.buildRoadFromPath = buildRoadFromPath;