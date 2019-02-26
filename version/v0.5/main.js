var creep = require('creep').creep;
var creepType = require('creep').creepType;
/*
{
    'HARVESTER' : 0,
    'UPGRADER' : 1,
    'BUILDER' : 2,
    'CARGO' : 3,
    'EXPLORER' : 4
};
/*
var creepQuantitiesBlank = {
    'HARVESTER' : 0,
    'UPGRADER' : 0,
    'BUILDER' : 0,
    'CARGO' : 0,
    'EXPLORER' : 0
};
*/
var creepTypeLength = 5;
var creepQuantitiesByLevel = [
    [1, 1, 2, 2, 2, 2, 2, 2],           //Harvester
    [1, 2, 3, 3, 3, 3, 3, 3],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
    ];

module.exports.loop = function () {
    
    
    for(var name in Game.rooms) {
        var currentRoom = Game.rooms[name];
        
        //Memory check/update  
        if(!currentRoom.memory.memoryInit) roomMemoryInit(currentRoom);
        
        //Reset CreepType count
        
        currentRoom.memory.creepQuantities = {
                                            'HARVESTER' : 0,
                                            'UPGRADER' : 0,
                                            'BUILDER' : 0,
                                            'CARGO' : 0,
                                            'EXPLORER' : 0
                                        };
    }
    
    for(var name in Game.creeps) {
        var curCreep = Game.creeps[name];
        curCreep.room.memory.creepQuantities[curCreep.memory.creepType]++;
        console.log(curCreep.memory.creepType)
        console.log(curCreep.room.memory.creepQuantities['HARVESTER']);
        creep.run(curCreep);
    }
    
    for(var name in Game.rooms) {
        var currentRoom = Game.rooms[name];
        
        for(var type in creepType) {
            //If we don't have enough of a creepType
            if(currentRoom.memory.creepQuantities[type] < 
                creepQuantitiesByLevel[creepType[type]][currentRoom.controller.level]) {
                for(var i = 0; i < currentRoom.memory.spawns.length; i++) {
                    var spawn = Game.getObjectById(currentRoom.memory.spawns[i]);
                    if(!spawn.spawning) {
                        creep.create(spawn, type);
                    }
                }  
                
                //We only make the highest priority creep
                break;
            }
        }
        
       // for (var towerIndex = 0; i < currentRoom.memory.towers.length; i++) {
            
       // }
       
    }
}





/*  roomMemoryInit function
    
    Initalizes memory for rooms
    
    When other modules need to make changes they simply delete the pertinent memory
    and it is updated here
*/
var roomMemoryInit = function(room) {
    //If not a room
    if(!room.getTerrain) return;
    
    //Room Spawn list
    console.log("Initiating spawn for Room " + room.name);
    
    room.memory.spawns = [];
    var spawnIndex = 0;
    for(var name in Game.spawns) {
        if(Game.spawns[name].room.id == room.id) {
            room.memory.spawns[spawnIndex] = Game.spawns[name].id;
            console.log("Added Spawn: " + name + " with id=" + room.memory.spawns[spawnIndex]);
            spawnIndex++;
        }
    }
    
    Game.notify("Initiated spawn memory for Room " + room.name);
        
    /*
        Check to see if this is an "owned" room, which is a room in which we have an owned spawn
    */
    if (room.memory.spawns && room.memory.spawns.length > 0) {
        //Room owned creep count
        room.memory.creepQuantities = [];
        
        //Room extensions
        room.memory.extensions = [];
        
        //Room sources
        room.memory.sources = room.find(FIND_SOURCES);
        
        console.log("Room " + room.name + " has " + room.memory.sources.length + " sources");
        if(room.memory.sources.length > 1) {
            
        }
        
        //We've only iniated the memory if it's a room with a spawn we owned
        room.memory.memoryInit = true;
        
        //Room Towers
        room.memory.towers = [];
    }
    
}

module.exports.creepType = creepType;