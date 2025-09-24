export class Config {
    public sourceAngularConfig: string = 'project.json';
    public targetAngularConfig: string = 'project.json';
    public extDir: string = 'src/app/ext';
    public extMask: string = this.extDir + '/*';
    public locales: string[] = ['en', 'ru', 'uk', 'de', 'it'];

}
