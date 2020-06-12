
// Requiring bcrypt for password hashing. Using the bcryptjs version as the regular bcrypt module sometimes causes errors on Windows machines

const bcrypt = require("bcryptjs");

// Creating our User model

module.exports = function(sequelize, DataTypes) {

  const Activity = sequelize.define("Activity", {

    // The email cannot be null, and must be a proper email before creation

    User_id: {

      type: DataTypes.INTEGER,

      allowNull: false,


    },

    // Trip_ID cannot be null

    Trip_ID: {

      type: DataTypes.INTEGER,

      allowNull: false,


    },

    // The password cannot be null

    Country: {

      type: DataTypes.STRING,

      allowNull: false

    },

    City: {

        type: DataTypes.STRING,
  
        allowNull: false
  
      },

      Activity_1: {

        type: DataTypes.STRING,
  
        allowNull: false
  
      },

      Activity_2: {

        type: DataTypes.STRING,
         
      },

      Activity_3: {

        type: DataTypes.STRING,
    
      },

      Activity_4: {

        type: DataTypes.STRING,
 
      },

      Itinerary_5: {

        type: DataTypes.STRING,
  
      }

  });


  return Activity;

};