/*
    Generalized Creep Module
*/

var creepType = {
    'HARVESTER' : 0,
    'UPGRADER' : 1,
    'BUILDER' : 2,
    'CARGO' : 3,
    'EXPLORER' : 4
};

var bodyTemplate = {
    'HARVESTER' : [WORK, CARRY, MOVE],
    'UPGRADER' : [WORK, CARRY, MOVE],
    'BUILDER' : [WORK, CARRY, MOVE],
    'CARGO' : [CARRY, MOVE],
    'EXPLORER' : [MOVE]
}

/* Notes

   Bodypart cost constant = BODYPART_COST
*/

var creep = {
    run: function(creep){
          
    },
    
    create: function(spawn, creepTypeIn) {
        var body = bodyTemplate[creepTypeIn].slice();
        var bodyTemp = bodyTemplate[creepTypeIn].slice();
        var bodyCost = 0;
        for (var i = 0; i < body.length; i++) bodyCost += BODYPART_COST[body[i]];
        var energyAvailable = spawn.room.energyCapacityAvailable - bodyCost; 
        
        while (energyAvailable >= bodyCost){
            body.push(bodyTemp)
            energyAvailable -= bodyCost;
        }
        
        var name = creepTypeIn + Game.time;
        
        var memoryObject = {creepType: creepTypeIn}
        
        var spawnResult = spawn.spawnCreep(body, name, {memory: memoryObject})
        if (spawnResult == 0) console.log('Spawning ' + name + ' from ' + spawn.name + '.' + spawn.room.name);
    }
    
};

module.exports.creep = creep;
module.exports.creepType = creepType;