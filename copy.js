class PuppeteerManager {
    constructor(args) {
        this.url = args.url
        this.existingCommands = args.commands
        this.nrOfPages = args.nrOfPages
        this.allBooks = [];
        this.booksDetails = {}
    }

    async runPuppeteer() {
        const puppeteer = require('puppeteer')
        let commands = []
        if (this.nrOfPages > 1) {
            for (let i = 0; i < this.nrOfPages; i++) {
                if (i < this.nrOfPages - 1) {
                    commands.push(...this.existingCommands)
                } else {
                    commands.push(this.existingCommands[0])
                }
            }
        } else {
            commands = this.existingCommands
        }
        console.log('commands length', commands.length)

        const browser = await puppeteer.launch({
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-gpu",
            ]
        });

        let page = await browser.newPage()
        await page.setRequestInterception(true);
        page.on('request', (request) => {
            if (['image'].indexOf(request.resourceType()) !== -1) {
                request.abort();
            } else {
                request.continue();
            }
        });

        await page.on('console', msg => {
            for (let i = 0; i < msg._args.length; ++i) {
                msg._args[i].jsonValue().then(result => {
                    console.log(result);
                })

            }
        });

        await page.goto(this.url);

        let timeout = 6000
        let commandIndex = 0
        while (commandIndex < commands.length) {
            try {
         
                console.log(`command ${(commandIndex + 1)}/${commands.length}`)
                let frames = page.frames()
                await frames[0].waitForSelector(commands[commandIndex].locatorCss, { timeout: timeout })
                await this.executeCommand(frames[0], commands[commandIndex])
                await this.sleep(1000)
            } catch (error) {
                console.log(error)
                break
            }
            commandIndex++
        }
        console.log('done')
        await browser.close();
    }
}