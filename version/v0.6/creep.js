/*
    Generalized Creep Module
*/

var creepType = {
    'HARVESTER' : 0,
    //'STATIC_HARVESTER' : 1,
    'UPGRADER' : 1,
    'BUILDER' : 2,
    'CARGO' : 3,
    'EXPLORER' : 4
};

var bodyTemplate = {
    'HARVESTER' : [WORK, CARRY, MOVE],
    //'STATIC_HARVESTER' : [WORK, MOVE],
    'UPGRADER' : [WORK, CARRY, MOVE],
    'BUILDER' : [WORK, CARRY, MOVE, MOVE],
    'CARGO' : [CARRY, CARRY, MOVE],
    'EXPLORER' : [MOVE]
}

var defaultAction = {
    'HARVESTER' : 'filling',
    //'STATIC_HARVESTER' : 'harvesting',
    'UPGRADER' : 'filling',
    'BUILDER' : 'filling',
    'CARGO' : 'filling',
    'EXPLORER' : 'exploring'
}

/* Notes

   Bodypart cost constant = BODYPART_COST
*/

var creep = {
    run: function(creep){
        
        //if(!creep.memory.action)
        
        if(roles[creep.memory.creepType])
        roles[creep.memory.creepType](creep);
          
    },
    
    create: function(spawn, creepTypeIn) {
        var body = bodyTemplate[creepTypeIn].slice();
        var bodyTemp = bodyTemplate[creepTypeIn].slice();
        var bodyCost = 0;
        for (var i = 0; i < body.length; i++) bodyCost += BODYPART_COST[body[i]];
        var energyAvailable = spawn.room.energyCapacityAvailable - bodyCost; 
        
        while (energyAvailable >= bodyCost){
            for(var i = 0; i < bodyTemp.length; i++){
              body.push(bodyTemp[i]);  
            }
            energyAvailable -= bodyCost;
        }
        
        var name = creepTypeIn + Game.time;
        
        var source = null;
        
        if (creepTypeIn == 'HARVESTER') 
        source = spawn.pos.findClosestByPath(FIND_SOURCES).id;
        else if (creepTypeIn == 'UPGRADER')
        source = spawn.room.controller.pos.findClosestByPath(FIND_SOURCES).id;
        else if (creepTypeIn == 'BUILDER')
        source = '80d207728e6597b';
        
        
        if (source) 
            var memoryObject = {creepType: creepTypeIn, source: source, action: defaultAction[creepTypeIn]};
        else 
            var memoryObject = {creepType: creepTypeIn, action: defaultAction[creepTypeIn]};
        
        
        var spawnResult = spawn.spawnCreep(body, name, {memory: memoryObject})
        if (spawnResult == OK) console.log('Spawning ' + name + ' from ' + spawn.name + '.' + spawn.room.name);
    }
    
};

var roles = {
  'HARVESTER' : function(creep){
      
      if (_.sum(creep.carry) == 0){
        creep.memory.action = 'filling';
        creep.memory.target = creep.memory.source;
      }
      else if (_.sum(creep.carry) == creep.carryCapacity){
        creep.memory.action = 'storing';
        creep.memory.target = findStorage(creep);
      }
      
      if(!creep.memory.target){
          creep.memory.target = findStorage(creep);
          if(!creep.memory.target){
              var buildTarget = findConstructionSite(creep);
              if(buildTarget){
                  creep.memory.target = buildTarget;
                  creep.memory.action = 'building';
              }
          }
          else{creep.memory.action = 'storing'};
      }
      
      var target = Game.getObjectById(creep.memory.target);
      if(!target) {creep.say('target=nil', false); creep.memory.target = null; return;}
      
      if (creep.memory.action == 'filling'){
          var fillResult = creep.harvest(target);
          if(fillResult == ERR_NOT_IN_RANGE) creep.moveTo(target);
      }
      else if (creep.memory.action == 'storing'){
          var storeResult = creep.transfer(target, RESOURCE_ENERGY);
          if(storeResult == ERR_NOT_IN_RANGE) creep.moveTo(target);
          else if(storeResult == OK || storeResult == ERR_FULL){
              if(target.energy + _.sum(creep.carry) >= target.energyCapacity){
                  creep.say('full');
                  creep.memory.target = findStorage(creep);
              }
          }
      }
      else if (creep.memory.action == 'building'){
          var buildResult = creep.build(target);
          if(buildResult == ERR_NOT_IN_RANGE) creep.moveTo(target);
      }
  },
  
  'STATIC_HARVESTER' : function(creep){
      
  },
  
  'UPGRADER' : function(creep){
      
      if (creep.carry[RESOURCE_ENERGY] == 0){
        creep.memory.action = 'filling';
        creep.memory.target = creep.memory.source;
        
      }
      else if (creep.carry[RESOURCE_ENERGY] == creep.carryCapacity){
        creep.memory.action = 'upgrading';
        creep.memory.target = creep.room.controller.id;
      }
      
      var target = Game.getObjectById(creep.memory.target);
      if(!target) {creep.say('target=nil', false); return;}
      
      if(creep.memory.action == 'filling'){
          var fillResult = creep.harvest(target);
          if(fillResult == ERR_NOT_IN_RANGE) creep.moveTo(target);
      }
      else if (creep.memory.action == 'upgrading'){
          var upgradeResult = creep.upgradeController(target);
          if(upgradeResult == ERR_NOT_IN_RANGE) creep.moveTo(target);
      }
  },
  
  'BUILDER' : function(creep){
      
      if (creep.carry[RESOURCE_ENERGY] == 0){
        creep.memory.action = 'filling';
        creep.memory.target = creep.memory.source;
      }
      else if (creep.carry[RESOURCE_ENERGY] == creep.carryCapacity){
        
        var repairTarget = creep.pos.findClosestByPath(FIND_STRUCTURES,
            {filter: function(object){
                    return object.hits < object.hitsMax;
                }
            }
        );
        if(repairTarget){
            creep.memory.target = repairTarget.id;
            creep.memory.action = 'repairing';
        }
        
        else{
            var buildTarget = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if(buildTarget) creep.memory.target = buildTarget.id, creep.memory.action = 'building';
            else creep.memory.target = null;
        }
      }
      
      var target = Game.getObjectById(creep.memory.target);
      if(!target) {creep.say('target=nil', false); return;}
      
      if(creep.memory.action == 'filling'){
          var fillResult = creep.harvest(target);
          if(fillResult == ERR_NOT_IN_RANGE) creep.moveTo(target);
      }
      else if(creep.memory.action == 'repairing'){
          var buildResult = creep.repair(target);
          if(buildResult == ERR_NOT_IN_RANGE) creep.moveTo(target);
      }
      else if(creep.memory.action == 'building'){
          var buildResult = creep.build(target);
          if(buildResult == ERR_NOT_IN_RANGE) creep.moveTo(target);
      }
  }
};

var findStorage = function(creep){
    //Re-fill Spawns and Extensions first
    var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, 
        {filter: function(object){
                return (object.structureType == STRUCTURE_EXTENSION || 
                    object.structureType == STRUCTURE_SPAWN) &&
                    (object.energy < object.energyCapacity) && object.isActive();
            }
        }
    );
    
    //Fill Off-load Storage second if Spawns and Extensions are full
    if(!target){
        target = creep.pos.findClosestByPath(FIND_STRUCTURES, 
            {filter: function(object){
                    return (object.structureType == STRUCTURE_CONTAINER || 
                        object.structureType == STRUCTURE_STORAGE) &&
                        (_.sum(object.store) < object.storeCapacity);
                }
            }
        ); 
    }
    
    if(!target) return null;
    return target.id;
};

var findConstructionSite = function(creep){
    
    var A = creep.memory.creepType == 'HARVESTER';
    
    var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES,
        {filter: function(object){
                return (!(!(object.structureType == STRUCTURE_CONTAINER ||
                    object.structureType == STRUCTURE_EXTENSION)) && A);
            }
        }
    );
    
    if(!target) return null;
    return target.id;
};


var asdf = function(creep){
    
};

module.exports.creep = creep;
module.exports.creepType = creepType;