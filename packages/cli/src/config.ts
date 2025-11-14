export class Config {
    public sourceAngularConfig: string = 'config.angular.json';
    public targetAngularConfig: string = 'angular.json';
    public sourceProjectConfig: string = 'config.project.json';
    public targetProjectConfig: string = 'project.json';
    public extDir: string = 'src/app/ext';
    public extMask: string = this.extDir + '/*';
    public locales: string[] = ['en', 'ru', 'uk', 'de', 'it'];

}
