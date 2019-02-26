var creep = require('creep').creep;
var creepType = require('creep').creepType;
/*
{
    'HARVESTER' : 0,
    'STATIC_HARVESTER : 1,
    'UPGRADER' : 1,
    'BUILDER' : 2,
    'CARGO' : 3,
    'EXPLORER' : 4
};
*/
var creepTypeLength = 6;
var creepQuantitiesByLevel = [
    [0, 2, 2, 1, 1, 1, 1, 1],           //Harvester
  //[0, 0, 0, 2, 2, 2, 2, 2],           //Static Harvester
    [0, 3, 3, 3, 3, 3, 3, 3],           //Upgrader
    [0, 1, 1, 1, 1, 1, 1, 1],           //Builder         
    [0, 0, 0, 0, 0, 0, 0, 0],           //Cargo
    [0, 0, 0, 1, 0, 0, 0, 0]            //Explorer
    ];

module.exports.loop = function () {
    
    //Room Memory Operations
    for(var name in Game.rooms) {
        var currentRoom = Game.rooms[name];
        
        //Memory check/update  
        if(!currentRoom.memory.memoryInit) roomMemoryInit(currentRoom);
        
        //Reset CreepType count
        currentRoom.memory.creepQuantities = {
                                            'HARVESTER' : 0,
                                            //'STATIC_HARVESTER' : 0,
                                            'UPGRADER' : 0,
                                            'BUILDER' : 0,
                                            'CARGO' : 0,
                                            'EXPLORER' : 0
                                        };
    }
    
    //Creep Memory Upkeep - Updates only every 6000 ticks
    if(!Memory.creepMemoryTimer) Memory.creepMemoryTimer = Game.time;
    else if(Game.time - Memory.creepMemoryTimer >= 6000){
        for(var name in Memory.creeps){
            if(!Game.creeps[name]) delete Memory.creeps[name];
        }
        Memory.creepMemoryTimer = Game.time
    }
    
    //Creep Operation
    for(var name in Game.creeps) {
        var curCreep = Game.creeps[name];
       
        
        curCreep.room.memory.creepQuantities[curCreep.memory.creepType]++;
        creep.run(curCreep);
    }
    
    //Creep Spawning
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
        var sources = room.find(FIND_SOURCES);
        room.memory.sources = [];
        for(var i in sources) {
            room.memory.sources.push(sources[i].id);
            console.log("Added Source with id=" + sources[i].id);
        }
        
        //Room Source Assignments
        room.memory.upgradeSource = room.controller.pos.findClosestByPath(FIND_SOURCES).id;
        room.memory.spawnSource = 
        Game.getObjectById(room.memory.spawns[0]).pos.findClosestByPath(FIND_SOURCES).id;
        
        //We've only iniated the memory if it's a room with a spawn we owned
        room.memory.memoryInit = true;
        
        //Room Towers
        room.memory.towers = [];
        
        //Room Spawns + Extensions
        room.memory.spawnContainers = [room.memory.spawns[0]];
            
        console.log("Room " + room.name + " has " + room.memory.sources.length + " sources");
        console.log("Room " + room.name + " upgrade source = " + room.memory.upgradeSource);
        console.log("Room " + room.name + " spawn source = " + room.memory.spawnSource);
    }
    
}

























      /*
      var cpu = Game.cpu.getUsed();
      //INSERT THING YOU WANT TO TIME HERE
      if(!Memory.cpuTotal){
          Memory.cpuTotal = Game.cpu.getUsed() - cpu;
          Memory.cpuTemps = 1;
      }
      else{
          Memory.cpuTotal += Game.cpu.getUsed() - cpu;
          Memory.cpuTemps++;
          Memory.cpuAvg = Memory.cpuTotal / Memory.cpuTemps;
      }
      */

