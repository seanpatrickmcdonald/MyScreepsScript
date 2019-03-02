
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
    }
};

module.exports.harvester = harvester