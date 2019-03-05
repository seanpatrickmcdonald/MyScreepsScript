
var harvester = {
    run : function(creep){
        
    },
    
    findTask: function(creep){
        //Reset task
        creep.memory.task = null;
    
        //Search for Spawn below capacity
        for(var index = 0; index < creep.room.memory.spawns.length; index++){
            if(Game.getObjectById(creep.room.memory.spawns[index]).energy < SPAWN_ENERGY_CAPACITY){
                creep.memory.task = creep.room.memory.spawns[index];
                creep.memory.taskAction = 'FILL_SPAWN';
                return;
            }
        }
        
        //Search for Extension below capacity
        const extension = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, 
            {filter: function(object){
                return structureType == STRUCTURE_EXTENSION && object.energy < object.energyCapacity;
            }});
        
        if(extension){ 
            creep.memory.task = extension.id; 
            creep.memory.taskAction = 'FILL_SPAWN'; 
            return;
        }
        
        //Search for Container or Storage below capacity
        const storage = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, 
            {filter: function(object){
                return (structureType == STRUCTURE_CONTAINER || structureType == STRUCTURE_STORAGE) && 
                    object.store[RESOURCE_ENERGY] < object.storeCapacity;
            }});
            
        if(storage){
            creep.memory.task = storage.id;
            creep.memory.taskAction = 'FILL_CONT';
            return;
        }
        
        //Search for build target if we have nothing to fill
        const build = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
        
        if(build){
            creep.memory.task = build.id;
            creep.memory.taskAction = 'BUILD';
            return;
        }
        
        creep.memory.taskAction = 'IDLE';
    },
    
    findEnergy: function(creep){
        if(!creep.memory.taskAction || creep.memory.taskAction === 'IDLE') return;
        
        var storage_energy_found = false;
        if(creep.memory.taskAction === 'FILL_SPAWN' || creep.memory.taskAction === 'BUILD'){
            
        }
    },
    
    isTaskComplete: function(creep){
        
    }
};

module.exports.harvester = harvester