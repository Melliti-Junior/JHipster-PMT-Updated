export class Epics {
    code: string;
    name: string;
    summary: string;

    constructor(cde: string, nm: string, smry: string) {
        this.code = cde;
        this.name = nm;
        this.summary = smry;
    }
}
