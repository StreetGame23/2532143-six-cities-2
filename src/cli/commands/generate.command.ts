import got from "got";
import { MockServerData } from "../../shared/types/index.js";
import { Command } from "./command.interface.js";
import { TSVOfferGenerator } from "../../shared/libs/offer-generator/index.js";
import { getErrorMessage } from "../../shared/helpers/index.js";
import { TSVFileWriter } from "../../shared/libs/file-writer/index.js";


export class GenerateCommand implements Command {
    private initialData: MockServerData;
    
    private async load(url: string) {
        try {
            this.initialData = await got.get(url).json();
        } catch {
            throw new Error(`Can't load data from ${url}`);
        }
    }

    private async write(filepath: string, offerCount: number) {
        const tsvOfferGenerator = new TSVOfferGenerator(this.initialData);
        const fileWriter = new TSVFileWriter(filepath);
        for (let i = 0; i < offerCount; i++) {
            await fileWriter.write(tsvOfferGenerator.generate());
        }
    }

    public getName(): string {
        return '--generate';
    }

    public async execute(...parameters: string[]): Promise<void> {
        const [count, filepath = 'mocks/test-data.tsv', url = 'http://localhost:3123/api'] = parameters;
        const offerCount = Number.parseInt(count, 10);

        try {
            await this.load(url);
            await this.write(filepath, offerCount);
            console.info(`File ${filepath} has been generated!`);
        } catch (error: unknown) {
            console.error(`Can't generate data`);

            console.error(getErrorMessage(error));
        }
    }
} 