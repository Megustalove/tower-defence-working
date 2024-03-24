/**
 * game and state together hold the random functions and game information that needs to be accessed across the file.
 * update it whenever you need to add something at agame level
 */
// Global TODO
// Music/sound - Ron
// Extra types of towers - Hieu
// Enemy types - Saul
// Flying enemy
// Boss monster/ seige weapon
// High Score
// terrain collision
// Turrets spawn at cursor instead of where player is standing
// Off limit building paths
// See through/semi transparent hud
// Fix animation
// Sync day/night with level and sun/moon

export const state = {
  EnemySpawner: [],
  //this is the function that spawns enemeies
  spawn: null,
  spawnedEnemies: 0,
  currentEnemies: [],
  maxEnemies: 15,
  enemiesDestroyed: 0,
  ore: [],
  s: null,

  health: 100,
  maxHealth: 1000,
  getHealth: function () {
    return this.health.toString();
  },
  getCurrency: function () {
    return this.currency.toString();
  },

  turretSpawner: [],
  turrets: [],
  buildT: null,
  spawnedTurrets: 0,
  maxTurrets: 10,
  currency: 500,

  needsUpdate: false,
  gameOver: false,
  shipHit: null,
  skip: null,
  buildTime: 15,

  levelUp: null,
  day: true,
  pauseEnemies: true,
  pauseBuilding: false,
  buttonFunctions: [

    function () {
      if(state.currency - state.attackDamageCost < 0) return;
      state.currency -= state.attackDamageCost;
      state.attackDamageCost += 50;
      state.attackDamage += 10;
      state.needsUpdate = true;
      state.poisonDamage += 0.5;
      for (turret in state.turrets) {
        if (turret.TypeName != 'poison') turret.damage = state.attackDamage;
      }
      return 'ATTACK DAMAGE UPGRADE\n' + state.attackDamageCost.toString();
    },

    function () {
      if(state.currency - state.attackRangeCost < 0) return;  
      state.currency -= state.attackRangeCost;
      state.attackRangeCost *=2;
      state.attackRange += .5;
      state.needsUpdate = true;
      for( turret in state.turrets){
        turret.object.getComponent('collision').extents = [state.attackRange, 0, 0];  
      }
      return 'TURRET RANGE UPGRADE\n' + state.attackRangeCost.toString();
    },

    function () {
      if(state.currency - state.attackSpeedCost < 0) return;  
      state.currency -= state.attackSpeedCost;
      state.attackSpeedCost += 50;
      state.attackSpeed -= 0.1;
      state.needsUpdate = true;
      return 'ATTACK SPEED UPGRADE\n' + state.attackSpeedCost();
    },

    function () {
      if(state.currency - state.profitUpCost < 0) return; 
      state.currency -= state.profitUpCost;
      state.profitUpCost *= 3;
      state.bonus += 2;
      state.needsUpdate = true;
      return 'PROFIT UPGRADE\n' + state.profitUpCost.toString();
    },

    function () {
      if(state.currency - state.healthUpCost < 0) return;
        if(state.maxHealth - state.health  > 0)
        {
          state.currency -= (state.maxHealth - state.health);
          state.health = state.maxHealth ;
          if(state.currency < 0) state.health += state.currency;
          state.currency = 0;
        }
        else 
        {
          state.currency -= state.healthUpCost;
          state.healthUpCost *= 4;
          state.maxHealth *= 2;
        }
        state.needsUpdate = true;
      return 'SHIP HEALTH UPGRADE\n' + state.healthUpCost.toString();
    },
  ],
  attackDamageCost: 50,
  attackRangeCost: 50,
  attackSpeedCost: 50,
  profitUpCost: 50,
  healthUpCost: 50,

  attackDamage: 10,
  poisonDamage: 1.0,
  attackRange: 5.0,
  attackSpeed: 10,
  profitUp: 10,
  healthUp: 10,
  bonus: 0,

  defaultTurret3D: null,
  poisonTurret3D: null,
};
