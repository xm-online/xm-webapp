import { ComponentFixture, TestBed } from '@angular/core/testing';
import { XmAceEditorControl, XmAceEditorControlOptions } from './xm-ace-editor-control';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';

describe('XmAceEditorControl', () => {
    let fixture: ComponentFixture<XmAceEditorControl>;
    let component: XmAceEditorControl;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                XmAceEditorControl,
                XmTranslationTestingModule,
                ControlErrorModule.forRoot(null),
            ],
        });

        fixture = TestBed.createComponent(XmAceEditorControl);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    it('should create', () => {
        void expect(component).toBeTruthy();
    });

    it('should initialize with default options', () => {
        const defaultOptions: XmAceEditorControlOptions = {
            options: {},
            title: '',
            name: 'text',
            mode: 'json',
            height: '200px',
            theme: 'chrome',
            darkTheme: 'tomorrow_night',
            enableInitialFocus: false,
        };
        fixture.detectChanges();

        void expect(component.config).toEqual(defaultOptions);
    });

    it('should display a label if title is provided', () => {
        component.config.title = 'Test Title';
        fixture.detectChanges();

        const labelElement = fixture.nativeElement.querySelector('.control-label');
        void expect(labelElement.textContent).toContain('Test Title');
    });

    it('should parse JSON input value when mode is "json"', () => {
        component.config.mode = 'json';
        const jsonValue = '{"key": "value"}';
        component.value = jsonValue;
        fixture.detectChanges();

        void expect(component.value).toEqual(jsonValue);
    });

    it('should stringify value when mode is "object-to-json" and input value is an object', () => {
        component.config.mode = 'object-to-json';
        const objectValue = { key: 'value' };
        component.value = objectValue;
        fixture.detectChanges();

        void expect(component.value).toEqual(objectValue);
    });

    it('should handle JSON input value when mode is "json"', () => {
        component.config.mode = 'json';
        const jsonValue = '{key: "value"}';
        component.value = jsonValue;
        fixture.detectChanges();

        void expect(component.value).toBe(jsonValue);
    });

    it('should parse YAML input value when mode is "yaml"', () => {
        component.config.mode = 'yaml';
        const yamlValue = 'key: value';
        component.value = yamlValue;
        fixture.detectChanges();

        void expect(component.value).toEqual(yamlValue);
    });

    it('should stringify value when mode is "object-to-yaml" and input value is an object', () => {
        component.config.mode = 'object-to-yaml';
        const objectValue = { key: 'value' };
        component.value = objectValue;
        void expect(component.value).toEqual(objectValue);
    });
});
