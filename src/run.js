import chalk from "chalk";


export const blue = (s) => {
    return console.log(chalk.blue(s))
}

export const green = (s) => {
    return console.log(chalk.green(s))
}

export const red = (s) => {
    return console.log(chalk.red(s))
}

export const blueBg = (s) => {
    return console.log(chalk.bgBlue(s))
}

export const greenBg = (s) => {
    return console.log(chalk.bgGreen(s))
}

export const redBg = (s) => {
    return console.log(chalk.bgRed(s))
}



