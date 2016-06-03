'use strict'

function INIParser(str) {
  let ini = [{name:'global', settings:[]}];
  let lines = str.split(/\r?\n/);

  let commonReg = /^\s*(;.*)?$/;
  let sectionNameReg = /^\[(.+)\]$/;
  let settingsReg = /^(\w+)=(.*)$/;
  lines
    .filter((line) => {
      return !commonReg.test(line) && line.length != 0;
    })
    .reduce((section, line) => {
      if (sectionNameReg.test(line)) {
        let newSection = createNewSection(line, sectionNameReg);
        ini.push(newSection);
        return newSection;
      }

      if (!settingsReg.test(line)) {
        throw new Error('INI format invalid: ');
      }

      let matchs = settingsReg.exec(line);
      section.settings.push({name: matchs[1], value: matchs[2]});
      return section;

    }, ini[0]);

  return ini;
}

function createNewSection(line, sectionNameReg) {
  let newName = sectionNameReg.exec(line)[1];
  let newSection = Object.create(null);
  newSection.name = newName;
  newSection.settings = [];

  return newSection;
}


const str = 'link=https://google.com\n;this is common, haha ~ haskdfadsf ad\n;next is new section\n[account]\naccount=mistkafka\npassword=k32348usdmfawieu3faf\n\n\n\n[profile]\nname=mistkafka\nsex=male\nage=23';

const INI = INIParser(str);

console.log(JSON.stringify(INI));
