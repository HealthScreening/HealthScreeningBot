module.exports = function (info, migrationCommands) {
  return {
    pos: 0,
    up(queryInterface) {
      let index = this.pos;
      return new Promise((resolve, reject) => {
        function next() {
          if (index < migrationCommands.length) {
            const command = migrationCommands[index];
            console.log(`[#${index}] execute: ${command.fn}`);
            index++;
            queryInterface[command.fn]
              .bind(queryInterface)(...command.params)
              .then(next, reject);
          } else {
            resolve(null);
          }
        }

        next();
      });
    },
    info,
  };
};
