require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const OPERATOR = "!";
const parties = [
    {
        max_players: 2,
        player_names: ["[EMPTY]", "[EMPTY]"],
        ready_players: 0
    },
    {
        max_players: 3,
        player_names: ["[EMPTY]", "[EMPTY]", "[EMPTY]"],
        ready_players: 0
    },
    {
        max_players: 4,
        player_names: ["[EMPTY]", "[EMPTY]", "[EMPTY]", "[EMPTY]"],
        ready_players: 0
    }
]

client.login(process.env.BOTTOKEN);

const join_command_action = (name, value) => {
    //check if value is proper (2,3,4)
    if (value < 2 || value > 4)
        return null;
    const index = value - 2;
    //check if player is in party
    if (parties[index].player_names.includes("[" + name + "]"))
        return "Player already exists in party...";

    //add player to party
    parties[index].player_names[parties[index].ready_players++] = "[" + name + "]"
    let ret = "";
    parties[index].player_names.forEach(player_name => ret += player_name + ", ");
    ret = ret.substr(0, ret.length - 2);
    //check if party is full => empty the party
    if (parties[index].ready_players == value) {
        //party is ready. let everyone know and empty the party
        //#TODO - let everyone know
        console.log("#TODO - letting everyone know...");
        //empty the party
        parties[index].ready_players = 0;
        parties[index].player_names.splice(0, value);
        for (i = 0; i < value; i++)
            parties[index].player_names.push("[EMPTY]");
    }
    return ret;
}

const show_command_action = value => {
    if (value < 2 || value > 4)
        return null;
    const index = value - 2;
    let ret = "";
    parties[index].player_names.forEach(player_name => ret += player_name + ", ");
    return ret;
}

client.on('message', (data) => {
    let command = data.content;
    const player_name = data.author.username;
    //check if message has an operator (message is a command for the bot)
    if (command.startsWith(OPERATOR) === false)
        return;
    const val = command.substring(command.indexOf(" "));
    command = command.substr(OPERATOR.length, command.indexOf(" ") - OPERATOR.length);
    //check if the command is "join"
    if (command === "join") {
        const ret = join_command_action(player_name, val);
        if (ret) data.reply(ret);
    }
    else if (command === "show") data.reply(show_command_action(val));
    else if (command === "remove") console.log("#TODO - Add a remove functionality to remove the user");
});